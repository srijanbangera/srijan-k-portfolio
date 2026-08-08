# Srijan K — Portfolio Website

A 4-page static site (Home / About / Work / Contact) built to match your existing brand:
maroon background, cream display type, script accents — colours were sampled directly
from your artboards, not guessed.

## Files

```
index.html        Home
about.html        About
work.html         Work / gallery
contact.html      Contact
css/style.css     All styling (one file, shared by every page)
js/main.js        Nav menu, gallery filters, lightbox, contact form
images/           All photos and poster artwork
```

No build step, no dependencies — just static files. You can open `index.html`
directly in a browser to preview it right now.

## Viewing it locally

Double-clicking `index.html` works for a quick look, but some browsers restrict
things like the mobile menu when opened as a bare file. For an accurate preview,
run a tiny local server from inside this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Putting it online

This is a static site, so any of these work and are free for a portfolio:

- **Netlify** — drag the whole folder onto app.netlify.com/drop
- **GitHub Pages** — push this folder to a repo, enable Pages in settings
- **Vercel** — `vercel` CLI or drag-and-drop import

## Swapping in your individual poster files

The Work page (`work.html`) currently uses your combined artboards as-is (the ones
with two posters side by side). When you have the cleaner individual files ready:

1. Drop the new image(s) into `images/`.
2. Open `work.html`, find the project card you want to update — each one is wrapped
   in `<article class="work-card ...">` with an HTML comment above it like
   `<!-- PROJECT — swap the image src below -->`.
3. Change the `src="images/…"` (and the `href="images/…"` right above it, which
   feeds the click-to-enlarge view) to your new filename.
4. If one poster becomes two separate images, just duplicate that `<article>`
   block and give each its own image, title and description.

No other file needs to change — the gallery filter and lightbox both read
straight from the `data-category` and `href` attributes already on each card.

## Contact details used on the site

Pulled directly from your "Thank you" artwork:

- Phone: +91 81399 43849
- Email: srijanbangerak@gmail.com
- Instagram: @srijann.k

If any of these change, search for them across the four HTML files and the footer
(they're repeated in the footer on every page plus the Contact page card).

## The contact form

There's no backend, so the "Send message" button opens the visitor's email app
with the subject and message pre-filled, addressed to your email above. If you'd
rather have messages land somewhere without opening an email client, a service
like Formspree or Web3Forms can be dropped into `contact.html`'s form — happy to
wire that up if you want it.
