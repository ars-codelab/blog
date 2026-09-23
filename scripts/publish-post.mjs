#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const blogDir = path.join(rootDir, 'src', 'content', 'blog');

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  node scripts/publish-post.mjs --title "Post Title" --desc "Summary" [--slug "custom-slug"] [--tags "ai,engineering"] [--file "/path/to/content.md"] [--push]

Options:
  --title        Post title (required)
  --desc         Brief post description for meta/feed (required)
  --slug         Slug for file name and URL (default: kebab-cased title)
  --tags         Comma-separated list of tags (default: general)
  --draft        Set draft status (default: false)
  --file         Markdown body content file to import
  --push         Immediately git add, commit, and push to main (triggers deploy)
`);
  process.exit(0);
}

function parseArgs(args) {
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (key === 'push' || key === 'draft') {
        parsed[key] = true;
      } else {
        parsed[key] = args[++i];
      }
    }
  }
  return parsed;
}

const params = parseArgs(args);

if (!params.title) {
  console.error("Error: --title is required");
  process.exit(1);
}

const title = params.title;
const desc = params.desc || `${title} - Published notes by Anoj Sundar`;
const slug = params.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const tags = params.tags ? params.tags.split(',').map(t => t.trim()) : ['engineering'];
const draft = !!params.draft;
const pubDate = new Date().toISOString().split('T')[0];

let content = `
Write your dispatch here. Supports full Markdown, code blocks, lists, and links.
`;

if (params.file) {
  const filePath = path.resolve(process.cwd(), params.file);
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf-8');
    // If the imported file already has frontmatter, strip it
    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        content = parts.slice(2).join('---').trim();
      }
    }
  } else {
    console.error(`Error: File ${filePath} not found`);
    process.exit(1);
  }
}

const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${desc.replace(/"/g, '\\"')}"
pubDate: ${pubDate}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
draft: ${draft}
---

${content.trim()}
`;

const targetFile = path.join(blogDir, `${slug}.md`);
fs.writeFileSync(targetFile, fileContent, 'utf-8');
console.log(`✓ Created post: ${targetFile}`);

if (params.push) {
  console.log("Building site locally to verify...");
  execSync('pnpm run build', { cwd: rootDir, stdio: 'inherit' });

  console.log("Committing and pushing to main...");
  execSync(`git add src/content/blog/${slug}.md`, { cwd: rootDir, stdio: 'inherit' });
  execSync(`git commit -m "Publish: ${title.replace(/"/g, '\\"')}"`, { cwd: rootDir, stdio: 'inherit' });
  execSync(`git push origin main`, { cwd: rootDir, stdio: 'inherit' });
  console.log(`🚀 Published! GitHub Pages will deploy in ~1 minute at https://blog.anoj.net/posts/${slug}`);
} else {
  console.log(`\nTo publish, commit and push to main, or run with --push.`);
}
