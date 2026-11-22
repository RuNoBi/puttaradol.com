# puttaradol.com

Portfolio of Puttaradol Pongpanich (Run) — Data Engineer.
Next.js 16 · Tailwind v4 · Three.js · GSAP · Motion · Lenis.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit content (no component changes needed)

| File | What it holds |
|---|---|
| `src/content/profile.ts` | Name, headline, status, links (LinkedIn, Instagram, GitHub; set `email` to show it), About stats, "How I work" stages |
| `src/content/projects.ts` | Case studies — each entry becomes `/work/<slug>` plus a row on the home page |
| `src/content/experience.ts` | Internships, education, certificates |
| `src/content/stack.ts` | Tools and where each was used |

`/resume` is generated from the same files, so it never drifts. "Download PDF" opens the print dialog with an A4 layout.

## Pages

- `/` — Hero (ASCII portrait), Work, About, How I work, Experience, Skills, Contact
- `/work/[slug]` — case studies with architecture diagrams
- `/resume` — printable résumé
- `opengraph-image`, `sitemap.xml`, `robots.txt`, `icon.svg`, 404

## Deploy (Vercel + puttaradol.com)

1. Push this repo to GitHub.
2. vercel.com → **Add New → Project** → import the repo → Deploy (no settings needed).
3. Project → **Settings → Domains** → add `puttaradol.com` and `www.puttaradol.com`.
   Buy the domain there (simplest), or point your registrar's DNS to the records Vercel shows.
4. Set `www` to redirect to the apex domain.

## Notes

- `public/images/portrait.png` is the background-removed portrait. To redo it:
  `swift scripts/cutout.swift assets/portrait-source.jpg public/images/portrait.png`
- `assets/fonts/` holds Inter for the generated share image.
- Animations respect `prefers-reduced-motion`.
