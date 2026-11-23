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

- **Sample sizes and dates on every statistic.** Show how many runs or cases sit
  behind each number, next to the number, on the home page, `/coding-agents`,
  and in the essays. The accepted-change difference (11 vs 16 of 24 runs) is
  small at that size, so keep its caveat prominent and lead with the cost and
  serious-bug results where the evidence is stronger.
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
