---
title: "The Map Is Not the Theory: Why Docs and Diagrams Will Mislead You"
slug: the-map-is-not-the-theory
date: 2025-08-09
updated: 2026-11-23
description: A diagram shows the shape of a system. A team's theory explains why it has that shape and what will happen when it changes.
photo: "./blogContent/map-not-the-theory/map-vs-theory-system.svg"
banner: "../blogContent/map-not-the-theory/map-vs-theory-system.svg"
imageAlt: A diagram contrasting a simplified architecture map with the messier running system and the team’s living theory that supplies judgment.
topics:
  - Engineering Practice
  - Knowledge Systems
series: Theory Building
seriesOrder: 2
featured: true
---

In [part one](/blog/programming-as-theory-building), I argued that a team needs a shared theory of its software: what the system does, why it has its current shape, and how to change it without breaking its purpose. Documentation can carry pieces of that theory. A diagram cannot carry all of it.

## The diagram answers a smaller question

Imagine a payment-flow diagram with three boxes: API, payment service, provider. It tells a new engineer where a request travels. Now ask them to change the retry behavior. The drawing does not say whether the provider accepts an idempotency key, which failures are safe to retry, why the timeout was chosen, or what an operator does after a partial success. Those details determine whether the change is safe.

The diagram is useful. Its job is orientation. The problem begins when we treat that orientation as an explanation of behavior.

## Theory lets you reason about a change

An engineer who knows the theory can answer more than “which box owns retries?” They can explain why retries live there, which assumptions made that choice sensible, and what evidence would change their mind. They can predict the effect of moving the retry or increasing its count, then check that prediction against code, tests, traces, and the people who operate the system.

That is a practical test for a document, too. Pick a real change and ask:

1. What decision does this page describe, and who made it?
2. When and where does the decision apply?
3. What evidence supports the explanation?
4. What would we inspect before applying it to this change?

If the page only names components, it is an entry point. If it preserves the decision and its limits, it can help transfer the team's theory.

## Keep the map answerable

I would rather maintain a small diagram with an explicit boundary than a comprehensive one that quietly drifts. Link it to the decision record that explains the unusual edge, the code that implements it, and the test or incident that challenged it. When the system changes, correct the claim whose meaning changed; do not merely redraw a box.

This still requires engineers to run the software, review changes, and talk to one another. It also gives the next person a faster route into the reasoning the team already did. In [part three](/blog/bridging-the-gap), I explore how a maintained, source-grounded map can help both people and AI agents follow that route. The [Vault's newer context-system direction](/blog/vault-context-system) takes the idea further: serve the applicable reasoning during the work and grade whether it helped.
