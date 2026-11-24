export type VaultStageStatus =
  "built" | "pilot" | "measured" | "output" | "in-progress";

export type VaultStage = {
  short: string;
  role: string;
  title: string;
  status: VaultStageStatus;
  summary: string;
  details: string[];
  handoff: string;
  example: string;
  boundary: string;
};

export const vaultStages: VaultStage[] = [
  {
    short: "Sources",
    role: "Files, code, sessions",
    title: "Work leaves evidence",
    status: "built",
    summary:
      "Decisions, conversations, code changes, notes, and agent sessions are the material the Vault can learn from.",
    details: [
      "A source records what happened or what someone said. It does not automatically establish that the claim is current or true everywhere.",
      "Origin, date, and access limits matter because the next reader needs to know whose perspective the record contains.",
    ],
    handoff: "A selected source enters a controlled intake path.",
    example: "An agent session records why retries were capped in a service.",
    boundary:
      "The scene uses generic examples; it does not expose private Vault records.",
  },
  {
    short: "Intake",
    role: "Privacy and routing gate",
    title: "Intake sets the boundary",
    status: "built",
    summary:
      "Before a source becomes agent-readable memory, the Vault routes it, applies exclusions, and records its provenance.",
    details: [
      "Consent and privacy checks decide what can be processed or published. Source authority decides which pages an agent may change.",
      "Keeping this gate visible prevents a useful summary from quietly becoming an authorized decision.",
    ],
    handoff: "Accepted material is preserved as inspectable Raw evidence.",
    example: "The session is filtered and routed to the service's scope.",
    boundary:
      "A model verdict alone does not authorize publication or policy changes.",
  },
  {
    short: "Raw",
    role: "Evidence archive",
    title: "Raw evidence stays inspectable",
    status: "built",
    summary:
      "The original record remains separate from the Vault's later interpretation of it.",
    details: [
      "Raw is append-only. A later correction or disagreement adds evidence instead of rewriting the earlier record.",
      "Claims in the readable wiki can point back to passages a person or agent can inspect.",
    ],
    handoff: "The compiler reads sources and proposes cited synthesis.",
    example:
      "The original discussion stays available with its date and origin.",
    boundary:
      "A matching quote proves the words were present, not that a conclusion follows.",
  },
  {
    short: "Wiki",
    role: "Cited knowledge pages",
    title: "The wiki turns records into a map",
    status: "built",
    summary:
      "Focused pages connect decisions, constraints, patterns, and open disagreements to their source evidence.",
    details: [
      "A model helps extract and connect material. Code writes and checks the files, citations, and indexes.",
      "A cited page may still be information rather than usable knowledge. The reader must understand the relationship, scope, and uncertainty behind a conclusion.",
    ],
    handoff:
      "Pages and claims provide the material for a more precise meaning model.",
    example:
      "A page states the retry rule, why it exists, and where it applies.",
    boundary:
      "The wiki is a maintained interpretation; the source remains available for review.",
  },
  {
    short: "Ontology",
    role: "Terms and relationships",
    title: "The ontology pipeline sharpens meaning",
    status: "pilot",
    summary:
      "Terms, claim types, and relationships make it clearer what a page means and where its rules apply.",
    details: [
      "Talisman's progression moves through vocabulary, metadata, taxonomy, thesaurus, ontology, and knowledge graph. The stages are a design guide, not six services already running in the Vault.",
      "The local pilot records stable concepts, scoped claims, and typed semantic and evidential links. It keeps an author's recommendation distinct from an owner decision.",
    ],
    handoff:
      "Reviewed terms and claims enrich the readable pages and derived views.",
    example:
      "The rule is linked to its service, failure mode, and decision authority.",
    boundary:
      "Formal ontology and a dedicated graph service remain choices to justify with real questions.",
  },
  {
    short: "Storage",
    role: "Markdown and indexes",
    title: "Markdown stays the working store",
    status: "built",
    summary:
      "Readable Markdown files hold the current model; indexes, search, and a small graph view are derived from it.",
    details: [
      "Small hot files and indexes give agents a cheap starting point. Deeper pages remain available without filling the first prompt.",
      "The semantic pilot derives a graph view from reviewed records. A separate graph database would add a second representation to synchronize.",
    ],
    handoff: "The storage layer supplies search and scoped entry points.",
    example:
      "The updated page stays readable while indexes point agents to it.",
    boundary:
      "A graph view is a way to inspect connections, not a guarantee that the connections are correct.",
  },
  {
    short: "Retrieval",
    role: "Find the right pages",
    title: "Retrieval finds the relevant neighborhood",
    status: "built",
    summary:
      "An agent begins with a small map, then searches by task, term, and scope before opening deeper evidence.",
    details: [
      "Concept labels and relationships can help a rule learned in one place reach another place where it applies.",
      "Search probes test whether the right page is found. They do not prove that the final answer is supported or useful.",
    ],
    handoff: "Selected pages and rules become context for the current work.",
    example:
      "A later task about retries finds the scoped rule and its evidence.",
    boundary: "A top search hit is a route to evidence, not the answer itself.",
  },
  {
    short: "Serving",
    role: "Context to the agent",
    title: "Context arrives during the work",
    status: "measured",
    summary:
      "The Vault delivers the smallest applicable context when an agent can use it, including rules at the edit they govern.",
    details: [
      "The agent can follow a citation to the source, check current code, and keep a scoped rule out of unrelated work.",
      "Blind coding runs measured the resulting changes, while a separate routing test measured whether distant rules were seen before the first edit.",
    ],
    handoff: "The agent uses that context to produce an answer or change.",
    example: "The agent sees the retry rule before it edits the service.",
    boundary:
      "The goal is applicable context, not every document in every prompt.",
  },
  {
    short: "Answer",
    role: "Result to the person",
    title: "An answer reaches the person asking",
    status: "output",
    summary:
      "The agent returns an answer, recommendation, or software change. The Vault aims to make this visible result supportable from evidence.",
    details: [
      "A useful answer connects its conclusion to the evidence and scoped rules it used, and says where uncertainty remains.",
      "For engineering work, the delivered change is the output. Its tests and review are evidence about the result, not a substitute for explaining the decision.",
    ],
    handoff:
      "The output and its supporting trail become material for evaluation.",
    example: "The person gets the change, its rationale, and the cited rule.",
    boundary:
      "Finding the right page does not guarantee that the answer or change is right.",
  },
  {
    short: "Review",
    role: "Grade the result",
    title: "Outcomes teach the next cycle",
    status: "in-progress",
    summary:
      "Retrieval, answer support, and the quality of the resulting work are graded as different questions.",
    details: [
      "Existing probes measure whether target pages are found; blind coding tests assess changes. Local answer pilots test narrower meaning distinctions.",
      "A miss can call for a source correction, a clearer concept, a better route, or a different delivery moment. The feedback route returns to the wiki and semantic model.",
    ],
    handoff: "Corrections and new evidence feed the next compile and review.",
    example:
      "Checks ask whether the rule was found and whether the change worked.",
    boundary:
      "The current compiler does not automatically prove that every generated claim follows from its citation.",
  },
];

export const ontologySteps = [
  "Vocabulary",
  "Metadata",
  "Taxonomy",
  "Thesaurus",
  "Ontology",
  "Knowledge graph",
];
