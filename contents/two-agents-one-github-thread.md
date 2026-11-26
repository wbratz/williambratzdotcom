---
title: "Two Agents, Two Vaults, One GitHub Thread"
slug: two-agents-one-github-thread
date: 2026-11-26
description: "I used GitHub Issues to let Claude Code and Codex work together from separate machines. They tested a real Vault failure and brought back decisions I could verify."
photo: "./blogContent/vault-context-system/context-loop.svg"
banner: "../blogContent/vault-context-system/context-loop.svg"
imageAlt: A diagram showing the Vault context loop from source evidence through maintained knowledge, targeted delivery, evaluation, and revision.
topics:
  - AI Systems
  - Knowledge Systems
sectionLinks: true
featured: false
---

Could two AI agents work together on the same problem while keeping their files, context, and permissions separate?

On my work Mac, Claude Code had months of experience using my Vault, a knowledge base it could search for earlier decisions, standards, and lessons. At home, Codex had been researching how knowledge systems organize evidence and how an agent can tell what a source actually supports. Claude could point to where the Vault helped in daily work and where it fell short. Codex could turn those failures into questions we could test. I wanted them to compare notes and bring me a recommendation. I used GitHub Issues as their shared message board.

## One GitHub thread, two workspaces

Each conversation lived in a single GitHub issue. When Claude posted a comment, a watcher on my home machine passed the thread into a fresh Codex session and posted its reply. The work machine did the same in reverse.

The thread kept the proposals, objections, and results in one place. Each agent still worked on its own machine, with its own tools, files, and permissions. The home watcher ran in Ubuntu on Windows. The work watcher ran on macOS. Both posted from the same GitHub account, so `[claude]` and `[codex]` identified the speaker. Each watcher had a turn limit, and a `[done]` message could close the thread.

At home, Codex could read the shared blueprint and one approved lessons page from my Vault. It could write disposable files in scratch. Claude's work-side watcher had a test directory and a narrow way to make logged, budgeted model calls. Both agent shells had network access disabled. The watcher processes handled GitHub, and only synthetic examples, generalized lessons, and cleared results could cross it.

## What I handed off

I told the agents to go for it. They could pursue side questions, run isolated tests, and compare what they found. I wanted them to agree on a proposal and bring it back to me for approval.

I had a separate interactive supervisor on each machine. They used their own GitHub thread to coordinate which side would run a test and how much it could spend. A supervisor could add a label to pause their watcher on a particular thread. That stopped new turns. A reply already underway could still finish.

One result included a machine-local path. The work supervisor removed it from the visible reply, and the original remained in edit history. A sandbox limits which files an agent can open. A reply can still disclose a path the agent already knows, so what goes into the thread needs its own boundary.

## A sign is a smaller decision than a move

In the first exercise, we handed Codex the right notes and asked what they authorized. It got all 15 decisions right, so we stopped before testing reminders or richer labels. That left a separate question open. Would Codex find those notes on its own?

The next test started with a real Vault failure. A claim had passed a quote check even though it overstated its source. The agents made up an example:

> The site lead approved a sign pointing to the south entrance.
>
> The draft said the site lead approved moving registration to the south entrance.

The draft quoted words that really were in the source. It used them to describe a different decision.

Codex wrote eight cases and fixed the answer key before any calls. Claude would run each case twice with the existing review prompt and twice with a version that added one sentence about who spoke, how far their statement applied, and whether it recorded a proposal, decision, or result. The agents agreed to keep the checklist only if it caught more overstatements on at least two cases without increasing false rejections.

The first work-side run stopped before making a model call. Claude's sandbox refused the shell command that prepared the prompt files. The work supervisor routed file creation through the lab's allowed write tool and verified a batch runner that starts fresh, tool-less model sessions. Claude then ran the agreed **32 Haiku calls**. Each answer was one word, so both supervisors could score it directly.

**Both prompts scored 16 out of 16. Neither rejected an accurate claim.** The agents had agreed that a tie meant keeping the current prompt and ending the test. I had stepped away from the turn-by-turn exchange. When I checked back, I could see the cases, the scoring rule, and why they'd stopped.

## The useful changes came from daily work

The work supervisor prepared a usage digest for me to review before sharing it. At least **six of 49 corrections** concerned something the Vault already knew. That gave the agents a problem worth following. Where was the rule when the agent needed it?

I approved a separate implementation pass on the work Vault. At home, three agents inspected the corresponding areas and brought back proposals.

- **A rule had fallen out of view.** A design standard behind several corrections appeared in zero of 25 source indexes. After the change it appeared in all 25. The edit hook also went from 20 correct to 31 on the same 31 fixtures. A supervisor verified that reading a file left the reminder available for a real write to it later in the same session.
- **The checker already had the two pages.** The agents first suspected that a checker never compared pages across those sections. The work audit found the pair around 246th in a queue that spent its weekly budget on the same top 12. When a model read both pages directly, it found a condition that reconciled the wording. The outdated instruction was still there. The proposal shifted to finding every page that repeats an old claim when a correction is confirmed.
- **The smaller index still surfaced the rule.** The largest work index went from about 8,400 to 4,700 tokens. In a same-day replay across seven synthetic tasks, agents found the relevant rule in 21 of 21 runs with either version. The new version combined the trim with better links to standards. The replay supports keeping that combination for the tested cases. How often agents apply the rules in daily work remains open.

At home, the Vault already loaded a small pointer at startup and had no equivalent edit hook. Its clearest finding came from an answer review. Codex found the right passage, then dropped the date and scope that limited what it could claim. The home proposal was to keep those limits attached to the evidence the reviewer sees.

## What I'd keep

Claude's work experience and Codex's home research were useful together because each brought something the other lacked. A GitHub thread gave them enough shared context to compare evidence, challenge a test, and agree on what to try. Their private files and permissions stayed separate.

The most useful thing we agreed on was **what we'd do with the result before we ran the test**. When both review prompts scored perfectly, the agents stopped. When the smaller index still surfaced the rule in every replay, we had a reason to keep it. When the contradiction check exposed a flaw in our explanation, we changed the proposal. Each result led to a decision I could trace back through the thread.

That's what made me comfortable stepping away. The agents could make progress on their own, and the supervisors could pause the exchange if it wandered. When I came back, I could see what the agents had tried, where they'd changed their minds, and which decisions were still mine.
