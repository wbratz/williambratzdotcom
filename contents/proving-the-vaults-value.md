---
title: "Testing the Vault’s Value: Does Domain Context Make Coding Agents Better?"
slug: proving-the-vaults-value
date: 2026-11-19
updated: 2026-11-25
description: I replayed real engineering changes with the Vault on and off, and blind judges graded every result. The direction is encouraging, but 24 runs per setup is too small a sample to call it proof.
photo: "./blogContent/proving-the-vaults-value/vault-results.svg"
banner: "../blogContent/proving-the-vaults-value/vault-results.svg"
imageAlt: A bar chart of blind runs with and without the Vault, 24 per setup. Opus accepted changes went from 11 to 16 of 24, blocker and major bugs from 9 to 0, and cost per accepted change from $7.79 to $4.12. Sonnet went from 7 to 8 accepted, 16 to 10 serious bugs, and $4.70 to $3.31. The chart notes that the sample is small.
topics:
  - AI Systems
  - Knowledge Systems
series: Measuring the Vault
seriesOrder: 1
sectionLinks: true
featured: true
---

*Updated November 25, 2026. The first version of this post answered its own question with "It does." and led with percentages: 45% more accepted changes, 47% lower cost per accepted change. Those came from 12 work requests, each run twice per setup. That's too small a sample to tell a real gain from noise, and the post should have said so first. I rewrote the opening to give the raw counts and the design. I also corrected the standards section, which said rules now arrive the moment the agent edits a file. Two months of daily use didn't back that up. The numbers haven't changed, but I'm claiming less from them. [The follow-up](/blog/vault-in-daily-use) covers what daily use showed.*

Does giving a coding agent your team's context produce better code? I replayed 12 real work requests with [the Vault](/projects/vault) switched on and off, and blind judges graded every result. The direction was encouraging. The sample was too small to call it proof.

Accepted changes, out of 24 runs per setup:

- **Opus:** 11 without the Vault, 16 with it.
- **Sonnet:** 7 without, 8 with.

Every work request ran twice per setup, so those 24 runs are 12 work requests, not 24 independent tries. Two runs of the same work request share the same task, so they're likely to pass or fail together. At this size, a gap of five accepted changes could come from a few work requests landing the other way. I'm not putting a percentage or a significance test on it. It's a reason to keep testing with more work requests, not a result I'd bet on yet.

## How I tested it

Every run started from the commit before the original work, with the work request as it read that day and a snapshot of the Vault from that date, answer removed.

- **12 real work requests** of four kinds: bugs, ambiguous asks, coding-standards traps, and requests for things that already existed.
- **Two models,** with and without the Vault. Each work request ran twice per setup, so 24 runs per setup. The study ran 144 runs in all across six setups, and the table below shows the four that compare with and without the Vault.
- **Blind judges** scored every change against an answer key and a reviewer profile built from 1,277 real team review comments, alongside automated checks and two independent rankings. They never saw which setup produced a change.

**Accepted** means correct, no blocker, no regression, and a reviewer would approve it as is.

| Setup (24 runs each) | Accepted | Blocker / major bugs | Cost per accepted |
| -------------------- | -------: | -------------------: | ----------------: |
| Opus, no Vault       |       11 |                3 / 6 |             $7.79 |
| Opus + Vault         |       16 |                0 / 0 |             $4.12 |
| Sonnet, no Vault     |        7 |               3 / 13 |             $4.70 |
| Sonnet + Vault       |        8 |                1 / 9 |             $3.31 |

The other columns need the same care as the accepted count. Opus with the Vault had no blocker or major bugs, down from 9, but it's the same 24 runs, and two runs of one hard work request can account for several serious bugs. Sonnet with the Vault still had 10, down from 16. Cost per accepted change divides total cost by the accepted count, so it carries all of that count's noise. Opus runs with the Vault also averaged 9.1 minutes per change, down from 12.8, with the same caveat.

## Code that belongs in the codebase

The clearest pattern in the graded changes was fit: changes that look like the team wrote them. With the Vault, runs more often followed existing precedent, reused what was already there, and avoided mistakes the team had already learned from. In daily use, too, the pages that did the most work in coding sessions were records of earlier decisions and notes on how parts of the code work.

## Agents that push back on unnecessary work

Two of the 12 work requests asked for the wrong thing. Without the Vault, 0 of 8 runs got those right. One of them asked for something that already existed, and the runs without the Vault built a duplicate. With the Vault, the runs on that one spotted the existing solution and said so, in 3 minutes or less and for $0.17 to $1.07 each. That's two work requests, so treat it as an example of what's possible, not a rate. In daily use the Vault missed this at least once. I had to ask "don't we already have this?" while the answer sat in five pages.

## Standards at the edit

On two coding-standards work requests, runs that followed the rule went from 0 of 8 to 6 of 8, and runs a reviewer would accept as is went from 0 of 8 to 5 of 8.

Read that narrowly. I picked those two work requests because an earlier round showed agents missing the rules. Then I wrote those rules into edit-time triggers, which hand the agent a rule when it writes a file the rule covers, and re-ran the same two. Each model ran each work request twice per setup. It shows a rule I already knew about reaching the agent at the right moment and changing what it wrote. It doesn't show the Vault finding a rule nobody had written down. [Rules at the Edit](/blog/rules-at-the-edit) has the details.

The first version of this section said each rule now arrives the moment the agent edits a file it covers. Daily use says otherwise. In two months, the edit-time hook fired 13 times. All 13 came from shell commands, and only about 1 was a real write to the right file. The rest were read-only commands, or commands that only mentioned a matching path. A rule shows once per session, so a false fire can use up the delivery before the real edit happens. I've since changed the hook to fire only on real writes, and it checks out against recorded commands ([details](/blog/vault-in-daily-use)). Until it has run in live sessions, I can't say rules reliably arrive at the edit in everyday work.

## Tuning the workflow

The same runs hinted at which workflow steps pay off. One heavier step cost 2.1 times as much for the stronger model without improving its results, and it lifted the smaller one. It now runs only where it helped. The doubled cost is clear. Whether it helped has the same small-sample caveat as everything else here.

## Cheap to run

The agent runs cost about $400 in model time, and with judging the whole study came in under $500. That's cheap enough to repeat with many more work requests, which is what this result needs before I'd call anything proven.

Two runs per work request per setup. Judges never saw which setup produced a change. Full method on request.

## Try it

Start your own Vault with [vault-scaffold](https://github.com/wbratz/vault-scaffold): one domain, one folder, one real workflow. Read [how the Vault works](/coding-agents) or the [architecture](/projects/vault). If you run your own replay, use more work requests than I did.
