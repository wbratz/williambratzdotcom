---
title: "When the Map Starts Learning: Building a Shared Memory for Humans and AI"
slug: bridging-the-gap
date: 7/27/2026
description: What happens when documentation stops being a destination and becomes living context for product, engineering, and AI.
photo: "./blogContent/bridging-the-gap/resized_thumbnail.svg"
banner: "../blogContent/bridging-the-gap/resized_banner.svg"
---

# The Post That Would Not Sit Still

This is the final post in a three-part series I started almost a year ago.

It was supposed to be the easy one.

The first post, [Programming as Theory Building](/blog/programming-as-theory-building), argued that the real program is not the code or the documentation. It is the theory a team holds about what the system does, why it exists, and how its pieces fit together.

The second, [The Map Is Not the Theory](/blog/the-map-is-not-the-theory), argued that our diagrams, READMEs, ADRs, tickets, and wikis are only maps of that understanding. Useful maps, absolutely, but still incomplete, already aging, and incapable of walking the territory for us.

Part three was going to be a practical list: pair more, write down decisions, keep diagrams small, review your docs, repeat.

Then AI kept improving.

Every time I thought the post was ready, the landscape changed beneath it. Context windows grew. Coding agents became useful. Tool integrations moved AI out of the chat box and into our systems. Persistent memory stopped feeling theoretical. Agent instructions became part of repositories. Models became capable of searching, comparing, editing, and maintaining hundreds of files in a single workflow.

The original advice was not wrong. It was becoming incomplete.

I had been trying to explain how humans could keep a map closer to reality. The more interesting question had become:

> What happens when the map can help maintain itself, and when both humans and AI can use it to build a shared theory?

That question is why this post took so long. It also led me to build something I call **The Vault**.

---

# What Still Holds

Before AI improved so rapidly and became part of how we work, this post would have looked very different. Some of the original concepts still hold.

Teams build real understanding through experience:

- Start with a small map.
- Follow a real change through the system.
- Pair with someone who knows its history.
- Explain the “why,” not just the file path.
- Preserve decisions and constraints that cannot be recovered from code.
- Revisit the map when reality surprises you.

That is still good advice. AI does not eliminate theory building, and it does not turn documentation into truth. People still own judgment. The running system still gets the final vote.

But this old model has a structural limit: it depends on people doing the bookkeeping.

Someone has to turn the meeting into notes, the notes into decisions, the decisions into tickets, the tickets into implementation context, and the implementation back into updated documentation. Someone has to notice that a PR invalidated an ADR, or that a Slack thread answered a question the next engineer will spend three hours rediscovering.

Usually, that someone is busy.

So the theory fragments. Product keeps one part in a document, engineering keeps another in code, and the rest dissolves into chat history and human memory.

The old answer was to ask everyone to document more.

The landscape of today gives us a better answer.

---

# The Landscape of Today

In April 2026, Andrej Karpathy published an idea file called [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). It is short, deliberately open-ended, and one of the most important descriptions of AI knowledge work I have read.

Most systems that put documents in front of an LLM use some form of retrieval-augmented generation, or RAG. You ask a question, the system searches a collection, retrieves likely-relevant chunks, and asks the model to assemble an answer.

That can work remarkably well. But every question begins another act of rediscovery. The model searches, reads, and reconstructs the relationships again. Its useful synthesis often dies at the end of the conversation.

Karpathy proposed a different pattern: let the LLM incrementally build and maintain a persistent, interlinked wiki.

The shape is wonderfully simple:

1. **Raw sources** remain immutable and authoritative.
2. **A wiki** holds the model’s evolving synthesis of those sources.
3. **A schema** tells the model how to ingest, connect, query, and maintain that knowledge.

When a source arrives, the model does not merely index it. It reads it, extracts what matters, updates relevant pages, adds cross-references, records contradictions, and improves the existing synthesis. When a question produces a valuable answer, that answer can be filed back into the wiki.

Knowledge stops being repeatedly retrieved and starts being compiled.

Karpathy gives the metaphor that unlocked the whole idea for me: Obsidian is the IDE, the LLM is the programmer, and the wiki is the codebase.

That framing points toward something much larger than personal notes.

What if the codebase were not a hobby wiki, but the shared operational theory of a product?

What if its sources were PRDs, customer conversations, Jira stories, Slack threads, architecture decisions, pull requests, incidents, and the AI sessions used to implement the work?

What if product and engineering were not handing context across a wall, but contributing to the same living memory from opposite sides?

That is the experiment behind The Vault.

---

# The Vault

The Vault is my implementation of the LLM Wiki pattern for real engineering work. It is a persistent, git-backed knowledge system built from plain Markdown and a Python automation engine.

It is not a folder where I save whatever looks interesting. It is a pipeline for turning the exhaust of product and engineering into durable, inspectable context.

Today it tracks more than a thousand raw source artifacts and compiles them into hundreds of active knowledge pages. It has archived hundreds of substantial AI-assisted engineering conversations. It mirrors product stories, pull requests, ADRs, design decisions, standards, patterns, package knowledge, and current work across repositories.

The files matter. The system around them matters more.

![The Vault turns immutable raw evidence into a linked, source-grounded wiki used by product, engineering, AI agents, and automation.](../blogContent/bridging-the-gap/vault-mental-model.svg)

*The Vault is a knowledge compiler: evidence enters, linked context emerges, and every important claim retains a path back to its source.*

## Evidence First

The Vault has two primary knowledge layers.

The **Raw** layer holds source material: PR descriptions, Jira records, ADRs, meeting notes, PRDs, conversation transcripts, and other original artifacts. Raw is immutable. Automation can append to it, but it cannot quietly rewrite history.

The **Wiki** layer is derived. An LLM summarizes, connects, and organizes Raw into pages that are easier for both people and agents to navigate. Every important claim can point back to its source. If synthesis goes wrong, the Wiki can be regenerated.

This distinction is load-bearing.

An AI-maintained knowledge base should not ask us to trust the model’s memory. It should give the model a place to reason while keeping the receipts.

## One Memory, Different Resolutions

The Vault is organized at several levels:

- **Global context** holds standards, recurring patterns, shared tools, and cross-repository knowledge.
- **Repository context** holds the architecture, active work, decisions, PR history, and sharp edges of a specific codebase.
- **Topic context** holds knowledge that spans repositories or serves a specialized domain.
- **Hot files and indexes** provide small, current entry points so an agent does not have to swallow the entire vault to become useful.

That last piece is important. More context is not automatically better context. A thousand accurate documents dumped into a prompt can produce worse results than five carefully selected pages.

The Vault uses progressive disclosure: begin with the small current map, follow indexes into the relevant neighborhood, and trace important claims back to evidence only when needed.

The goal is not infinite context.

The goal is the **right context, at the right resolution, at the moment a decision is being made**.

## A Memory Loop, Not a Document Dump

Three automated cadences keep the system moving.

A daily ingest gathers new evidence: merged PRs, ADRs, Jira stories, watched documents, and meaningful AI conversations. It refreshes compact summaries of what is active now.

A weekly compile turns pending evidence into useful knowledge. It updates story pages, extracts durable lessons from conversations, builds PR rollups, identifies architectural decisions buried in implementation work, routes new material, and checks citations.

A monthly lint looks for decay: broken references, stale claims, contradictions, orphaned pages, and gaps between Raw evidence and the Wiki’s current story.

![The Vault continuously ingests new evidence, compiles linked knowledge, serves shared context, produces better work, and checks itself for decay.](../blogContent/bridging-the-gap/vault-maintenance-loop.svg)

*This is the part a folder of documents does not provide. Use creates new evidence; maintenance turns that evidence into a better starting point for the next decision.*

Every operation leaves an audit trail. Riskier kinds of knowledge require human promotion. Lower-risk reference material can update automatically. Untrusted source text is first reduced to typed, validated data; the model does not get an unrestricted pen over the trusted knowledge layer.

In other words, the system treats knowledge maintenance like software engineering: sources, types, tests, permissions, logs, review boundaries, and recovery paths.

---

# Closing the Product–Engineering Loop

The biggest opportunity is not better developer documentation. It is collapsing the distance between **why a product decision was made** and **how that decision became software**.

Product decisions happen everywhere:

- In a planning document.
- Halfway through a Slack thread.
- During a customer call.
- In a ticket comment.
- In a meeting where someone says, “Yes, but only for this case.”
- In the moment a developer discovers that the requested behavior conflicts with the existing system.

By the time implementation begins, those decisions have often been flattened into a ticket. The acceptance criteria describe the destination, but the discarded alternatives, customer pressure, constraints, and meaning of the work are missing.

Then engineering creates another trail: design notes, code, PR discussion, tests, rollout decisions, and operational lessons.

Traditional documentation treats these as separate worlds. The Vault treats them as one chain of evidence.

![A customer problem flows through product decisions, architecture, implementation, and production evidence, with Vault links preserving rationale and constraints in both directions.](../blogContent/bridging-the-gap/product-engineering-chain.svg)

*Product can follow a decision forward into what shipped and how it behaved. Engineering can follow an implementation backward into the intent and constraints that shaped it.*

The product requirement can link to the decision that shaped it. The decision can link to the Jira story. The story can link to the relevant system context, implementation conversation, pull request, and resulting architectural decision. Later, a customer question or incident can travel that chain in either direction.

This changes the relationship between product and engineering.

For product, the Vault becomes more than a place to search for technical answers. It gives product partners a durable home for intent. A decision made in conversation can be captured while it is still alive, connected to the feature it affects, and carried forward without requiring someone to rewrite it into five systems.

It also gives product a way to interrogate implementation without starting from a blank page:

- What did we actually ship?
- Which requirement changed during implementation?
- What constraint forced that trade-off?
- Which open stories depend on the same assumption?
- Where does current behavior diverge from the PRD?

For engineering, those same links restore the “why” at the moment it matters. The developer and their AI agent do not receive a ticket floating alone in space. They can begin with the product intent, relevant decisions, system boundaries, prior implementations, known pitfalls, and current repository state already connected.

The handoff becomes a feedback loop.

---

# Bringing the Vault to Where Work Happens

A knowledge system fails if contributing to it requires everyone to adopt the same editor, remember a new ritual, or become a part-time librarian.

The Vault has to meet people where they already work.

For engineers, that means their repositories and their AI coding environment. Each tracked repository can import its focused Vault context automatically. Start an AI session in the repo and the agent receives the current map, the relevant standards, and a path into deeper knowledge. The context lives beside the work instead of in a forgotten browser tab.

For product and the wider team, that means Slack.

I have been exploring this through a custom Claude–Slack integration: a Claude Code agent adapted to run inside Slack, with access to team files and connected systems. A product partner can bring a PRD, meeting note, thread, or decision to the agent in the place the conversation is already happening. The agent can investigate, summarize, connect, and preserve that material without asking the user to understand the Vault’s directory structure.

The most promising model is not a Slack-only memory or a developer-only local folder. It is a shared, git-backed Vault with multiple clients:

- Slack for product conversations and team decisions.
- Local coding agents for implementation and review.
- Scheduled automation for ingestion, synthesis, and health checks.
- Git for history, collaboration, inspection, and recovery.

The interface changes. The memory does not.

A decision captured by product in Slack can become context in a developer’s next coding session. The resulting implementation and PR discussion can flow back into the same knowledge chain. Product gains visibility into what the system became; engineering retains the intent that made the change necessary.

No one has to copy the same explanation from Slack to Jira to a README to an AI prompt and hope it survives.

That is the bridge.

---

# From Prompting to Context Engineering

There is a familiar loop in AI-assisted development:

1. Prompt the model to implement the ticket.
2. Discover it misunderstood the architecture.
3. Add a README.
4. Discover it missed a product constraint.
5. Paste the PRD.
6. Discover it repeated an old mistake.
7. Explain the last three PRs.
8. Refine until the output finally belongs in the codebase.

We often call this a prompting problem. Usually, it is a context problem.

The model may be capable of writing the code. It simply does not know which code is right **here**.

A focused Vault changes the first prompt.

Instead of asking the agent to rediscover the system from a repository-wide search, we give it a curated starting theory:

- This is what the product is trying to accomplish.
- These are the decisions already made.
- These constraints are still active.
- These patterns are intentional.
- These similar changes succeeded.
- These sharp edges have hurt us before.
- These source files can verify the map.

![Without focused context, an AI implementation repeatedly cycles through prompting, wrong assumptions, and context repair. With The Vault, the agent begins with a focused starting theory, explores the code, implements, and verifies.](../blogContent/bridging-the-gap/context-engineering-loop.svg)

*The Vault does not remove iteration or verification. It reduces the avoidable cycles spent reconstructing context the organization already learned.*

The agent still explores the code. It still runs tests. It still has to prove its work. But it begins from the accumulated experience of the team rather than from generic model priors and whatever happened to fit in the user’s opening prompt.

That reduces the prompt–implement–correct–refine loop. More importantly, it improves the quality of the decisions inside the implementation. The AI can reason about whether a solution belongs in this system, not merely whether the code looks plausible in isolation.

This is the shift from prompt engineering to context engineering.

The prompt asks for the work.

The context teaches the agent how this team understands the work.

---

# The Map Can Learn, but It Is Still a Map

There is a tempting version of this story where AI solves organizational memory. Feed it everything, let it maintain the wiki, and never lose context again.

I do not believe that version.

An AI-maintained map can still be wrong. Worse, it can be wrong fluently and at scale. It can preserve a misunderstanding, connect unrelated events, or turn an old assumption into an apparently authoritative fact.

That is why The Vault keeps immutable sources. It is why synthesis is derived, citations matter, automation is audited, risky edits are gated, and the code remains available for verification. It is why product and engineering still own the meaning of their decisions.

The original lessons in this series survive:

- The code is not the theory.
- The documentation is not the theory.
- The AI-generated wiki is not the theory.

But each can help people and agents build the theory together.

The breakthrough is not that the map becomes the territory. It is that the map can now watch the paths we walk, help connect them, show its sources, and arrive in the hands of the next traveler before the trail goes cold.

---

# What I Think Comes Next

We are moving toward a world where every serious team has an AI-consumable knowledge layer.

Not a graveyard of documents. Not an enormous prompt checked into the repo. Not a black-box vector database that returns five mysterious chunks.

A living, inspectable, source-grounded model of the product and the systems that make it real.

Small teams will build personal and project Vaults. Larger organizations will build federated ones: product knowledge connected to system knowledge, local team context connected to global standards, specialized domains connected through maps rather than forced into one giant brain.

The teams that learn to do this well will not just generate code faster.

They will lose fewer decisions.

They will onboard people faster.

They will spend less time rediscovering why the system is shaped the way it is.

They will give their AI agents something more valuable than a larger context window: a better starting theory.

And every correction, implementation, incident, and discovery will have the chance to make the next piece of work better.

Karpathy’s LLM Wiki is an idea file. The Vault is my attempt to follow that idea into product and engineering. I want to see what happens when organizational knowledge becomes something our tools can actively help us cultivate.

You do not need my full implementation to try it. I published [vault-scaffold](https://github.com/wbratz/vault-scaffold), a small, interview-driven agent workflow that will help you design and scaffold a Vault for your own domain.

Start with a folder. Keep your sources immutable. Give your agent a schema. Let it build an index. Add one meaningful artifact at a time. Ask questions, preserve the valuable answers, and insist on links back to evidence.

Then connect it to one real workflow.

Do not try to build the perfect brain.

Build the first memory your team will not have to rediscover.

The map is still not the theory.

But, for the first time, the map can help us remember how we built it.
