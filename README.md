# Afzal Hossain Raju — 3D Portfolio

A personal and professional portfolio built with **Next.js 16**, **React Three Fiber**, **Motion** and **Tailwind CSS v4**.

A single WebGL particle field (up to 16k particles, custom GLSL) lives behind the whole page and morphs as you scroll:

| Section | Shape |
| --- | --- |
| Hero | Spiral galaxy |
| About | Neural sphere |
| Skills | DNA double helix |
| Journey | Rolling wave terrain |
| Work | Torus knot |
| Media | Portal ring |
| Contact | Globe with a beam over Dhaka |
| Footer | The globe rises like a planet |

Particles move away from the cursor, ripple outward on click, and swirl when you scroll fast.

Other features: a draggable 3D skill sphere, a flip portrait card (Professional ↔ Personal), a pinned horizontal-scroll project gallery, scroll-drawn timelines, a magnetic custom cursor, Lenis smooth scrolling, an intro preloader and a generated Open Graph image.

Reduced-motion preferences are respected, and the site still works if WebGL is unavailable.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Edit the content

**Every word, link and image lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).** Update that file; no component changes needed. Photos are in `public/images/`.

To retune the 3D choreography (where each shape sits, its colours, opacity and spin per section), edit [`src/components/three/scene-config.ts`](src/components/three/scene-config.ts).

## Contact form

The form works out of the box: pressing **Send message** opens the visitor's email app with the subject and message pre-filled, so they only have to press send. Computers with no default mail app (common on Windows) silently ignore that, so the form also shows one-click **Gmail**, **Outlook**, **Mail app** and **Copy message** options, all pre-filled.

To have messages delivered straight to your inbox with no email app involved:

1. Get a free access key at [web3forms.com](https://web3forms.com) (enter the address that should receive messages).
2. Locally: create `.env.local` (see `.env.example`) with `NEXT_PUBLIC_WEB3FORMS_KEY=your-key`, then restart the server.
3. On Vercel: add the same variable under **Settings → Environment Variables**, then redeploy.

## Deploy to Vercel

The Next.js app lives in the `portfolio-3d/` subfolder of the repo, so tell Vercel where it is.

**From GitHub (recommended, redeploys on every push):**

1. Commit and push this folder to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo.
3. Set **Root Directory** to `portfolio-3d`. Vercel detects Next.js; leave the build settings at their defaults.
4. Click **Deploy**.

**From the CLI:**

```bash
cd portfolio-3d
vercel          # preview deploy (first run links the project)
vercel --prod   # production deploy
```

Environment variables (all optional):

- `NEXT_PUBLIC_WEB3FORMS_KEY`: delivers form messages to your inbox (see above).
- `NEXT_PUBLIC_SITE_URL`: only needed for a custom domain. Without it, social-share links, `robots.txt` and `sitemap.xml` use the Vercel production domain.

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

## Structure

```
src/
  app/                 layout (fonts, SEO, JSON-LD), page, icon, OG image, robots, sitemap
  data/portfolio.ts    all site content
  components/
    three/             WebGL scene: shapes, morphing particles, starfield
    sections/          Hero, About, Skills, Journey, Work, Media, Contact, Footer
    ui/                cursor, navbar, preloader, tilt cards, tag sphere, reveals…
    providers/         Lenis smooth scroll + Motion config
  lib/                 shared scene state, hooks, intro store, site URL
```
