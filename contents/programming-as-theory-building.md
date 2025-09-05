---
title: Programming as Theory Building—Why "Just Read the Docs" (RTFM) Never Works
slug: programming-as-theory-building
date: 8/2/2025
description: Why understanding code requires more than documentation alone.
photo: "./blogContent/as-theory-building/resized_thumbnail.png"
banner: "../blogContent/as-theory-building/resized_banner.png"
---

# Introduction

Let’s be real for a second: how many times have you started on a new codebase, maybe at a new company or on a new team, and been told, “Just read the docs—you’ll figure it out”? If you’re like me (and just about everyone I’ve worked with), that advice falls flat. No matter how much you read, things just don’t click the way you want them to.

You’re staring at diagrams, you’re tracing through code, but the real understanding—the “why” behind how things fit together—just isn’t there yet. Why is that? Why do smart engineers still hit these walls even in supposedly “well-documented” systems?

 Today, I want to break down why this happens, using Peter Naur’s classic paper, [Programming as Theory Building](https://gwern.net/doc/cs/algorithm/1985-naur.pdf), and connect it directly to struggles we all run into in real projects. This is the first in a short series where I’ll dig into how our understanding of code, docs, and team knowledge actually works—and how we can do better.

---

# The “Theory” Behind the Code

Back in 1985, Peter Naur dropped a truth bomb on the programming world: programming isn’t just about writing code or documentation, it’s about building a working theory in your head. That theory covers not just what the code does, but how and why it does it. This isn’t just academic philosophy—this is the root cause of a ton of the headaches we see in onboarding, code reviews, and design discussions.

> “The crucial thing is not the program text itself, but the knowledge, or theory, the programmers develop about what the program is intended to do, how it does it, and why it’s built that way.” — Peter Naur

## Let’s Translate That

- **The code is not the program.** The files are just a partial record. The real program lives in the team’s shared mental model—the theory.

- **This theory is alive.** It spreads through conversations, pairing, whiteboard sessions, design docs, Slack threads, and sometimes, yes, those infamous code walkthroughs.

- **Theory can’t be transferred just by dropping someone a link to the docs.** No matter how good your wiki, no doc or diagram can fully replace what the team actually knows.

---

# Scenarios Where Theory Building Explains Everything

If you’ve worked in software longer than a month, you’ve hit at least one of these:

 - **Onboarding a new engineer:** You send them the onboarding guide, the architecture doc, even a shiny [C4 diagram](https://c4model.com). They still get lost. (How many times have we both said “follow the flow in the debugger, then ask questions”?)

 - **Decision context disappears:** You’re looking at some gnarly business rule and think, “Who made this decision, and why?” The [ADR](https://adr.github.io/) says one thing, but the code doesn’t line up, and nobody remembers the real story.

- **Docs vs. Reality:** I’ve seen (and written) diagrams that look clean, but when you trace a request through the actual system, it turns out half the modules aren’t even in the doc, or the process zig-zags in a way no one anticipated.

- **Code review confusion:** Someone new to the area asks “why don’t we just refactor it this way?” and the only answer is, “It’s complicated—trust me.” The knowledge isn’t written down, it’s in the team’s collective head.

- **Accidental knowledge silos:** One person always gets tapped for questions on a certain module. When they go on PTO, the rest of the team flounders. No doc can fill that gap overnight.

Sound familiar? That’s theory building (or the lack of it) in action.

---

# What This Means for Teams

 Docs and diagrams are helpful—I write them, I read them, and I advocate for them! But they’re always incomplete. They’re just a map, and as I’ll get into in the next post, [the map is not the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation).

What matters most is the living, breathing theory—what the team understands together. That’s why onboarding by osmosis (pairing, actual code changes, talking through history) works better than any checklist. It’s why “shadowing” senior devs or jumping into real tickets is where the learning actually happens.

---

# How Do We Build and Transfer Theory?

- **Make real knowledge sharing a team habit.** Don’t just rely on written docs. Encourage questions, pair often, do code walkthroughs, and keep the history alive.

- **Value “living knowledge.”** Treat the team’s understanding as an asset. When you see a gap, fill it—with a conversation, not just a doc update.

- **Onboard by experience.** Give new teammates real tasks, and encourage them to ask “why”—not just “what.”

---

# What to Expect in This Series

This post is the start of a three-part series on how teams actually build and share understanding:

1. **Programming as Theory Building (you’re reading it!)**: Why docs are never enough and the real system lives in the team’s head.

2. **The Map Is Not the Territory**: How written artifacts (docs, diagrams) can only ever be an approximation of the real system, and why relying solely on them is a trap.

 3. **Bridging the Gap—Practical Steps**: Concrete ways teams can close the gap between docs and real knowledge, including how to use things like [C4 diagrams](https://c4model.com) effectively for onboarding and living knowledge.

If you’ve felt that “just read the docs” is never quite enough, or you want to make onboarding and cross-team understanding better, this series is for you.

---

# Final Thoughts

Programming is theory building.
The real value isn’t just in the code—it’s in the team’s shared, living understanding.
Your job as an engineer is not just to write code, but to build, share, and evolve that theory with your team.

Stay tuned for the next post, where we dive into why “the map is not the territory”—and what that means for how you approach documentation, diagrams, and the actual system you work in every day.

If you enjoyed this post, follow me on the platforms linked at the bottom of this page.
