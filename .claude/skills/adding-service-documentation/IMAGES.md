# Service Logo Guidelines

How to handle service logos. The icon shown on the service card is resolved from `docs/public/images/services/` by the generator — naming the asset correctly usually means you don't need to set `icon` in frontmatter at all.

## Logo Source

Service logos live in the Coolify repository:

```
https://github.com/coollabsio/coolify/tree/main/public/svgs
```

The logo filename is specified in the upstream YAML template:

```yaml
# logo: svgs/appsmith.svg
```

## Download Logo to Documentation

**IMPORTANT: Always download and store logos locally. Do NOT link to external URLs.**

**Source:** Coolify GitHub repository `public/svgs/{logo-name}.svg`
**Destination:** `docs/public/images/services/{filename-resolver-finds}`

Download directly from the GitHub raw URL:

```
https://raw.githubusercontent.com/coollabsio/coolify/main/public/svgs/{logo-name}.svg
```

### Why Download Locally?

- Full control: no broken links if external source changes
- Performance: faster loading from the same domain
- Reliability: docs work offline / behind restricted networks
- Optimization: lets us compress and standardize formats
- Versioning: tracks logo changes in git history

### Naming Convention (Important — Drives Auto-Resolution)

The icon resolver in `scripts/services-data.mjs` matches files by basename, case-insensitively, ignoring non-alphanumerics. For a service with slug `my-service` and title `My Service`, it tries these basenames in order:

1. `my-service-logo`
2. `my-service_logo`
3. `my-servicelogo`
4. `my-service`
5. `my-service-logo` (from title, normalized)
6. `my-service` (from title, normalized)

Then a fuzzy prefix fallback (`myservicelogo*` or `myservice*`).

**Recommended pattern:** `<slug>-logo.<ext>` — e.g. `my-service-logo.svg`. This always matches and is consistent across the repo.

Acceptable alternatives that also resolve automatically: `<slug>.<ext>`, `<slug>_logo.<ext>`, `<slug>logo.<ext>`.

**Recognized extensions:** `.svg`, `.png`, `.webp`, `.jpg`, `.jpeg`.

### When to Set `icon` Explicitly

You only need to set `icon` in frontmatter when:

- You have multiple logo files for one service and want to pin a specific one
- The asset's basename can't be made to match the resolver candidates
- The asset is shared with another service and lives outside the predictable name range

```yaml
---
icon: "/docs/images/services/some-other-name.svg"
---
```

## File Format Preferences

1. **SVG** — preferred for vector logos: scalable, small, sharp at any size
2. **WebP** — best for raster: modern format, great compression
3. **PNG** — acceptable, especially for logos with transparency
4. **JPEG** — avoid for logos (no transparency, lossy)

## Image Optimization

Before adding:

1. **Compress**
   - [Squoosh](https://squoosh.app/) for WebP conversion
   - [SVGOMG](https://jakearchibald.github.io/svgomg/) for SVG optimization
2. **Check size** — aim for under 100KB
   - SVG: usually < 50KB
   - WebP: aim for < 100KB
   - PNG: compress if > 100KB
3. **Verify dimensions** — at least 200px wide; square or landscape

## Using Images in Documentation

### When to Use Each Syntax

| Image Type | Syntax | Example |
|---|---|---|
| Logos (small) | Standard markdown | `![Appsmith](/docs/images/services/appsmith-logo.svg)` |
| Screenshots | `<ZoomableImage>` | `<ZoomableImage src="/docs/images/services/dashboard.webp" />` |
| Large images | `<ZoomableImage>` | `<ZoomableImage src="/docs/images/services/overview.webp" />` |

### For Service Logos

```markdown
![ServiceName](/docs/images/services/service-name-logo.svg)
```

- Path starts with `/docs/` (not `/public/`)
- Use the exact filename including extension
- Include alt text for accessibility

### For Screenshots

```vue
<ZoomableImage src="/docs/images/services/appsmith-dashboard.webp" />
```

Use `<ZoomableImage>` for:

- Dashboard screenshots
- Configuration panels
- UI walkthroughs
- Anything users may want to zoom

### For External Images

Avoid external image links. They are only acceptable as a *temporary placeholder* while you download and optimize the proper logo. Replace before merging.

## Path Reference

| File system | In markdown / Vue |
|---|---|
| `docs/public/images/services/logo.svg` | `/docs/images/services/logo.svg` |

The `/public/` part is omitted because VitePress serves files from `public/` at the root `/docs/` path.

## Body Image as Fallback

If frontmatter has no `icon` and no asset matches the resolver, the generator falls back to the first image referenced in the markdown body — `<ZoomableImage src="...">` or `![alt](...)`. The path must start with `/docs/images/services/` (or `/images/services/`, which is rewritten).

This is a safety net, not a recommended pattern. Prefer naming your logo so it resolves cleanly.

## Troubleshooting

### Logo not displaying

1. Check the file exists:
   ```bash
   ls docs/public/images/services/{slug}*
   ```
2. Verify the path used in markdown/frontmatter starts with `/docs/images/services/` and doesn't include `/public/`.
3. Confirm the extension matches the file (case-sensitive on some systems).
4. Run `bun run generate:services` and inspect `services.json` for the `icon` field of your service.

### Card shows fallback / no logo

The resolver couldn't find a match. Either:

- Rename the asset to `<slug>-logo.<ext>`, or
- Set `icon: "/docs/images/services/<your-file>.<ext>"` in frontmatter

### Image quality issues

- **Blurry** — image too small; need higher resolution
- **Pixelated** — use SVG, or a larger PNG/WebP
- **Large file size** — compress with Squoosh or similar
- **Wrong colors** — check both light and dark themes

## Best Practices

✅ **Do:**

- Download all logos to `docs/public/images/services/`
- Name files using the `<slug>-logo.<ext>` pattern
- Use SVG for vector logos
- Convert PNG to WebP for better compression
- Use standard markdown `![alt](path)` for the logo
- Use `<ZoomableImage>` for screenshots and large images

❌ **Don't:**

- Link to external image URLs (GitHub, CDNs)
- Use JPEG for logos
- Rely on the body-image fallback when a properly-named asset would work
- Use `<ZoomableImage>` for small logos
- Forget to include extensions in `icon` paths