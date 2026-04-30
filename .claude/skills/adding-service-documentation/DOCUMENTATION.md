# Service Documentation Guide

How to write a service documentation page. The frontmatter is now load-bearing — it's parsed by `scripts/services-data.mjs` to build the listing and the All Services directory.

## File Location

Create the markdown file at:

```
docs/services/{service-slug}.md
```

**Naming convention:** lowercase, hyphenated (kebab-case)

- ✅ `my-service.md`
- ❌ `MyService.md`
- ❌ `my_service.md`

The slug is the filename without `.md`. It also becomes the URL path: `/services/my-service`.

## Required Structure

### Frontmatter (YAML)

The frontmatter is read by the generator. It must include `title`, `description`, and `category`.

```yaml
---
title: "Service Name"
description: "Short description used on the listing card and in all.md."
og:
  description: "Optional longer SEO/social-card description."
category: "Analytics"
icon: "/docs/images/services/service-name-logo.svg"
---
```

| Field | Required | Used for |
|---|---|---|
| `title` | yes | Card title; `name` in `services.json`; link text in `all.md` |
| `description` | yes | Card description; `all.md` entry; default `<meta name="description">` |
| `category` | yes | Filter pill in the listing; `## Heading` in `all.md` |
| `icon` | optional | Card thumbnail. Omit it and the resolver will find a matching file in `docs/public/images/services/` |
| `og.description` | optional | Override for social-card and SEO description |
| `disabled` | optional | `true` hides the service from the listing while keeping the page reachable |

**Notes:**

- Only top-level scalar keys are parsed by `services-data.mjs`. Nested keys like `og.description` are ignored by the generator (they're still picked up by VitePress for OG tags).
- Quotes around values are optional and are stripped on parse.

### Page Body

#### 1. Title

```markdown
# ServiceName
```

#### 2. Logo (Required)

```markdown
![ServiceName](/docs/images/services/service-name-logo.svg)
```

- Use standard markdown `![alt](path)` for the logo.
- Use `<ZoomableImage>` only for screenshots or other large images users need to zoom into.
- Path starts with `/docs/images/services/` (not `/public/`).
- The body image also acts as a *fallback* for icon resolution if the resolver can't find a matching file in `docs/public/images/services/` and you didn't set `icon` in frontmatter.

#### 3. What is ServiceName?

```markdown
## What is ServiceName?

[2–4 paragraphs describing the service, features, and use cases]
```

**Writing tips:**

- Start with what the service does
- Explain key features
- Mention who it's for
- Keep language simple and clear

#### 4. Links (Required)

```markdown
## Links

- [The official website](https://example.com?utm_source=coolify.io)
- [GitHub](https://github.com/org/repo?utm_source=coolify.io)
```

Always append `?utm_source=coolify.io` to external links.

## Optional Sections

Add when relevant:

### Features

```markdown
## Features

- Feature 1: Description
- Feature 2: Description
```

### Why ServiceName

```markdown
## Why ServiceName

- Benefit 1
- Benefit 2
```

### Learning Resources

```markdown
## Learning Resources

- [Documentation](https://docs.example.com?utm_source=coolify.io)
- [Tutorials](https://example.com/tutorials?utm_source=coolify.io)
```

### Configuration

```markdown
## Configuration

1. Configure X
2. Set environment variable Y
3. Restart the service
```

### Need Help?

```markdown
## Need Help?

- [Discord](https://discord.gg/invite?utm_source=coolify.io)
- [Community Forum](https://forum.example.com?utm_source=coolify.io)
```

## Documentation Templates

See [TEMPLATES.md](./TEMPLATES.md) for ready-to-use templates (minimal and comprehensive).

## Writing Style Guidelines

1. **Clear and simple:** write for non-native English speakers
2. **Concise:** get to the point quickly
3. **Helpful:** focus on what users can accomplish
4. **Accurate:** verify information from official sources
5. **Structured:** use headings, lists, and short paragraphs

## Common Mistakes

❌ **Don't:**

- Hand-edit `docs/services/all.md` or `docs/.vitepress/theme/data/services.json` — both are regenerated
- Omit `category` from frontmatter — the service won't appear in `all.md`
- Use external image URLs — always download logos locally first
- Use relative paths for images
- Omit UTM parameters from external links
- Use `<ZoomableImage>` for small logos (unnecessary zoom)

✅ **Do:**

- Always include `title`, `description`, and `category` in frontmatter
- Use kebab-case for the filename and the slug
- Save logos to `docs/public/images/services/` with a name the resolver will find
- Use standard markdown `![alt](path)` for the logo
- Use `<ZoomableImage>` for screenshots only
- Append `?utm_source=coolify.io` to all external links
- Run `bun run generate:services` and commit the regenerated files

## Content Sources

Where to find information:

1. Service's official website
2. GitHub README
3. Official documentation
4. Service's "About" page
5. Existing documentation in the repository