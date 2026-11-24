---
title: "The Vault: From LLM Wiki to Context System"
slug: vault-context-system
date: 2026-11-23
description: "How the Vault grew from an LLM-maintained wiki into a system that builds, serves, and evaluates source-grounded context for agents."
photo: "./blogContent/vault-context-system/context-loop.svg"
banner: "../blogContent/vault-context-system/context-loop.svg"
imageAlt: A diagram showing the Vault's context loop from source evidence through maintained knowledge and targeted delivery to outcome evaluation and revision.
topics:
  - AI Systems
  - Knowledge Systems
sectionLinks: true
featured: true
---

A rule I had written down sat in the Vault, filed under the project where I learned it. A different service later needed that rule, and its agent sessions never reached the page. The wiki was healthy and the page was cited and correct. Nothing connected it to the service that needed it.

That gap is why the Vault stopped being only a wiki. It began as my implementation of [Karpathy's LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): preserve original sources, maintain a linked wiki, and let useful synthesis survive the chat that produced it. That gave agents a memory they could inspect. It did not tell them which page applied to the work in front of them.

The system now does more than maintain pages. An agent needs to know which context applies to *this* task and *this* repository, receive it at the moment it can use it, and reveal whether it changed the outcome. [Blind tests on real software changes](/blog/proving-the-vaults-value) showed that access to the Vault can improve coding work. The next questions concern how to make that context more precise and how to measure its effect.

**The Vault is a source-grounded domain context system for people and AI agents.** It captures work as evidence, maintains an intelligible model of what the evidence means, delivers the smallest useful context during a task, and checks the resulting answers and actions. The ontology pipeline is an evolution of that system's knowledge model.

By *domain context*, I mean the meanings and constraints specific to the work at hand: a team's vocabulary, product intent, architectural decisions, standards, precedents, and the evidence that establishes when each applies. The Vault manages that context from origin through interpretation, delivery, and review.

## The full context loop

The LLM Wiki pattern explains how a knowledge base can keep itself current. The Vault now has a wider job:

1. **Preserve evidence.** Keep original decisions, discussions, work requests, code history, and other sources inspectable. Apply privacy and authority rules before material enters the trusted knowledge base.
2. **Maintain the wiki.** Compile cited pages that describe decisions, constraints, patterns, and unresolved disagreements. Separate what a source said from what the Vault inferred or an owner decided.
3. **Model applicability.** Give important terms stable meanings and record which claims and rules apply to a team, repository, time, or situation. This is where the ontology pipeline helps.
4. **Serve context.** Start an agent with a small map, let it open deeper evidence when needed, and deliver applicable rules when it reaches the relevant work.
5. **Grade and revise.** Record what the agent actually saw, compare its answer or change with the expected result, and use misses to improve the knowledge and delivery paths.

The loop matters because a perfect wiki page can still be useless if the agent never sees it. A well-timed rule can still be wrong if its meaning or scope is unclear. A successful retrieval hit tells us little about whether the final answer or code was good.

You can [explore the Vault path as an interactive system map](/projects/vault/path) to see how the stages connect and which parts are built, in pilot, or still open.

## Data, information, and knowledge are different jobs

The distinction that made this work click for me comes from Talisman. In her [public explanation of data, information, and knowledge](https://jessicatalisman.substack.com/p/why-ai-isnt-autonomous-yet-ea2), data are observations or measurements. Information gives data structure and context. Knowledge interprets information through models, relationships, and rules so that someone can draw a meaningful conclusion. Her [“Knowledge is not Data” introduction](https://jessicatalisman.substack.com/p/knowledge-is-not-data) makes the problem concrete: even an accurate value may be unusable if its definition, steward, purpose, or time frame is missing.

I can see all three jobs in the Vault:

- **Data and evidence:** a Raw record preserves what someone said or what a system recorded, with its origin intact.
- **Information:** a cited wiki note identifies the speaker, date, subject, and context of that record.
- **Knowledge:** a reusable explanation connects that information to other concepts or decisions and makes clear why the conclusion follows, where it applies, and what remains uncertain.

That last line is my operational rule for the Vault, not a definition I am attributing word for word to Talisman. A Raw file does not become knowledge merely because it was summarized. A cited bullet may be useful information while still leaving the reader to work out its meaning. An ontology label cannot promote an unsupported conclusion into knowledge either.

## The ontology pipeline improves the model inside the Vault

[Jessica Talisman's Ontology Pipeline](https://jessicatalisman.substack.com/p/the-ontology-pipeline) offers a sequence for making meaning more explicit: controlled vocabulary, metadata, taxonomy, thesaurus relationships, ontology, and knowledge graph. I am adapting that progression to the Vault where it solves a concrete context problem.

For coding work, a rule learned in one project may apply to other repositories. Shared terms, metadata, and relationships help the Vault find those places and serve the rule when an agent edits the relevant file. For research, the same discipline helps distinguish an author's recommendation from my inference or a decision I actually made. A formal ontology or graph service should answer a demonstrated need, rather than become the definition of the Vault.

## A page link is doing too many jobs

Consider a note that says an author *recommends* recording where a term came from. A later Vault page might propose trying that practice locally. An owner might then approve one version of it. These are three different claims: a source recommendation, a Vault proposal, and an owner decision. A link between the pages cannot tell an agent which event actually happened.

The same ambiguity appears in terminology. “Raw record” and “source record” may be two labels for one concept. “Raw record” and “citation” are distinct concepts with a relationship: one is the evidence, the other is a route to inspect it. Treating every link as the same kind of connection makes search and reasoning brittle.

My working model therefore has **two kinds of connection**:

- **Semantic connections** say what a concept is, which labels refer to it, and how it relates to other concepts.
- **Evidential connections** say who made a claim, which source passage it draws on, when and where it applies, and whether that passage substantively supports it.

That second connection matters most for the move from information to knowledge. The Vault's conversation compiler can verify that a quoted string occurs in a selected Raw chunk. It cannot, from that check alone, prove that the surrounding conclusion follows from the quote. Search can find a relevant page without proving that the eventual answer is right. More structure should make those limits visible to the reader and the agent, rather than disguise them.

## What I have actually built and measured

The [coding agents page](/coding-agents) describes the Vault's source collection, nightly compilation, small startup map, and rules delivered at the edit they govern. It also reports a test of ontology-based rule routing: agents saw the right distant rule before their first edit more often with that routing in place. The [blind coding study](/blog/proving-the-vaults-value) graded resulting code, not merely retrieval. A separate session report connects delivered context to subsequent changes and later fixes.

My local Vault is also testing the meaning of a claim once an agent reads it. This is a bounded pilot within the same context system, not a new product.

I started with one narrow decision surface in my local Vault: **what kind of claim is this, and what does its evidence establish?** The pilot register gives stable IDs and definitions to terms such as *attributed source claim*, *Vault inference*, *owner decision*, *proposal*, *local observation*, *quote match*, and *substantive support*. A source recommendation can also be a proposal; those labels are allowed to overlap. None is a truth score.

A second small register connects the LLM Wiki pattern, the ontology pipeline, the semantic wiki, and evidence-linked claims. Its relationships are typed and its assertions are scoped. I am treating those records as pilot reference material, not as automatic tags on every existing page. The current compiler has not been converted into an ontology engine.

I also tested whether these distinctions help an LLM answer questions. In an initial local comparison, both versions reached the expected core distinction on all six questions. On seven harder, author-written questions, the version with revised vocabulary reached seven full distinctions versus six without it. The difference was one case: recognizing that an attributed recommendation was also a proposal, without inventing owner approval. This is a useful prompt-specific signal. It is not evidence of a general accuracy gain or reliable automatic classification.

## How an agent should use this context

Imagine asking, “Did we decide to use this term, or did someone merely suggest it?” A useful answer needs more than the nearest page. It needs the concept's identity and definition, the claim's speaker and status, the specific source passage, the scope of any decision, and a check for later corrections.

Here is a fictional example. A design note recommends reading production timeouts from a configuration service. A later work request proposes applying that idea to the payments client. A reviewer approves the payments change, and the code is updated. A wiki page linking those records might tempt an agent to answer, “All production timeouts must use the configuration service.” The evidence supports a narrower answer: **the payments client uses it because that change was approved and implemented; the original note alone does not establish a rule for every client.** The agent should inspect the approval, the current code, and any later decision before applying the pattern elsewhere.

The useful connections are specific: *recommends* links the note to an idea, *proposes* links the work request to a change, *approves* links the reviewer to its scope, and *implements* links that decision to code. The example is illustrative, not a report of an actual Vault decision. It shows why a page link and a matching quote cannot carry the whole answer.

The intended read path is: start with the small map for the current domain; use known labels and scope to find the right concept or rule; follow typed relationships to nearby claims and pages; read the relevant Raw evidence; then answer or act with a conclusion the source actually supports. If the evidence stops at a recommendation, the answer should stop there too. If a rule applies only to another repository, it should not be served as a universal standard.

This could help with several real jobs:

- **Coding agents:** find a rule by the language used to describe a change, then determine whether it applies to this repository and whether it was adopted.
- **Research and writing:** connect a new source to an existing explanation while keeping the author's view separate from my synthesis.
- **Wiki maintenance:** notice two terms that may be synonyms, two pages that may disagree, or a conclusion whose citation no longer supports it.
- **Decision recall:** trace a proposal to a later approval, rejection, or superseding decision without rewriting the earlier record.

Each use case needs its own evaluation. Search probes can show whether the right page was found. Answer reviews must check support, scope, and meaning. Coding tests can grade whether the delivered context improved the change. These are different questions, and the Vault should keep their results separate.

## Does the Vault become the knowledge graph?

For the current pilot, reviewed Markdown records are the canonical working format and a small graph view is derived from them. The open decision is whether to keep that arrangement as the Vault grows or add a dedicated graph service for questions that need richer traversal or validation. A service would create another representation to keep synchronized.

I want the choice to follow a question we cannot answer well with the files and indexes we already have. A graph database would not fix a mislabeled proposal or an unsupported claim. A second source has already exercised the local pilot's reviewed revision path. The next work is to run more real questions through the loop and test whether the resulting answers preserve meaning, support, and scope. If that reveals a need for graph queries or formal constraints, I will have a concrete reason to add them.

The Vault's identity is the whole loop: source, meaning, delivery, outcome, correction. The LLM Wiki was the starting architecture. The ontology pipeline improves the meaning and applicability of the context it holds. Grading tests whether that context helped in the work that followed. That is how the Vault grows from a maintained wiki into a context system of its own.
