---
title: "Programming as Theory Building: Why Reading the Docs Is Not Enough"
slug: programming-as-theory-building
date: 2025-08-02
updated: 2026-07-28
description: Why understanding code requires more than documentation alone.
photo: "./blogContent/as-theory-building/theory-building-system.svg"
banner: "../blogContent/as-theory-building/theory-building-system.svg"
imageAlt: A diagram showing how code, documentation, and diagrams combine with participation to build a shared theory that supports engineering judgment.
topics:
  - Engineering Practice
  - Knowledge Systems
series: Theory Building
seriesOrder: 1
featured: true
---

A new engineer joins a team and receives the usual collection of links: an onboarding guide, architecture diagrams, API documentation, and a list of repositories. They read everything. They can describe the major components. Then they take their first real ticket and discover that they still do not understand the system.

This is often treated as a documentation failure. Sometimes it is. But even excellent documentation cannot transfer the full understanding held by the people who built and operate the software.

Peter Naur gave that understanding a useful name: **theory**.

## The program is more than its text

In his 1985 paper [Programming as Theory Building](https://gwern.net/doc/cs/algorithm/1985-naur.pdf), Naur argues that programming is not primarily the production of source code and documents. It is the development of a theory in the minds of the programmers.

That theory includes:

- What the system is meant to accomplish.
- How its parts cooperate.
- Why particular decisions were made.
- Which alternatives were rejected.
- How the system should respond to cases nobody has seen yet.

Code records some of that knowledge. Documentation records another part. Neither is the theory itself.

Two engineers can read the same repository and know very different things about it. One can explain what each class does. The other can predict where a new requirement belongs, which invariant it threatens, and why an apparently cleaner design failed three years ago. The difference is not access to files. It is the depth of the theory each person has built.

## Why “read the docs” falls short

Documentation usually captures conclusions. Understanding requires reconstructing the reasoning that produced them.

An architecture diagram might show that Service A calls Service B. It rarely captures:

- Why the boundary exists.
- Which team owns the failure between them.
- What traffic pattern forced the split.
- Which dependency must never be called synchronously.
- Why a duplicate-looking path is intentionally still present.

Those details surface through experience: tracing a request, reviewing a change, investigating an incident, pairing with someone who remembers the constraints, or reading the pull request where the decision was made.

The documentation may be accurate and still be insufficient. It is a starting point for theory building, not a substitute for it.

## Where missing theory becomes visible

The same problem appears throughout engineering work.

### Onboarding

A new engineer can memorize the component map without knowing where a change naturally belongs. A small production task teaches more because it forces the engineer to connect the map to actual behavior, constraints, and people.

### Code review

A reviewer suggests a locally elegant refactor. Someone familiar with the system says it will break an assumption elsewhere, but cannot point to where that assumption is recorded. The review is not blocked by syntax. It is blocked by unequal theories.

### Architecture discussions

Two people argue over designs while working from different histories of the system. One optimizes for the problem described in the current ticket. The other is protecting against an operational failure that happened before the first engineer joined.

### Knowledge silos

One person becomes the automatic reviewer for a module. The team calls this expertise, but it is also a warning: too much of the theory exists in one mind and too few situations are transferring it.

### Documentation drift

The diagram remains clean while production behavior grows exceptions. The team still understands those exceptions through habit, but a newcomer sees only the outdated map.

These are not separate process problems. They are symptoms of theory that is incomplete, unevenly distributed, or no longer connected to its evidence.

## Theory is transferred through participation

You cannot download another engineer's mental model, but you can create conditions where someone builds a compatible one.

The most effective activities combine an artifact with an experienced person and a real problem:

- Trace a production request while someone explains the boundaries.
- Pair on a small change and discuss why it belongs where it does.
- Review an incident alongside the code and the decision that followed it.
- Walk through a pull request, including alternatives that were not chosen.
- Ask a new engineer to explain the system back to the team.

The learner is not passively receiving facts. They are testing and revising a model of the system.

This is why onboarding by contribution works. A real task exposes the difference between knowing the nouns in a system and understanding how the system behaves.

## Documentation still matters

Saying that documents cannot contain the whole theory is not an argument against documentation. It is an argument for being precise about what documentation can do.

Useful artifacts:

- Give people a place to begin.
- Preserve decisions and their evidence.
- Establish shared vocabulary.
- Reduce the number of facts that must be rediscovered.
- Expose disagreements between the documented model and the running system.
- Help experienced engineers explain what they know.

The mistake is treating the artifact as the end of knowledge transfer. A diagram becomes valuable when a team uses it to reason, challenge assumptions, and connect new evidence to prior decisions.

## Treat shared understanding as production infrastructure

Teams routinely protect source code, deployment pipelines, and operational data. The theory that lets people change those systems safely deserves similar attention.

That means making theory building part of normal work:

1. Pair on unfamiliar areas instead of routing every change to the expert.
2. Record why a decision was made, not only what was decided.
3. Link implementation changes back to the decision or requirement they satisfy.
4. Use incidents and reviews as opportunities to update the team's model.
5. Revisit diagrams when reality contradicts them.
6. Notice which questions always require the same person to answer.

The goal is not to eliminate tacit knowledge. That is impossible. The goal is to keep important understanding moving through the team instead of allowing it to become trapped or disappear.

## The beginning of the series

This article is the first part of a series about how engineering knowledge is built and preserved.

The second, [The Map Is Not the Theory](/blog/the-map-is-not-the-theory), examines why documentation and diagrams inevitably simplify the systems they describe.

The final article, [When the Map Starts Learning](/blog/bridging-the-gap), explores a practical knowledge system that connects evidence, decisions, implementation, and AI-assisted work without pretending that a wiki can replace human understanding.

## The responsibility behind the code

An engineer's job is not finished when the code works. We also build the theory that makes the code understandable, changeable, and survivable after the original authors leave.

Source code is part of that theory's evidence. Documentation is part of its memory. The theory itself lives in the explanations, judgments, and shared experiences that allow a team to keep making good decisions when the next problem is not already written down.
