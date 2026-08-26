# Create a new site from the platform

This guide walks you through making a brand-new website from this platform and
putting it on GitHub. You do not need to know Git or Terminal yet — every
command you need is written out for you to copy.

You will use these three names throughout:

| Name | What it is |
| --- | --- |
| `site-platform-source` | Your local copy of the reusable platform |
| `my-new-site` | The folder for your new website |
| `my-new-site` | The new repository on GitHub |

**How to read the commands.** Each grey box holds one or more commands. Copy a
line, paste it into Terminal, and press Return. When a command is split across
several lines with a `\` at the end, copy the whole block — the `\` just means
"this command continues on the next line."

**Before you start**, you need Terminal (already on every Mac), Git, Node.js 22
(the version in `starter/base/.nvmrc`), and — for step 5 — the GitHub CLI
(`gh`). A no-CLI alternative is included at the end of step 5.

---

## 1. Clone the platform

"Cloning" means downloading a copy of a repository from GitHub onto your
computer.

```bash
cd ~/Projects

git clone \
  https://github.com/randalmaile/site-platform-v0.git \
  site-platform-source
```

`cd` means "change directory" — it moves Terminal into your `~/Projects`
folder. (`~` is shorthand for your home folder.)

`git clone` downloads the reusable platform into a new folder named
`site-platform-source`. That folder is the platform itself: the shared starting
point that every website you build from it will inherit. You are not going to
edit it.

---

## 2. Copy the starter

The platform contains a neutral starter application at `starter/base`. Your new
website begins as a copy of it.

```bash
cp -R site-platform-source/starter/base my-new-site
cd my-new-site
```

`cp -R` copies a folder and everything inside it. The second command moves
Terminal into your new folder, so every command after this point runs on your
new site.

What just happened:

- `site-platform-source` stays exactly as it is — it remains the reusable
  platform, ready for the next site you make;
- `my-new-site` is now a separate, independent website that is yours to change;
- the copy came from a **fresh clone**, so it contains only the files that are
  actually tracked in the platform repository;
- that means no secrets and no generated files came along — things like `.env`,
  `node_modules/`, and `.next/` are ignored by Git, so a fresh clone never had
  them to copy;
- the new folder does **not** inherit the platform repository's Git history.
  The `.git` folder that records that history lives at the top of
  `site-platform-source`, not inside `starter/base`. Your site starts with a
  clean slate, which is exactly what you want — you will create its own history
  in step 4.

> Use plain `cp -R` as shown. Do not substitute `git archive`, `tar`, `rsync`,
> or a custom generator script — this guide describes one workflow, and mixing
> in another tool changes what ends up in your folder.

---

## 3. Install and test the new site

Now check that your copy actually runs before you save anything to Git.

```bash
npm install
npm run verify
npm run dev
```

- `npm install` downloads the code libraries the site depends on. This takes a
  few minutes the first time and creates the `node_modules/` folder.
- `npm run verify` is the quality gate: it checks the code style, checks the
  types, checks the routes, and does a full production build. If it finishes
  without errors, your copy is healthy.
- `npm run dev` starts the development server — a local web server that runs
  the site on your own machine.

While the development server is running, open these in your browser:

Website:

```text
http://localhost:3000
```

Content editor:

```text
http://localhost:3000/keystatic
```

`localhost` means "this computer," so these pages are visible only to you.

**To stop the development server**, click back into the Terminal window and
press:

```text
Control + C
```

That is the `control` key and the letter `C` at the same time. The server stops
and your normal Terminal prompt comes back.

---

## 4. Initialize independent Git history

With the development server stopped, turn `my-new-site` into its own Git
repository.

```bash
git init -b main
git add .
git status
git commit -m "Initialize new site"
```

What each command does:

- `git init -b main` creates a brand-new, empty Git repository in this folder
  and names its main line of work `main`. This is what makes your site
  independent of the platform.
- `git add .` stages every project file — "staging" means marking files to be
  included in the next save.
- `git status` shows you exactly what is staged, before you save it.
- `git commit -m "Initialize new site"` creates the first saved version of your
  site. The text after `-m` is the message describing that save.

**Check the `git status` output before you commit.** You should see your
project files — things like `package.json`, `src/`, `content/`, and `docs/`.
You should **not** see:

- `.env` or any other credentials file;
- `node_modules/`;
- `.next/`;
- other generated folders such as `dist/`, `.vinext/`, or `.wrangler/`.

Those are excluded by the `.gitignore` file that came with the starter. If any
of them do appear, stop and ask for help rather than committing — secrets are
very hard to remove from Git once they are saved.

---

## 5. Create and push the GitHub repository

"Pushing" means uploading your saved commits to GitHub.

### Using the GitHub CLI

```bash
gh auth status

gh repo create my-new-site \
  --private \
  --source=. \
  --remote=origin \
  --push
```

What this does:

- `gh auth status` shows which GitHub account you are currently signed in as.
  Check it before creating anything, so the repository lands in the right
  place.
- The new repository is created under that account.
- `--private` means only you can see it. Replace it with `--public` if you want
  the repository visible to everyone.
- `--source=.` tells `gh` to use the current folder (`.` means "here").
- `--remote=origin` names GitHub as `origin` — from now on, `origin` is your
  project's destination on GitHub.
- `--push` uploads your initial commit right away.

### If you do not use the GitHub CLI

1. On GitHub, create an empty repository named `my-new-site`.
2. Do **not** initialize it with a README, a `.gitignore`, or a license — your
   folder already has its own files, and an initialized repository would
   conflict with them.
3. Copy the repository URL that GitHub shows you.
4. Back in Terminal, in your `my-new-site` folder, run:

```bash
git remote add origin REPLACE_WITH_REPOSITORY_URL
git push -u origin main
```

Replace `REPLACE_WITH_REPOSITORY_URL` with the URL you copied. The `-u` flag
links your local `main` branch to the one on GitHub, so future uploads are just
`git push`.

---

## You are done

You now have:

- `site-platform-source` — the reusable platform, untouched and ready for the
  next site;
- `my-new-site` — an independent website with its own Git history, running
  locally and backed up on GitHub.

To keep working on the site, read
[`starter/base/README.md`](../starter/base/README.md) — the same file is at the
top of your new folder as `README.md`, and its `docs/` directory explains how to
add pages and components.

This guide deliberately covers only cloning, copying, verifying, initializing
Git, and pushing. Design, content, deployment, and hosting are separate topics.
