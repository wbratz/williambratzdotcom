---
title: "The Vault in Daily Use: What Two Months of Sessions Showed"
slug: vault-in-daily-use
date: 2026-11-25
description: I went through two months of my own coding-agent sessions. The agent used the Vault in nearly every one and reused earlier decisions, but it also missed rules it had, trusted stale pages, and paid for nightly work that changed nothing.
photo: "./blogContent/vault-in-daily-use/daily-use.svg"
banner: "../blogContent/vault-in-daily-use/daily-use.svg"
imageAlt: A chart of three counts from two months of coding-agent sessions. 105 of 109 sessions searched, opened, or cited the Vault. 90 of 109 cited a page inline. About 1 of 13 edit-time rule fires was a real write to the right file.
topics:
  - AI Systems
  - Knowledge Systems
series: Measuring the Vault
seriesOrder: 3
sectionLinks: true
featured: true
---

The [first post in this series](/blog/proving-the-vaults-value) replayed old work requests with the Vault on and off. That was a controlled test, and a small one. This post looks at real work instead: about two months of my own sessions with the Vault on the whole time, and what the logs show about when it helped, when it failed, and what it cost.

The short version is that the agent used the Vault in almost every session, and the best moments came from one session writing something down that a later session needed. In most of the failures the Vault had the right answer somewhere and it didn't reach the agent, or it had a wrong answer and nothing caught it.

## What I counted

The Vault is a knowledge base an LLM maintains for my coding agent. Sessions and nightly jobs write the pages. Each session starts with a small table of contents, a search command finds pages, and a few rules get pushed into the session when the agent edits a file they cover.

I went through 109 interactive sessions, plus 147 short helper-agent sessions. The limits matter as much as the numbers:

- **Complete logs only cover 33 days.** The rest of the two months comes from long sessions the Vault archived on its own, so short sessions from that stretch are missing.
- **"Opened a page" means a command named the page's path.** That's a stand-in for reading it, not proof. An inline citation is better evidence the agent used a page, but whether the page was right still has to be checked.
- **Some numbers are counts and some are my labels.** Sorting sessions by task, or deciding which of my messages were real corrections, is one person's judgment. I say which is which below.
- **It's observational.** The Vault was always on, so nothing here shows it caused better work. The replay study in the first post is the only causal evidence I have, and it's small.

## How much the agent used it

- 105 of 109 sessions searched the Vault, opened a page, or cited one.
- 90 of 109 cited a page inline.
- 60 of 109 wrote something back.
- 14 of the 16 sessions that changed code read Vault content before their first edit.

The agent ran 466 searches. 1.7% found nothing and 2.8% failed to run. A search took 1.7 seconds at the median, which works out to about 7 seconds per coding session.

Most of that use wasn't writing code. By my labels, 44% of sessions were explaining, researching, or planning, 28% were code changes, and 9% were reviews of someone else's change.

## When it helped

The pattern that paid off was simple. One session learns something the hard way and writes it down, and a later session uses it without having to learn it again. Each of these is a single session, so they're examples, not rates.

- **A deploy trap.** A session hit a stuck deployment and wrote down the cause. Three weeks later another session warned me not to merge while that deploy was running, and said why.
- **Review notes nobody posted.** One day a session drafted review notes that never got posted. The next day a different session found them in the Vault and raised the riskiest one, a change that could have switched on a safety limit in the middle of a rollout.
- **Earlier decisions in a review.** A review of a colleague's change applied three earlier design decisions the reviewer hadn't written, and suggested shipping the feature switched off until the open questions were settled.
- **Decisions that stayed decided.** In several coding sessions an earlier decision page settled a question so the session didn't reopen it: "this entry point has no HTTP route on purpose," or "a missing value keeps today's behavior, an unknown one fails closed."
- **An outage.** During a firewall outage the agent gave an impact estimate in three messages, from one line in an index page saying what keeps running when the config store is unreachable.
- **A misleading error.** An "item not found" error was read correctly as a wrong-account problem. The same misread had cost days of outage before.
- **Test recipes.** Local test steps were reused as written, and an identical earlier change was found and its pattern copied.

By my reading of these cases, the pages doing the most work in coding sessions were decision pages, pulled from merged changes, and pages sessions wrote back about how part of the code works. Two broad sections, general patterns and package gotchas, were opened in zero coding sessions.

## When it failed

These are mostly single sessions too. What they have in common is that the Vault usually had the answer.

- **The rule was there, and nothing delivered it.** A session copied an outside system's event name into its own contract, then hard-coded a list the plan said would grow. I corrected both. A design standard covering both already existed, but no index pointed a coding session at it. Over the two months, a standard that a pipeline step names was opened 27 times. The design standard, which nothing names, was opened 7 times. A planning checklist I added that day took one test plan from 1 of 4 checks to 4 of 4, but that was one run each way, so it's an anecdote with a method.
- **Two pages disagreed, and the agent used the wrong one.** A plan page said another team had to create a resource for us. A reference page said we create it ourselves. The session went with the plan, and I corrected it. The plan page still says it. The automatic contradiction check never compared these two. My first guess at why turned out to be wrong, which I cover below.
- **Stale facts.** A deploy page described the production setup wrong, which came out during a stuck deploy. A tool card named an option that doesn't exist. About 15 fixes like these landed in two months.
- **A guess written down as fact.** A name heard in a meeting recording got treated as a known communication channel and written into a plan. I had to ask what it was.
- **Prior art behind a boundary.** Older services, the ones I knew best, sat in a frozen archive outside default search, so their established layout didn't get used for a new design.
- **"Don't we already have this?"** I had to ask. The Vault had the answer in five pages.

## The edit-time rules

This one corrects something I wrote. In [Rules at the Edit](/blog/rules-at-the-edit) I described a hook that hands the agent a rule when it writes a file the rule covers, and I said it over-matches on purpose because a false alarm only costs one paragraph. Daily use showed that was wrong.

In two months the hook fired 13 times. All 13 came from shell commands, and by my reading about 1 was a real edit of the right file. The rest were read-only commands, or commands whose text only mentioned a matching path. Each rule fires once per session, so a false fire costs more than a paragraph. It uses up the delivery, and when the real edit comes the rule may not show up.

The replay result in the first post, 0 of 8 to 6 of 8 runs following the rule, still holds for what it tested. It doesn't tell me the hook works in everyday use, and over these two months it mostly fired on the wrong things. The fix is below.

## What I corrected

49 of my 1,979 messages were real corrections, about 2.5%. For at least 6 of them, the Vault already had the answer. By my labels:

- Design depth (too little research, over-building, taking the work request as the design): 18
- Writing clarity and tone: 13
- A wrong claim or wrong reasoning: 7
- Missing something that already exists: 4
- Process steps: 3
- Other: 4

The writing rule was opened 11 times over the two months, and clarity still drew 13 corrections. Opening a rule isn't the same as applying it.

## A health check that tests the machinery

The Vault runs a weekly health check, and it said "healthy" every single week. Over the same stretch, a commit fixing a stale or wrong fact landed about every four days.

Both were true because the check tests the machinery, whether the jobs ran and the pages are in order. It doesn't test whether what a page says is still true. I don't have a check for that yet. The closest thing I have is counting fact fixes per week.

## What it costs

- **Every session:** about 450 tokens for the table of contents at the start.
- **A growing index:** the busiest code area also loads its own index automatically. That index tripled in two months, to about 8,000 tokens per session, and decision titles are most of it.
- **Nightly jobs:** about 2,000 background model calls in 27 days. Each carried about 60,000 tokens of general agent context and returned a median of about 100 tokens. 40% of them rewrote small "what's active" summaries every night, whether anything had changed or not.
- **My time:** about 3 items wait on a decision from me at any time. Changes the Vault applies itself go to a log I skim, not a queue I approve.
- **Work that found nothing to do:** a nightly tagger ran 19 times and never found an untagged page, because pages get tagged when they're written.

In tokens, the nightly calls dwarf the per-session cost, and most of them did small jobs while carrying a lot of context they didn't need.

## What I can't claim

- That the Vault made me more productive. I didn't measure that.
- That it lowers how often I have to correct the agent. I have one window of corrections and nothing to compare it against.
- That a formal ontology or a knowledge graph on top of this would help. I have no evidence either way.
- Anything about other people or teams. This is one engineer, one agent, and about two months, with complete logs for 33 days of it.

What I can say is narrower. My coding agent used the Vault in nearly every session, cited it inline in most of them, and sometimes carried a decision or a test recipe from one session to the next. I'm glad to have that, but it isn't proof of much else.

## What I changed

I worked through the fixes in order of how much evidence was behind each one. Here is what each did so far. Some of it is measured on fixed inputs or recorded data, some is a projection, and none of it has run in live sessions long enough to judge. I say which is which.

### Rules at the right moment

- General standards that say when they apply now head every code area's list of related pages. The design standard behind 3 of my corrections went from showing up in 0 of 25 code areas to 25 of 25.
- The edit-time hook now fires only on files a command actually writes, and a false match no longer uses up the once-per-session delivery. Of the 13 recorded fires, 1 was a real write. The new hook stays silent on the other 12 and still fires on that one. On 31 test cases, covering writes, read-only commands, and text that only mentions a path, it went from 20 right to 31. Two cases added later, including a read followed by a write in the same session, pass on the new hook, but the old hook was never scored on them.
- Replayed over 60 days of recorded commands, all 45 of its matches were real writes, including 6 the old hook missed. So in that replay it didn't fire on the wrong things. I didn't check whether it still misses real writes.

These are mechanical checks against recorded data. I haven't seen the new hook in live sessions yet.

### Contradictions: I had the cause wrong

Earlier in this post I blamed the missed contradiction on the two pages sitting in different sections. That was wrong. The pair was already a candidate, at about #246 of roughly 3,800. The weekly pass checks 12 pairs, and it spent them on the same top pairs every week, so it never got that far down.

The fix skips pairs it has already checked until one of the pages changes, and it also pairs pages on the same subject across sections.

Then I had the model check that pair directly. In 4 of 4 runs it said the pages didn't contradict each other, because a conditional clause reconciled them on paper. So better pairing wouldn't have flagged this one either. When a fact gets corrected, the fix has to reach every page that states it right then. Detection won't reliably find the copies later.

### Context cost

Measured on fixed inputs:

- The busiest auto-loaded index went from about 8,400 tokens per session to about 4,700 (33.7 KB to 18.7 KB). All indexes are now capped at 20 KB, and anything over the cap moves to a linked page. No page became unreachable.
- Background model calls went from 61,000 to 66,000 tokens of context each down to 3,000 to 8,000, with the same model and the same verdicts. A contradiction check went from about $0.21 to $0.02.
- Summaries whose inputs didn't change are now skipped. By estimate, that's 87% of them.

Projected, not yet measured: nightly context should drop from about 122 million tokens per 27 days to about 7 million. I'll replace that with the real number once enough nights have run.

### Did trimming cost reach?

A smaller index could mean the agent finds fewer rules, so I re-ran a rule-reading test the same day. It used the same seven synthetic tasks as an earlier test, with 3 runs per setup, comparing the old untrimmed index against the trimmed one plus the general-standards list. Each session stopped at its first file change.

Both setups read the right rule before the first edit in 21 of 21 runs. Both hit the ceiling, so this rules out a big loss of reach from trimming, but it can't show a small change either way. With numbers this small, the rest is a side note: sessions with the trimmed index made fewer tool calls before their first edit (12.8 vs 15.1) and got there a little sooner (1.8 vs 2.2 minutes). The 42 runs cost about $33.

Getting ready for the test turned up the same failure again. Two rule cards had quietly dropped off the 15-item related-pages list as newer pages arrived. The rules existed, and they were out of view. Both now say when they apply, and they rank near the top.

### Measurement

A weekly snapshot of usage, trigger fires, background-call tokens and index sizes now gets saved into the Vault itself, so the next review won't lose a month of logs.

### Vocabulary

The Vault keeps a vocabulary of term names so pages about the same thing get filed together. A new check found two names that differed only in how the words were spaced or joined, a near-collision the earlier review missed. Both are guarded now, and when a term is split or merged, the reason is recorded.

Most of this is measured on recorded data, not on new work. The weekly snapshots are what will tell me whether any of it changed how sessions actually go.
