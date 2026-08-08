# Srijan K — Portfolio

Personal portfolio site for Srijan K, a freelance graphic designer and web developer based in Mangaluru, India. Four pages — Home, About, Work, Contact — showcasing event posters, brand work, and web projects.

Built as a plain static site on purpose: no framework, no build step, nothing to install. The colours (maroon, cream, hot yellow) and type choices are pulled directly from the poster and deck designs shown on the site, not picked arbitrarily.

## Stack

- HTML5, CSS3, vanilla JavaScript
- Google Fonts — Playfair Display, Poppins, Bangers, Fredoka, Press Start 2P
- No frameworks, no bundler, no npm packages

## Running it locally

Double-clicking `index.html` works for a quick look. For the mobile nav menu and a couple of other bits to behave exactly like they would in production, serve the folder through a local server instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```
index.html        Home
about.html        About
work.html         Work / gallery
contact.html      Contact
css/style.css     All styling, one file
js/main.js        Nav menu, gallery filters, lightbox, contact form
images/           Photos and poster artwork
```

## Notes

- The Work page gallery filters and lightbox are plain JS/CSS — no lightbox library.
- The contact form has no backend. It builds a `mailto:` link on submit and opens the visitor's email client with everything pre-filled.
- Scroll animations degrade gracefully — if JavaScript fails to load for any reason, all content stays fully visible rather than stuck hidden.

## Deploying

Static files, so any of these work with zero configuration:

- **Netlify** — drag the folder onto app.netlify.com/drop
- **GitHub Pages** — enable Pages on this repo, serving from `main`
- **Vercel** — `vercel` CLI or drag-and-drop import

## Contact

- srijanbangerak@gmail.com
- [@srijann.k](https://instagram.com/srijann.k) on Instagram
