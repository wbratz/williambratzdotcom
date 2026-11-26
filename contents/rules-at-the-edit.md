---
title: "Rules at the Edit: You Can’t Search for a Rule You Don’t Know Exists"
slug: rules-at-the-edit
date: 2026-11-23
updated: 2026-11-26
description: I kept correcting my AI coding agent on rules I'd already saved in the Vault. I replayed two tasks to see what changed when the agent received the rule just before editing the file.
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

I kept correcting my AI coding agent on things I'd already written down in [the Vault](/projects/vault), the knowledge base I built for my agents to use across sessions. When an agent starts work, it gets a short guide to the Vault. It can then look up a team decision and read the source behind it. After one of those corrections, I went back through the session to see what the agent had read.

I'd asked it to give a service a production timeout. It opened `config/prod.json` and put the number there. I knew from the diff what needed fixing. On this team, production values live in a config service, and the application reads them at runtime. The Vault page explained that. The session showed the agent had never opened it.

That left me with a question I could test. With a file called `prod.json` in front of it, what would prompt the agent to check where production settings belonged?

## The knowledge was there

I replayed the timeout request and a second task about how to write a tool's description. I used two models, each with and without access to the Vault, for 24 runs in all. None of the runs got its task right. Every run on the timeout put the value in the production file. On the tool description, five runs wrote instructions into it ("call this when…") instead of saying what the tool returns.

The runs that had the knowledge base did no better, because almost none opened the page. In one setup, one run in eight opened one of the three pages that held the rule.

The rule was available in every run that had the knowledge base. Opening the production file still gave the agent no clue that a team rule applied to it.

## Why search started too late

A search box can answer a question once someone asks it. Here the useful question would have been, "Where does this team put production settings?" The agent had already found a file that looked like an answer.

I'd seen the same sequence on a deployment. An agent searched for the deployment rule after the deploy failed. It found the page then. At that point I could improve the search result, but it was the failure that had finally supplied the question.

## What the file path gives you

"Set a timeout" could mean a default, a test setting or a production value. By the time the agent asks its editing tool to write `config/prod.json`, the tool call names a file a person can match to a rule.

I put that match on the rule page. When the tool names the file, the hook can hand the agent one useful sentence: put the value in the config service and read it at runtime. The patch is still a proposal. The agent has time to put the number in the right place.

I'd already been filing rules under the places they apply, so a rule learned in one project can reach another. The hook uses that same question at a smaller scale: what does this particular file need the agent to know before it changes?

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

My first shell check went too far. A command could read the production config and save its output in a scratch file. The hook saw a command that writes and a path that matches the rule. It delivered the reminder during the read and marked it as shown. A later write to the production config could then go through in silence.

The hook now checks which file receives the write. A real write can use up the once-per-session reminder. If the hook can only tell that a script might write the file, it can show a warning and leave that reminder available. I checked the sequence directly: read the file, write it later in the same session, and verify that the rule still arrives before the write. In a replay of 60 days of commands, all 45 matches from the new hook were actual writes. I haven't measured how many applicable writes it may still miss.

*Update, November 25, 2026: the false-alarm part was wrong. In two months of daily use the hook fired 13 times, all from shell commands, and only about 1 of those was a real write to the right file. The rest were read-only commands, or commands that only mentioned a matching path. Because each rule shows once per session, a false fire doesn't cost one paragraph. It uses up the delivery, so the rule may not show up when the real edit comes. I've since changed the hook to fire only on real writes. It checks out against recorded commands, but I haven't seen it in live sessions yet. [The Vault in Daily Use](/blog/vault-in-daily-use) has the details.*

**The harder problem I haven't measured.** A rule delivered at the moment of authority carries more weight than the same rule buried in a search result. That's the point, and it's also the risk. A stale or wrong rule, delivered at the edit, gets obeyed with confidence. I haven't tested what an agent does when the code in front of it contradicts the rule it was just handed. The best I have so far is practice: the pages the rules come from cite their sources, and my own hook's message tells the agent to check its edit against the rule and not just follow it. I'd want that tested before I trusted this on rules that age quickly.

## What to check after a miss

Start with the bad diff. For the timeout, I want to know what the agent had in front of it before it put a value in the production file. Look for the rule, read its source, and find the tool call that made the edit. The session record can point to three different fixes.

1. **The Vault had no applicable rule.** Add guidance once the evidence supports it. Say which files or decisions it governs and where the rule comes from.
2. **The rule existed but arrived late or never arrived.** Move it to the decision it governs. A file-specific rule can arrive before the write. “Check whether this already exists” belongs before the agent settles on what to build. Check what the agent received in a fresh session, including the write path it actually used.
3. **The agent saw the rule in time but misunderstood it.** Review the wording and source together. Make the scope explicit and give examples on either side of that boundary. If the rule conflicts with current evidence, resolve that conflict before delivering it again.

Replay the task after the fix and check two things. The session record should show the rule arriving before the write. The resulting diff should show where the timeout actually went. If the first check passes and the second fails, look at how the agent read the rule before adjusting the hook.

## Where it doesn't fit

- **It doesn't make the agent obey.** Delivery is not compliance. I measured whether the output followed the rule, and I'd do that again for any new rule.
- **It only fits rules tied to a file path.** A rule about approach, like "check whether this already exists before building it," has no file to attach to. That one needs a different moment.
- **A bad pattern misses or spams.** Too narrow and the rule never fires. Too broad and the agent learns to skim.
- **Every rule costs context.** Keep each one to what a person would need to avoid the mistake.

## The hook

This is the direct-edit version. It uses the file path supplied by the editing tool. For shell commands, add a check for the file that actually receives the write.

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

For a broader look at how agents perform with and without the Vault, see [the blind study](/blog/proving-the-vaults-value).
