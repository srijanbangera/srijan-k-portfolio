# CLAUDE.md

Context for working on this project. Read this before making changes — several
things here look like arbitrary choices but were deliberate, and a couple are
fixes for real bugs that will come back if undone.

## What this is

A 4-page static portfolio site for **Srijan K**, a Mangaluru-based freelance
graphic designer and web developer. Built from his existing poster/deck
artwork — the brand isn't invented, it's extracted from files he already had.

Plain HTML/CSS/JS. No build step, no framework, no dependencies. Every page
works by opening the `.html` file directly or serving the folder as-is.

## Files

```
index.html / about.html / work.html / contact.html
css/style.css     — all styling, one file, shared across pages
js/main.js        — nav menu, gallery filters, lightbox, contact form
images/           — photos and poster artwork
README.md         — setup, deployment, how to swap in new poster files
```

## Brand tokens — sampled, not guessed

Colors were picked with a script (`PIL`, sampling pixel values from the
original artboards), not eyeballed:

| Token | Hex | Source |
|---|---|---|
| `--maroon` | `#8B0003` | Background on every original artboard |
| `--cream` | `#EED9B9` | "PORTFOLIO" headline fill |
| `--yellow` | `#FEEE00` | "you" accent on the "Thank you" card |
| `--taupe` | `#C6B5A3` | "GRAPHIC DESIGNER" subhead — lightened from the sampled `#BCAB99` to clear WCAG AA contrast on maroon (see below) |

Fonts:
- **Playfair Display** — serif display (section headings, big quotes)
- **Poppins** — sans (UI, nav, buttons, body copy)
- **Fredoka** (`--font-headline`) — bold rounded display, homepage hero
  headline ("PORTFOLIO") only
- **Bangers** (`--font-script`) — bold comic-caps accent: signature, nav
  logo, "Contact me"/"that's me" annotations, all section/page-hero kickers
- **Press Start 2P** (`--font-marquee`) — retro pixel/arcade, the scrolling
  tools strip only

Fredoka/Bangers/Press Start 2P were picked as free-for-commercial-use
Google Fonts lookalikes for a request for Milker, Arcade Zone and Comic
Roasting — none of those three are on Google Fonts, and all three are
personal-use-only licenses, which would be a real licensing problem on a
site marketing a freelance business. If one of those three ever gets a
proper commercial license and self-hosted files, it can replace its
lookalike here — but don't just `@import` them from a random font CDN.

### Why Bangers (and Yellowtail before it), not Dancing Script

The site originally used **Dancing Script** for the signature/script
accents. **Do not switch back to it.** In Dancing Script, the dots of "i"
and "j" sit right next to each other, so "Srijan" rendered as "Srïjan"
(looked like an umlaut) in both the nav logo and the hero signature —
confirmed visually, not theoretical. Yellowtail was picked after testing a
dozen alternatives locally at the site's actual font sizes to fix this,
and Bangers (which replaced Yellowtail for a bolder/more playful request)
was checked the same way — it renders "Srijan" in unicase caps with no
dotted lowercase "i" at all, so the collision can't recur. **If a future
font change is proposed for the script role, render the word "Srijan" in
it first and check the "i"/"j" dots before committing** — this is the
second time a script font choice has needed this check; treat it as a
standing rule, not a one-off.

## Things to check before changing

- **`.nav-links > a` uses a direct-child combinator, not `.nav-links a` —
  keep it that way.** The "Start a Project" button is nested one level
  deeper inside `.nav-links` (in a `.nav-cta` wrapper). A plain `.nav-links
  a` selector has higher specificity than `.btn`'s single class and would
  silently overwrite the button's padding (this actually happened — the
  button's bottom padding got squashed to 4px and looked visibly
  misaligned). If you add new nav-link styling, scope it the same way.
- **Work page images are intentionally uncropped.** Several artboards contain
  two posters side by side (e.g. the Kondana festival pair, the blood donation
  pair). Srijan asked for these to be used as complete, uncropped images
  rather than split apart — he's providing cleaner individual files later. Do
  not crop or split these without asking first.
- **Contact info is real and lives in five places**: the Contact page card,
  and the footer on all four pages. If it changes, update all of them —
  phone `+91 81399 43849`, email `srijanbangerak@gmail.com`, Instagram
  `@srijann.k`.
- **Scroll-reveal animations are back, rebuilt with safeguards — do not
  strip the safety layers out.** An earlier version faded sections in on
  scroll via `IntersectionObserver` and was removed because it could leave
  content invisible depending on how the page was scrolled/loaded (fast
  programmatic jumps, fragment links, slow JS). The current version
  (`.reveal` class in `style.css`, logic in `main.js`) fixes that with four
  layers: (1) CSS only hides `.reveal` elements once `html.js-ready` is
  present, so a JS failure leaves everything visible by default; (2)
  reduced-motion users and browsers without `IntersectionObserver` get
  everything revealed immediately, no animation; (3) a 2-second `setTimeout`
  force-reveals anything the observer missed, no matter what; (4) the work
  page's filter handler explicitly adds `is-visible` to any card it shows,
  since a filtered-in card may never have crossed the observer's threshold.
  If you touch this system, keep all four layers — each one covers a
  different failure mode the previous version hit.
- **Reveal uses `translate`, not `transform`, for its slide-in offset —
  this is deliberate, not a typo.** Several hover effects (`.service-card`,
  `.work-card .thumb img`, `.process-step`, etc.) animate `transform` on
  `:hover`. `.reveal.is-visible` used to also set `transform`, and because
  its selector has higher specificity than a plain `:hover` rule, it
  silently cancelled every hover lift/scale on the site once an element had
  revealed. Switching the reveal offset to the independent `translate`
  property fixed this since `translate` and `transform` compose instead of
  competing. If you add a new hover effect that also needs `transform`,
  this is why it won't fight with scroll reveal — don't "simplify" the
  reveal rule back to using `transform`.
- The homepage hero's `fade-up` animation (`fade-up`/`fade-up-1..4` classes)
  is separate from `.reveal` — it's a guaranteed CSS-only `@keyframes` that
  always plays once on load, not tied to scroll. The About/Work/Contact
  page-hero kicker/heading/lede now use the same `fade-up` treatment for
  a consistent "hero" entrance across all four pages.
- **Contact form has no backend.** It builds a `mailto:` link on submit. If
  wiring up a real backend (Formspree, Web3Forms, etc.), update the note text
  in `contact.html` that currently says messages open an email app.

## Testing expectations

Before calling a change done, the standard this project was built to:

1. Validate HTML (balanced tags, no duplicate IDs) and confirm every local
   `href`/`src` resolves to a real file.
2. Screenshot every page at both desktop (~1440px) and mobile (~390px) widths
   in a real browser — Playwright is available (`pip show playwright` /
   Chromium already installed) — don't eyeball CSS changes without rendering
   them.
3. Click-test interactive pieces: gallery filters, lightbox open/close,
   mobile nav toggle, contact form submission.
4. Spot-check text contrast against the maroon background for anything new
   — several colors were deliberately nudged lighter already (see the taupe
   token above) to clear 4.5:1.

## Deployment

Static files, so Netlify drag-and-drop, GitHub Pages, or Vercel all work with
zero config. See README.md for specifics.
