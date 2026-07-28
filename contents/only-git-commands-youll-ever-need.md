---
title: Eight Git Commands for Everyday Work
slug: only-git-commands-youll-ever-need
date: 2020-12-30
updated: 2026-07-28
description: Eight Git commands that cover most daily work, plus safe ways to inspect, synchronize, rebase, and recover.
photo: "./blogContent/git-commands/git-everyday-workflow.svg"
banner: "../blogContent/git-commands/git-everyday-workflow.svg"
imageAlt: A diagram showing changes moving from the working tree through staging and local commits into a shared remote repository.
topics:
  - Developer Tools
featured: false
---

I have used Git from the command line for most of my career. Graphical clients can be useful, especially when visualizing history or resolving a complicated conflict, but the command line gives every Git operation a stable name.

You do not need to memorize Git's entire interface. Most daily work is one small loop:

1. Inspect the repository.
2. Create or switch to a branch.
3. Make a focused change.
4. Review and stage it.
5. Commit it.
6. Synchronize with the remote.
7. Push it for review.

These eight commands cover that loop. The title is less dramatic than the original version of this article because Git always has one more command waiting for you. The useful goal is a safe foundation, not a magic list.

## Before the eight: confirm Git is available

Open a terminal and run:

```bash
git --version
```

If Git is not installed, use the instructions at [git-scm.com/downloads](https://git-scm.com/downloads).

## 1. `git status`

Run `git status` before and after any operation you do not fully understand.

```bash
git status
```

It shows:

- Your current branch.
- Changes staged for the next commit.
- Changes made but not staged.
- New files Git is not tracking.
- Whether a merge or rebase is in progress.

Git has three relevant views of your work: the last commit, the staging area, and the working tree. `git status` tells you how they differ.

## 2. `git clone`

Clone creates a local repository from an existing remote:

```bash
git clone git@github.com:organization/project.git
cd project
```

The default remote is usually named `origin`. Confirm rather than assume:

```bash
git remote -v
```

## 3. `git switch`

Create and switch to a new branch:

```bash
git switch -c describe-the-change
```

Switch to an existing local branch:

```bash
git switch main
```

Switch back to the previous branch:

```bash
git switch -
```

Older Git instructions use `git checkout` for both branch switching and file restoration. `git switch` gives branch movement its own name, which makes intent clearer. Git will normally refuse to switch when doing so would overwrite local changes.

## 4. `git add`

`git add` moves selected changes into the staging area for the next commit.

Stage a specific file:

```bash
git add src/orders/OrderService.cs
```

Interactively choose parts of files:

```bash
git add -p
```

Stage all changes beneath the current directory:

```bash
git add .
```

`git add .` is convenient, but inspect first. It can stage generated files, debugging output, unrelated edits, and secrets. A `.gitignore` helps with predictable generated content, but it is not a substitute for reviewing the diff.

Review what is staged:

```bash
git diff --staged
```

## 5. `git commit`

A commit records the staged snapshot:

```bash
git commit -m "Explain authorization token boundaries"
```

A useful commit is small enough to review and complete enough to make sense. Its message should describe the change or outcome, not the activity:

```text
Good: Reject tokens with the wrong audience
Weak: Make auth changes
```

If `git commit` says there is nothing to commit, check `git status`. You may have forgotten to stage the files, or there may be no changes.

## 6. `git pull`

`git pull` fetches remote changes and then integrates them into the current branch.

For a shared branch such as `main`:

```bash
git switch main
git pull --ff-only
```

`--ff-only` updates the branch only when Git can move it forward without creating a merge commit. If the local and remote branches diverged, Git stops and asks you to make that choice explicitly.

To download remote state without integrating anything:

```bash
git fetch origin
```

Fetch is worth knowing even though it is outside the eight. It lets you inspect `origin/main` before changing your branch.

## 7. `git rebase`

Rebase replays your branch's commits on a new base:

```bash
git fetch origin
git switch describe-the-change
git rebase origin/main
```

This is useful for bringing a private feature branch up to date without adding a merge commit.

If Git reports a conflict:

1. Open each conflicted file and choose the correct result.
2. Stage the resolved files with `git add`.
3. Continue:

```bash
git rebase --continue
```

If the rebase is going badly, return to the state from before it began:

```bash
git rebase --abort
```

Do not rebase a shared branch other people have based work on. Rebase rewrites commit identities.

Interactive rebase is a separate history-editing tool:

```bash
git rebase -i HEAD~3
```

Use it to reorder, combine, or edit your own recent commits. It is not required merely to update a feature branch.

## 8. `git push`

The first push of a branch can establish its upstream:

```bash
git push -u origin describe-the-change
```

After that:

```bash
git push
```

If you rebased a branch that you previously pushed, the remote history no longer matches. Prefer:

```bash
git push --force-with-lease
```

`--force-with-lease` refuses to overwrite the remote branch when it has moved somewhere you have not seen. Plain `--force` removes that protection and can erase someone else's work.

Never force-push a shared protected branch unless the team has explicitly designed a recovery procedure around it.

## The everyday workflow

Starting new work:

```bash
git switch main
git pull --ff-only
git switch -c explain-token-validation
```

Reviewing and committing:

```bash
git status
git diff
git add -p
git diff --staged
git commit -m "Explain token validation requirements"
```

Publishing:

```bash
git push -u origin explain-token-validation
```

Updating the branch before review:

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

## Recovery commands worth knowing

These are not part of the eight, but they make experimentation less frightening.

Discard unstaged changes to one file:

```bash
git restore path/to/file
```

Remove a file from the staging area without discarding the edit:

```bash
git restore --staged path/to/file
```

Create a new commit that reverses a published commit:

```bash
git revert <commit>
```

Find previous branch tips and other recent positions:

```bash
git reflog
```

Be cautious with `git reset --hard`, `git clean`, and plain force-pushes. They can destroy uncommitted work or rewrite reachable history. When recovery is the goal, inspect `git status` and `git reflog` before reaching for a destructive command.

## Command summary

| Command | Purpose |
| --- | --- |
| `git status` | Inspect the branch, staging area, and working tree |
| `git clone <url>` | Create a local repository from a remote |
| `git switch -c <branch>` | Create and switch to a branch |
| `git add <path>` | Stage selected changes |
| `git commit -m "<message>"` | Record the staged snapshot |
| `git pull --ff-only` | Safely advance a shared local branch |
| `git rebase origin/main` | Replay a private branch on the current remote base |
| `git push -u origin <branch>` | Publish a branch and establish its upstream |

The complete command reference lives in the official [Git documentation](https://git-scm.com/docs). Learn the eight-command loop first, keep `git status` close, and add specialized commands only when a real workflow requires them.
