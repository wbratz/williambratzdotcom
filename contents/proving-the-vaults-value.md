---
title: "Proving the Vault’s Value: Domain Context Makes Coding Agents Better"
slug: proving-the-vaults-value
date: 2026-11-19
description: Blind tests on real tickets show what happens when a coding agent gets your team’s context. More accepted changes, zero serious bugs, and half the cost.
photo: "./blogContent/proving-the-vaults-value/vault-results.svg"
banner: "../blogContent/proving-the-vaults-value/vault-results.svg"
imageAlt: A bar chart comparing a coding agent with and without the Vault. With the Vault, accepted changes rise from 11 to 16, blocker and major bugs fall from 9 to 0, and cost per accepted change falls from $7.79 to $4.12.
topics:
  - AI Systems
  - Knowledge Systems
sectionLinks: true
featured: true
---

Does giving a coding agent your team's context produce better code? I tested it blind, on real tickets, with [the Vault](/projects/vault) switched on and off. It does.

- **+45%** accepted changes
- **Zero** blocker or major bugs, down from nine
- **47% lower** cost per accepted change
- **29% less** time per ticket

## How I tested it

Every run started from the commit before the original work, with the ticket as it read that day and a snapshot of the Vault from that date, answer removed.

- **Real tickets:** bugs, ambiguous asks, coding-standards traps, and requests for things that already existed.
- **Two models,** with and without the Vault, 24 runs per setup.
- **Blind judges** scored every change against an answer key and 1,277 real review comments, alongside automated checks and two independent rankings.

**Accepted** means correct, no blocker, no regression, and a reviewer would approve it as is.

| Setup (24 runs each) | Accepted | Blocker / major bugs | Cost per accepted |
| -------------------- | -------: | -------------------: | ----------------: |
| Opus, no Vault       |       11 |                3 / 6 |             $7.79 |
| Opus + Vault         |   **16** |            **0 / 0** |         **$4.12** |
| Sonnet, no Vault     |        7 |               3 / 13 |             $4.70 |
| Sonnet + Vault       |    **8** |            **1 / 9** |         **$3.31** |

## Code that belongs in the codebase

The biggest gain was fit: changes that look like the team wrote them. With the Vault, agents followed existing precedent, reused what was already there, and avoided mistakes the team had already learned from.

## Agents that push back on bad tickets

Some tickets asked for something that already existed. Without the Vault, every run built a duplicate. With it, agents spotted the existing solution and said so, some in under three minutes for about a dollar.

## Standards, delivered on time

Coding standards need precise timing. Each rule now arrives the moment the agent edits a file it covers, and agents correct course mid-edit.

- **0 → 6 of 8** implementations done to standard
- **0 → 5 of 8** accepted as is

## Tuning the workflow

The same test shows which workflow steps pay off. One heavier step doubled cost for the strongest model without improving results, while it lifted a smaller one. It now runs only where it helps.

## Cheap to prove

The whole study cost under $500 in model time.

Two runs per ticket per setup. Judges never saw which setup produced a change. Full method on request.

## Try it

Start your own Vault with [vault-scaffold](https://github.com/wbratz/vault-scaffold): one domain, one folder, one real workflow. Read [how the Vault works](/coding-agents) or the [architecture](/projects/vault).
