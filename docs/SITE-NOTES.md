# Site notes

A short, shared log of editorial decisions and open work for this site, so a
session on any machine can pick up the reasoning without reading the whole git
history. Commit messages stay the detailed record. This file is the index and
the to-do list.

This repository is public. Entries describe what changed on the site and why.
They never name an employer, internal tool, repository, service, ticket, or
pull request, and they never include results that are not already published
here. Private reasoning lives outside this repository.

Add the newest entry at the top of the log. Keep each entry to a few lines.
When an open item is done, delete it from the list and mention it in the log.

## Open work

- **Measured nightly token count for "The Vault in Daily Use".** Replace the
  122M to 7M projection once enough nights have run.
- **Regenerate the résumé PDF.** The résumé page now reports the study as raw
  counts from a small sample, but `WilliamBratz-resume.pdf` still says
  "raised accepted changes 45% and cut cost per accepted change 47%" and uses
  the old essay title. Settle the résumé wording first, then reprint the PDF.
- **Publish the full blind-study method.** The study essay still says the method
  is available on request. Describe the setup generically: how a run starts from
  the commit before the work, how the answer is removed, how judges are blinded.
- **One real, redacted artifact on `/projects/vault`.** Today every example is
  fictional. Show a source file with its origin and date, the compiled page with
  citations, and one log entry, with names removed.
- **Who it is for, what it costs, when it does not help.** Add a short section on
  a person, a team, and an organization, each with a first step and a running
  cost.
- **Voice pass on `bridging-the-gap`.** Cut the rhythm tics: stacked "Not X. Not
  Y." lines, one-sentence paragraphs used as punchlines, and the closing triad.
- **Visual fixes seen in review.** The blog index thumbnail crops the banner
  diagram at both edges. The Vault page overview diagram has its last label
  colliding with the curve under it. Large headings are tracked tightly enough
  that letters touch. Section headings on the Vault page shift left and right
  between sections. The About portrait sits far from its text.
- **Untested claim in "Rules at the Edit".** What an agent does when the code
  contradicts a rule it was just handed. The essay says this is unmeasured.

## Log

### 2026-11-25: the study essay, corrected, and a daily-use follow-up

- The study essay is now "Testing the Vault’s Value" (same slug and date). It
  reports raw counts and the design, says the sample is too small to tell from
  noise, and drops the percentage headline. The standards section now says the
  0 of 8 to 6 of 8 result came from two hand-picked work requests re-run after
  the triggers were written, and that in daily use the edit-time hook rarely
  fired on a real write. A dated note at the top says what changed and why. The
  banner chart now shows 24 runs per setup and calls the sample small.
- New essay, "The Vault in Daily Use": two months of sessions, when the Vault
  helped, when it failed, what it costs, and what is being changed. It and the
  study form the "Measuring the Vault" series.
- The same correction across the site. The home page, `/coding-agents`,
  `/production-agents`, the AI engineering page, the about page, the résumé,
  and "From LLM Wiki to Context System" now give the study as raw counts
  (11 to 16 of 24 accepted for Opus, 7 to 8 for Sonnet, from 12 work requests)
  with a small-sample caveat, and no longer say rules reliably arrive at the
  edit. Links to the study use its new title. The study chart shows both models.
- "Rules at the Edit" has a dated note: a false alarm does not cost one
  paragraph, it uses up the once-per-session delivery. It joins the series as
  part 2, between the study and the daily-use essay.
- The ontology result is now 20 of 21 vs 16 of 21 runs (seven synthetic tasks,
  three runs each) instead of 95% vs 76%, and says it measures reading the
  rule, not code quality. The fit score and the wrong-ask counts on
  `/coding-agents` now say what they measure. `/projects/vault` lists the
  daily-use essay under "Go deeper".
- "The Vault in Daily Use" now reports what the fixes did, each marked as
  measured on recorded data, projected, or not yet seen in live sessions. It
  says plainly that the first diagnosis of the missed contradiction was wrong.
  The study essay and "Rules at the Edit" now say the hook was changed and has
  not yet run in live sessions.
- The trimmed-index replay result is in: 21 of 21 runs read the right rule in
  both setups, a ceiling result that rules out a big loss of reach and nothing
  finer. No `PENDING` markers remain.

### 2026-11-24: the Vault path as one system

- The ten-stage interactive map now shows evidence moving forward to an answer and observed misses returning to the wiki and ontology work. Distinct stations, citations back to source material, and stage-specific explanations make the handoffs easier to follow.
- The diagram uses illustrative material and keeps the ontology work labeled as a pilot. A compact panel holds the main point; implementation boundaries sit behind “For engineers.”

### 2026-11-24: Ask Billy

- Added a public question-and-answer page and read-only MCP search over published site pages. Answers link to relevant pages. The assistant has no access to local notes or unpublished work.
- Visitor-facing introduction and navigation now use Billy, the name he goes by.

### 2026-11-23: positioning, no employment language

- Removed "open to remote senior and staff roles" from the home page and the AI
  engineering page. The site neither says the author is looking for work nor
  says he is not. Contact blocks now invite a question or an invitation to talk
  with a team. The shared callout reads "Ask me a question" and the email link
  reads "Email me a question".
- The resume page and its PDF stay as a record of experience. If the site should
  lean further from a job-search feel, the next step is to move the resume link
  out of the main navigation.

### 2026-11-23: rules at the edit, stale facts, one canonical Vault page

Branch `rules-at-the-edit`, from a full review of the live site.

- **New essay, "Rules at the Edit".** The strongest original idea on the site was
  a subheading with no page and no way to copy it. The essay makes it an
  argument (an agent cannot search for a rule it does not know exists), shows
  where in the workflow a rule can arrive, and includes a tested hook. It names
  its own limits: the two triggers were written after the failures and tested on
  the same two work requests, and a shell-writing model bypassed the first hook.
- **Cadences corrected in `bridging-the-gap`.** The essay and its diagram said
  daily, weekly, and monthly. The system runs one nightly pass and a weekly
  lint. A dated revision note explains why: compile moved to nightly because
  Monday's material waited until Sunday, and lint moved to weekly because drift
  accumulates weekly.
- **`vault-context-system` now opens with a failure** (a rule filed under the
  wrong project never reached the service that needed it) instead of
  definitions.
- **`/projects/vault` is the one page that explains the Vault.** The coding
  agents page keeps the results and drops the repeated four-step explainer. The
  home page and AI engineering page no longer restate the study result in their
  Vault teasers. The Vault page gained a "Go deeper" list of the four essays.
- Writing rules applied: "work request" for the assignment and "change" for the
  output, never words that point at a tracker; no em dashes; curly apostrophes in
  titles, because `check:metadata` compares `title` with `og:title` and fails on
  straight ones.
