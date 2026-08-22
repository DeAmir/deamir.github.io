# Blog redesign verification

Verification date: 2026-08-22

This report follows `docs/redesign-acceptance.md`. The local implementation is
ready for visual approval. Production deployment remains intentionally pending
until that approval is given.

## Summary

| Area | Result | Evidence |
| --- | --- | --- |
| Content integrity | Pass | Protected post/tab hashes and authored-asset manifest pass. No tracked authored post or tab diff. |
| Production build | Pass | `JEKYLL_ENV=production bundle exec jekyll build` exits successfully. |
| Internal links and assets | Pass | HTML-Proofer checks 18 HTML files and 26 internal links with zero failures. |
| Markdown rendering | Pass | Existing headings, lists, blockquotes, code, links, images, footnotes, video tag, and iframes build without source changes. |
| LaTeX | Pass | MathJax rendered 258 math containers in the Montgomery post at every responsive test width. |
| Table of contents | Pass | Markdown-derived entries are larger (13px/12px), desktop is sticky, mobile is collapsible, and the current entry receives a boxed background highlight in both themes. |
| Responsive layout | Pass | Tested at 320, 375, 768, 1024, and 1440 px with zero page overflow. |
| Light/dark themes | Pass | Toggle, persistence across navigation, system-default selection, and both approved palettes verified. |
| Page surfaces | Pass | Home, About, Archives, Tags, Categories, 404, image-heavy post, code post, and math post checked at mobile and desktop widths. Figure captions are centered beneath images; post pages omit the grid while other surfaces retain it. |
| Accessibility structure | Pass | One `h1` per generated page, no duplicate IDs, labelled native controls, image `alt` attributes, skip link, semantic navigation, and WCAG AA palette contrast. |
| Generated resources | Pass | Feed and sitemap parse as XML; web manifest parses as JSON; site, service-worker, and registration JavaScript pass syntax checks. |
| Visual implementation | Requires Amir's visual approval | Local desktop/mobile and light/dark implementation is available for review. |
| GitHub Pages deployment | Pending visual approval | The production workflow has not been triggered. |

## Automated commands

```bash
JEKYLL_ENV=production bundle exec jekyll build
SITE_DIR=_site ruby scripts/test-redesign
bundle exec htmlproofer _site --disable-external=true
node --check assets/js/scholar.js
node --check _site/app.js
node --check _site/sw.js
xmllint --noout _site/feed.xml _site/sitemap.xml
```

All commands above passed locally. Checks that contain Jekyll front matter or
Liquid (`app.js`, `sw.js`, and `site.webmanifest`) were run against their
generated production files.

## Responsive browser matrix

The long Montgomery article was tested at every required width:

| Width | Page overflow | Math rendered | TOC entries | TOC mode |
| ---: | ---: | ---: | ---: | --- |
| 320 px | 0 px | 258 | 8 | Collapsible |
| 375 px | 0 px | 258 | 8 | Collapsible |
| 768 px | 0 px | 258 | 8 | Sticky |
| 1024 px | 0 px | 258 | 8 | Sticky |
| 1440 px | 0 px | 258 | 8 | Sticky |

Home, About, Archives, Tags, Categories, 404, the image-heavy Uncharted post,
and a code-containing recursion post were tested at 375 and 1440 px. Every
page had one primary heading, loaded its local images, and had zero horizontal
page overflow.

## Theme verification

- A fresh origin with no saved preference matched the operating-system theme.
- Switching themes updated the root theme, control label, pressed state, theme
  color, and Giscus theme configuration.
- The selected theme persisted while navigating between pages.
- The early inline theme initializer runs before the stylesheet, preventing a
  full-page incorrect-theme flash.

Contrast ratios for normal text and secondary text:

| Theme | Pair | Ratio |
| --- | --- | ---: |
| Light | primary text / background | 11.92:1 |
| Light | secondary text / background | 5.57:1 |
| Light | accent / background | 6.29:1 |
| Dark | primary text / background | 14.84:1 |
| Dark | secondary text / background | 9.28:1 |
| Dark | accent / background | 9.32:1 |

All exceed the WCAG AA 4.5:1 requirement for normal text.

## Content protection

`scripts/test-redesign` verifies the pre-redesign SHA-256 values for every
post and tab page, plus a combined manifest for authored images, video, and ELF
reference assets. It also verifies all baseline routes after every build.

No tracked authored Markdown file was changed by the redesign. The untracked,
unfinished ELF post was deleted at Amir's explicit request; its former route is
also asserted absent. Its supporting reference assets remain unchanged.

## Requested refinement checks

- The landing page has no `.home-abstract` block.
- Post numbers are `008` through `001`, so the newest post has the largest
  number.
- At 375 px, the Uncharted post has a 375 px document width (zero horizontal
  overflow), a collapsed TOC after navigation, and centered captions.
- At desktop width, TOC section/subsection labels compute to 13 px and 12 px.
- The active TOC box computes to `rgb(191, 219, 231)` in light mode and
  `rgb(49, 87, 90)` in dark mode.
- Post pages compute to `background-image: none`; non-post surfaces retain the
  Blueprint/Atlas grid.

## Automatic publishing dry run

On 2026-08-22, a temporary Markdown post was added with a unique date, subject,
category, heading, and LaTeX expression. A production build automatically:

- placed it first on the landing page as note `009` and shifted the prior newest
  note to `008`;
- generated its dated post page, Markdown heading anchor, MathJax loader, TOC
  target, taxonomy links, and adjacent-note navigation;
- added it to the subject and category indexes with correct counts and generated
  archive routes;
- added it to the chronological archive, Atom feed, and sitemap.

HTML-Proofer passed all 21 temporary-build pages and 29 internal links. The
dummy source was then deleted, the production site was rebuilt, and checks
confirmed that its post, subject, and category routes left no generated trace.

## Remaining acceptance gates

1. Amir reviews and approves the local visual implementation.
2. After approval, run the full suite again, commit only approved files, deploy
   through GitHub Pages, and verify the production URLs in a fresh browser.
