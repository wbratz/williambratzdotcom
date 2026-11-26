---
title: "Rules at the Edit: You Can’t Search for a Rule You Don’t Know Exists"
slug: rules-at-the-edit
date: 2026-11-23
updated: 2026-11-25
description: Retrieval assumes the agent knows to ask. The costliest misses are rules it has no reason to look up. Delivering a rule when the agent writes the file it governs took one set of runs from 0 of 8 following the rule to 6 of 8.
photo: "./blogContent/rules-at-the-edit/rules-at-the-edit.svg"
banner: "../blogContent/rules-at-the-edit/rules-at-the-edit.svg"
imageAlt: A diagram of three steps. An agent edits a config file, a hook matches the file path to a rule, and the rule arrives before the file is written.
topics:
  - AI Systems
  - Knowledge Systems
series: Measuring the Vault
seriesOrder: 2
sectionLinks: true
featured: true
---

I asked an agent to give a service a production timeout. It opened the production config file and typed the number in.

On this team, that's wrong. Production values live in a config service, and a rule says so. The rule was written down, cited, and filed under the right topic in my knowledge base. The agent never saw it, and nothing in its behavior suggested it knew there was anything to see.

That second part is the one I keep coming back to.

## The knowledge was there

I replayed two work requests like this, one about a production setting and one about how a tool's description should be written. I ran them against two models, with and without the knowledge base, 24 runs in all. None of the runs got either one right. Every run on the setting put the value in the production file. On the tool description, five runs wrote instructions into it ("call this when…") instead of saying what the tool returns.

The runs that had the knowledge base did no better, because almost none opened the page. In one setup, one run in eight opened one of the three pages that held the rule.

So the rule existed and the agent had access to it. The only thing missing was a reason to look.

## An agent can't search for what it doesn't know exists

Most work on retrieval is about finding the right page for a question. That work matters, and I've done a lot of it. But a search starts from a question, and these runs had no question. The agent read "set the production timeout," saw an obvious file, and felt fine. Nothing made it uncertain.

That's the failure. A model's search is driven by its own sense of what it doesn't know, and a rule you've never met doesn't register as a gap. Confidence and completeness feel the same from the inside.

I had seen the human version before. In an earlier session an agent found a deployment rule only after its deploy had failed. The page was one search away the whole time. The search came after the mistake, when the question finally existed.

Better ranking can't fix that. The page wasn't found late because it ranked badly. It was found late because nobody asked until something broke.

## The thing being changed knows which rules apply

If the agent can't know what to ask, something else has to know what to tell it. What reliably knows is the thing being changed. Whether a rule applies to a given change is mostly decided by the file, not by the words in the work request. "Set a timeout" says nothing about config services. The file it's about to touch does.

This is the delivery half of something I'd already found on the filing side. A rule learned on one project tends to be filed under that project, so it never reaches the others it applies to. I fixed that by filing each rule where it applies. The same idea holds for when the rule arrives: it should show up where it applies, at the moment it applies. Both are keyed to the thing being changed.

## Where a rule can arrive

Feedback on a change can reach an agent at several points, and each point knows something different.

| When | What is known | What it costs to act |
|---|---|---|
| The prompt, before work starts | The work request, loosely | Nothing yet, but no file is chosen. The rule can't be matched to anything. |
| **The edit** | **The exact file, and what is about to change** | **Cheap: the mistake doesn't exist yet** |
| Lint and tests | The written code | Cheap if a machine can check it |
| Review | The whole change | A rewrite |
| An incident | The consequence | A rollback |

Mechanical rules belong in the lint step. If a tool can check it, let the tool check it, and don't spend an agent's attention on it.

The rules worth delivering at the edit are the ones that need judgment and a reason: where a value lives and why, which pattern the team chose and what it replaced. No linter reads that. A person can carry it in a sentence, and an agent can carry the same sentence at the moment it matters.

I also tried the other end. I used to load a large chunk of my knowledge base at the start of every session, about 68 KB. I now load a router of roughly 2 KB and let pages arrive when they're needed. Front-loading pays the cost of every rule on every task and still doesn't put the right one in front of the file it governs.

## How it works

Three pieces, none of them clever.

1. **The rule is an ordinary page.** It's the short note a person would read anyway.
2. **A marker on the page says where it applies:** a file pattern and the section to hand over.
3. **A hook runs before a file is written.** It checks the path against the markers and returns any matching section as extra context.

The card:

```markdown
# Production config

<!-- rule path="config/.*\.json$" section="## Where prod values live" -->
## Where prod values live
Production values come from the config service, not from config/prod.json.
Add the setting to the service and read it at runtime. Don't hard-code it in the file.
```

Two choices matter more than they look. The trigger lives on the rule's own page, so adding a rule means editing a note and never touching the hook. And each rule appears once per session, because an agent editing the same file ten times needs the rule once.

## What happened

I re-ran the two work requests with the hook in place, with two models and two runs each: eight runs. The hook fired in all eight.

| | Without the hook | With the hook |
|---|---|---|
| Runs that followed the rule | 0 of 8 | **6 of 8** |
| Changes a reviewer would accept as is | 0 of 8 | **5 of 8** |
| Standards score from a blind reviewer (1–5) | 3.0 | **4.4** |

None of the eight edited the forbidden file or wrote the forbidden kind of description.

Here is what that number doesn't say. I wrote these two triggers after seeing these two failures, then tested them on the same two work requests. Eight runs is small. This shows the fix works for those rules. It doesn't show that delivering rules at the edit works in general. I did remove the lines in my notes that described the test, so the agent got the rule from the rule and not from my account of the experiment.

## What went wrong

**The first version watched the wrong thing.** It watched the edit tools. In a later test, one model built an entire new service by writing files through shell commands, dozens of them per run. The hook never fired for that model, and its runs missed the rule. The other model used the edit tools and got it. The knowledge base and the trigger were identical, and the outcomes were opposite, because of how the file got written.

I fixed it by treating any shell command that writes a file as an edit: a redirect, a copy, an in-place edit, a script that opens a file for writing. It checks every path-like word in the command against the rules. It over-matches on purpose, since a false alarm costs one paragraph once per session. The lesson is to trigger on the write and not on the tool that does it.

*Update, November 25, 2026: the false-alarm part was wrong. In two months of daily use the hook fired 13 times, all from shell commands, and only about 1 of those was a real write to the right file. The rest were read-only commands, or commands that only mentioned a matching path. Because each rule shows once per session, a false fire doesn't cost one paragraph. It uses up the delivery, so the rule may not show up when the real edit comes. I've since changed the hook to fire only on real writes. It checks out against recorded commands, but I haven't seen it in live sessions yet. [The Vault in Daily Use](/blog/vault-in-daily-use) has the details.*

**The harder problem I haven't measured.** A rule delivered at the moment of authority carries more weight than the same rule buried in a search result. That's the point, and it's also the risk. A stale or wrong rule, delivered at the edit, gets obeyed with confidence. I haven't tested what an agent does when the code in front of it contradicts the rule it was just handed. The best I have so far is practice: the pages the rules come from cite their sources, and my own hook's message tells the agent to check its edit against the rule and not just follow it. I'd want that tested before I trusted this on rules that age quickly.

## What to check after a miss

Start by looking for the rule and reading its source. Then check the session record for what the agent actually received before it made the decision. The same bad edit can point to three different fixes.

1. **The Vault had no applicable rule.** Add guidance once the evidence supports it. Say which files or decisions it governs and where the rule comes from.
2. **The rule existed but arrived late or never arrived.** Move it to the decision it governs. A file-specific rule can arrive before the write. “Check whether this already exists” belongs before the agent settles on what to build. Check what the agent received in a fresh session, including the write path it actually used.
3. **The agent saw the rule in time but misunderstood it.** Review the wording and source together. Make the scope explicit and give examples on either side of that boundary. If the rule conflicts with current evidence, resolve that conflict before delivering it again.

Replay the same task after the fix. Check when the agent received the rule and whether the final change followed it. If the rule arrived on time and the result was still wrong, inspect how the agent interpreted the rule before changing the trigger again.

## Where it doesn't fit

- **It doesn't make the agent obey.** Delivery is not compliance. I measured whether the output followed the rule, and I'd do that again for any new rule.
- **It only fits rules tied to a file path.** A rule about approach, like "check whether this already exists before building it," has no file to attach to. That one needs a different moment.
- **A bad pattern misses or spams.** Too narrow and the rule never fires. Too broad and the agent learns to skim.
- **Every rule costs context.** Keep each one to what a person would need to avoid the mistake.

## The hook

This is the whole thing. It handles the edit tools. If your agent also writes through the shell, you need the shell handling described above.

```js
#!/usr/bin/env node
// PreToolUse hook: when the agent is about to write a file a rule covers, hand it the rule.
const fs = require("fs");
const os = require("os");
const path = require("path");

const RULES = process.env.RULES_DIR;
const CARD = /<!--\s*rule\s+path="([^"]+)"\s+section="([^"]+)"\s*-->/g;

function section(text, heading) {
  // match the heading only at the start of a line, so the marker comment can't match itself
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`^${escaped}\\s*$`, "m").exec(text);
  if (!m) return "";
  const rest = text.slice(m.index + m[0].length);
  const next = rest.search(/\n#{1,2} /);
  return (next < 0 ? rest : rest.slice(0, next)).trim();
}

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const event = JSON.parse(raw);
    const file = event.tool_input && event.tool_input.file_path;
    if (!file || !RULES) return;

    const stateFile = path.join(os.tmpdir(), `rules-${event.session_id}.json`);
    let shown = [];
    try { shown = JSON.parse(fs.readFileSync(stateFile, "utf8")); } catch {}

    const out = [];
    for (const name of fs.readdirSync(RULES).filter((n) => n.endsWith(".md"))) {
      const text = fs.readFileSync(path.join(RULES, name), "utf8");
      for (const [, pattern, heading] of text.matchAll(CARD)) {
        const key = `${name}:${heading}`;
        if (shown.includes(key) || !new RegExp(pattern).test(file)) continue;
        shown.push(key);
        out.push(`Rule for ${path.basename(file)} (${name}):\n${section(text, heading).slice(0, 2000)}`);
      }
    }
    if (!out.length) return;
    fs.writeFileSync(stateFile, JSON.stringify(shown));
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: out.join("\n\n") },
    }));
  } catch {} // fail open: a broken rule card must never block an edit
});
```

Register it in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          { "type": "command", "command": "RULES_DIR=$HOME/team-rules node $HOME/bin/rule-at-the-edit.cjs" }
        ]
      }
    ]
  }
}
```

## Try it

Pick one rule your team keeps re-teaching, one that maps to a kind of file. Write it as a short page with the marker above and install the hook. Then test it the way I did: find a past change where the rule was broken, replay the same work request twice with the hook off and twice with it on, and count how many runs follow the rule.

If you'd rather an agent set it up, give it this:

> Add an edit-time rule hook to this repository. Find one rule in our docs that applies to a specific kind of file. Write it as a short page with a `<!-- rule path="..." section="..." -->` marker. Install a Claude Code PreToolUse hook on Write, Edit and MultiEdit that injects the marked section once per session when the file path matches. Fail open on any error. Then replay a past change where the rule was broken, with and without the hook, and report how many runs followed the rule.

The Vault is the system I built around this: the cited pages the rules come from, and the filing that gets each one to where it applies. [How it works](/projects/vault) and [the blind study](/blog/proving-the-vaults-value) cover the rest.
