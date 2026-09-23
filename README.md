# blog.anoj.net

Personal blog and technical writing for Anoj Sundar, hosted on GitHub Pages with Astro.

- **URL**: [https://blog.anoj.net](https://blog.anoj.net)
- **Engine**: [Astro](https://astro.build)
- **Deployment**: Automatic GitHub Actions on push to `main`

## Publishing a Post (For AI Agents & Humans)

Posts are located in `src/content/blog/<slug>.md`.

### Method 1: Using the automated helper script

```bash
# Preview post creation:
node scripts/publish-post.mjs --title "My New Article" --desc "Article summary" --tags "ai,systems"

# Create and push directly to publish:
node scripts/publish-post.mjs --title "My New Article" --desc "Article summary" --file "/path/to/draft.md" --push
```

### Method 2: Create markdown file directly

Create `src/content/blog/<slug>.md` with frontmatter:

```markdown
---
title: "Article Title"
description: "Brief summary for feed and metadata"
pubDate: 2026-09-23
tags: ["ai", "engineering"]
draft: false
---

Post content in Markdown goes here...
```

Then commit and push:
```bash
git add src/content/blog/<slug>.md
git commit -m "Publish: Article Title"
git push origin main
```

GitHub Actions will automatically build and deploy within ~60 seconds.

## Local Development

```bash
pnpm install
pnpm dev
```
