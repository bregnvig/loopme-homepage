# Loopme — homepage

Statisk one-pager for Loopme (Flemming Bregnvig). Ingen build, ingen afhængigheder.

    index.html     markup + inline logo-SVG
    styles.css     designtokens og layout (mørkt + lyst tema, brand-teal #02a79e)
    main.js        scroll-progress, reveal, pointer-glow, loop-animation i hero
    assets/        loopme.svg (renset + beskåret), favicon.svg, loopme-original.svg

## Kør lokalt

    python3 -m http.server 8000

…og åbn <http://localhost:8000>.

## Redigering

- **CV-data** — hentet fra 7N-CV’et (21.09.2026). Årstal står i `<p class="role-when">` på hver `<article class="role">`.
- **Farver og typografi** — alt ligger som custom properties i `:root` øverst i `styles.css`. Det lyse tema overskriver kun tokens i `@media (prefers-color-scheme: light)`; ingen komponentregel kender sit tema.
- **Sektioner** — `#om`, `#teknologi`, `#f1` og `#cv`. Teaserkortene på forsiden linker til samme ankre.

## Deploy

Læg mappen som den er på en hvilken som helst statisk host (Netlify, Cloudflare Pages, GitHub Pages).
