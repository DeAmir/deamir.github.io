# Blog redesign: definition of done

This document is the acceptance contract for the redesign of `deamir.github.io`.
The redesign is not finished until every required item below has passed or Amir
has explicitly approved an exception.

## Non-negotiable requirements

1. Posts remain authored as Markdown files with YAML front matter. The theme
   wraps Jekyll's rendered output; writing posts must not require writing HTML.
2. Existing LaTeX and mathematical content continues to render correctly.
3. Existing authored content must not be added to, removed, or rewritten
   without Amir's explicit consent.
4. The site must work on desktop, tablet, and mobile devices.
5. Posts must have an automatically generated, clickable table of contents.
6. The Scholar layout is used in both themes:
   - Light mode: the pale, Blueprint-inspired blue palette.
   - Dark mode: the Atlas-inspired deep teal palette.
7. The site remains hosted at `https://deamir.github.io` using GitHub Pages.
8. Existing published post URLs must remain unchanged.

## 1. Content integrity

### Tests

- Record checksums of authored content before implementation.
- Compare the checksums after implementation.
- Review the final Git diff for changes to posts and authored page content.
- Compare the generated route list before and after implementation.
- Compare representative rendered pages before and after implementation.

### Pass criteria

- No file in `_posts/` is modified unless Amir explicitly approves it.
- Existing titles, dates, tags, categories, prose, equations, code, links,
  images, videos, embeds, and footnotes are unchanged.
- Existing About and tab-page content is unchanged.
- No summaries, descriptions, biographical claims, article text, or other new
  content is invented. Ordinary interface labels such as "About" and "Table of
  contents" are allowed.
- Every existing published post retains the same URL.

## 2. Production build

### Tests

Run the production build and local link validation:

```bash
JEKYLL_ENV=production bundle exec jekyll build
bundle exec htmlproofer _site --disable-external
```

Run the repository's GitHub Pages workflow and inspect its result.

### Pass criteria

- All commands exit successfully.
- There are no Liquid, Markdown, Sass, plugin, or template errors.
- There are no broken internal links.
- There are no missing local images, videos, scripts, stylesheets, or fonts.
- The GitHub Actions build and deployment jobs complete successfully.

## 3. Markdown rendering

### Tests

Render representative posts containing:

- Headings and nested headings
- Paragraphs and emphasis
- Ordered and unordered lists
- Blockquotes
- Inline and fenced code
- Internal, post-to-post, and external links
- Images
- Footnotes
- The existing local-video Liquid tag
- Existing raw embeds such as YouTube iframes

### Pass criteria

- Posts remain ordinary Markdown files.
- No post must be converted to HTML to fit the design.
- All tested Markdown constructs render correctly.
- Code blocks remain readable and overflow within their own container when
  necessary rather than widening the page.

## 4. LaTeX and mathematical content

### Tests

Test representative equations from the recursion, sampling, public/private
randomness, Montgomery multiplication, and matching posts.

Test inline math, display math, subscripts, superscripts, sets, fractions,
symbols, and long expressions in both themes and at desktop and mobile widths.

### Pass criteria

- Inline and display expressions render correctly.
- No raw math delimiters or commands such as `$$`, `\(`, or `\Sigma` are
  visibly left unrendered.
- Long equations do not break the page layout.
- Necessary overflow is contained by the equation region rather than creating
  page-level horizontal scrolling.
- Math remains legible in both light and dark modes.

## 5. Table of contents

### Tests

- Generate the TOC from Markdown headings in representative short and long
  posts.
- Activate every TOC entry and verify its target.
- Load direct fragment URLs such as `/posts/example/#section-name`.
- Test browser Back and Forward after TOC navigation.
- Test headings containing punctuation, math, and duplicate text.
- Test with pointer, keyboard, and a screen-reader-oriented accessibility scan.
- Test the desktop and mobile presentations separately.

### Pass criteria

- The TOC is generated automatically from Markdown headings.
- Every entry points to the correct, uniquely identified heading.
- Activating an entry moves to the correct section.
- The destination heading is not hidden behind site navigation.
- Direct fragment URLs and browser history work correctly.
- The TOC remains available while reading on desktop.
- The TOC is collapsible and non-obstructive on mobile.
- TOC controls expose correct accessible names and expanded states.

## 6. Responsive behavior

### Viewports

Test at a minimum:

- 320 px wide
- 375 px wide
- 768 px wide
- 1024 px wide
- 1440 px wide

### Pages

Test at a minimum:

- Homepage
- A long mathematical post
- An image-heavy post
- A post containing code
- Tags
- Archives
- About
- 404 page

### Pass criteria

- There is no accidental page-level horizontal scrolling.
- Text does not overlap, clip, or become unreasonably small.
- Navigation remains usable at every tested width.
- Article metadata wraps cleanly.
- Images, videos, and embeds fit their containers.
- Equations and code have controlled local overflow.
- The TOC changes appropriately between desktop and mobile.
- Mobile tap targets are comfortably usable.
- Desktop article lines remain a readable length.

## 7. Light and dark modes

### Tests

- Test the homepage and representative article pages in both themes.
- Change the theme, navigate between pages, and reload.
- Test with no saved preference under light and dark operating-system
  preferences.
- Inspect the initial render for an incorrect-theme flash.
- Run contrast checks on text, links, controls, code, equations, borders, and
  TOC elements.

### Pass criteria

- Light mode uses the approved pale Blueprint-inspired palette.
- Dark mode uses the approved Atlas-inspired palette.
- Content and layout are identical across themes.
- The theme control works on every page.
- A visitor's explicit selection persists across navigation and reloads.
- With no stored choice, the initial theme follows the system preference.
- Switching themes does not require reloading and does not create an
  unreadable flash.
- Both themes meet WCAG AA contrast for normal text.

## 8. Navigation and retained functionality

### Tests

- Exercise Home, About, Tags, Archives, tag pages, and post navigation.
- Exercise post-to-post links.
- Test retained GitHub, RSS, sharing, and social links.
- Verify Giscus on a comments-enabled post.
- Verify retained search behavior if search remains in the final navigation.
- Inspect the generated feed, sitemap, robots file, 404 page, and PWA files.

### Pass criteria

- All retained destinations and controls work.
- Existing post relationships and internal links are preserved.
- Giscus loads on eligible posts.
- Feed, sitemap, robots, 404, and retained PWA resources generate correctly.
- External links retain the intended behavior.

## 9. Accessibility and keyboard use

### Tests

- Navigate the whole site without a mouse.
- Inspect heading hierarchy and landmark structure.
- Inspect accessible names and state for navigation, theme, mobile-menu, and
  TOC controls.
- Test visible focus indicators.
- Test with reduced-motion preference enabled.
- Run an automated accessibility audit.

### Pass criteria

- Each page has one logical primary heading and a sensible heading hierarchy.
- Navigation, theme selection, TOC, links, and mobile menu work by keyboard.
- Keyboard focus is always visible.
- Controls expose accurate names and expanded or selected states.
- Decorative elements are hidden from assistive technology.
- Meaning never depends on color alone.
- Reduced-motion preferences are respected.
- The automated audit reports no serious or critical violations.

## 10. Visual regression

### Screenshots

Capture and review at least:

- Homepage at desktop and mobile widths
- Representative article at desktop and mobile widths
- Homepage and article in both light and dark modes
- Open mobile navigation
- Open mobile TOC
- Long equation
- Code block
- Image-heavy article

### Pass criteria

- The implementation matches the approved Scholar layout and palettes.
- Equivalent light and dark pages have the same layout and content.
- There is no unintended clipping, overlap, flashing, missing styling, or
  broken media.

## 11. Deployment and URL preservation

### Tests

- Deploy through the repository's GitHub Actions workflow.
- Open the production homepage and every existing published post route in a
  fresh browser session.
- Verify deployment resources do not refer to localhost, temporary files, or
  machine-specific paths.
- Verify the production site without relying on previously cached assets.

### Pass criteria

- The production site remains available at `https://deamir.github.io`.
- No custom server or separate hosting provider is required.
- Every existing published post URL returns the correct article.
- All production resources load from deployable paths.
- A fresh browser loads the redesigned site successfully.

## Final acceptance gate

The redesign may be called finished only when all of the following are true:

- Every required automated test passes.
- Production build, link validation, and GitHub Pages deployment pass.
- Authored content remains unchanged unless a change was explicitly approved.
- Markdown, LaTeX, TOC, responsive behavior, and both themes pass.
- Desktop and mobile visual reviews pass.
- Any exceptions are documented and explicitly approved by Amir.
- Amir approves the final visual implementation.

The final verification report must classify every acceptance item as one of:

- **Pass**
- **Fail**
- **Requires Amir's visual approval**

The redesign must not be described as complete while any required item is
failing or unverified.
