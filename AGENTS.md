## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Publishing Articles

To publish a blog post automatically:
1. Generate Markdown content.
2. Save to `src/content/blog/<slug>.md` with frontmatter:
   ```yaml
   ---
   title: "Post Title"
   description: "Post summary"
   pubDate: YYYY-MM-DD
   tags: ["engineering"]
   draft: false
   ---
   ```
3. Run `pnpm run build` to verify there are no compilation errors.
4. Commit and push: `git add src/content/blog/<slug>.md && git commit -m "Publish: Post Title" && git push origin main`.
   GitHub Actions will deploy the post to https://blog.anoj.net.
