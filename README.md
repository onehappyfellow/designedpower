# Designed Power

A static Hugo reproduction of https://designedpower.net/. Docker is the only
local build prerequisite. No WordPress installation, database, Node, or Go is
needed.

## Preview

```sh
docker compose up
```

Open http://localhost:1313/. Changes rebuild automatically. Stop with Ctrl-C.
The development server binds only to localhost on the host machine.

## Build

```sh
docker compose run --rm hugo --minify --panicOnWarning
```

Publish the contents of `public/` to any static web host. Generated output is
ignored by Git. The Hugo container is pinned by version and digest in
`compose.yaml`.

## Source organization

- `content/`: six captured pages, including testimonials and manufacturer copy.
  HTML is intentional for this first pass: it preserves the existing structure
  and styling without introducing a redesign or rewriting the copy.
- `static/img/`: local copies of site images and manufacturer logos.
- `layouts/`: shared Hugo shell, navigation, footer, and page rendering.
- `static/css/`: original theme styles plus static-site integration rules.
- `static/js/site.js`: mobile navigation and disclaimer expansion.
- `hugo.toml`: production URL, site metadata, and generator settings.

The public site was captured on October 29, 2026. The WordPress theme and
unfinished Gatsby migration in sibling repositories were used as references.
There are no runtime requests to WordPress. The contact form is deliberately
unavailable; phone contact details remain visible. Legacy Google Analytics and
CloudSolar scripts are not carried into the static build.

## Separate content and code commits

The first staged group contains only `content/` and `static/img/`. Review and
commit that group first:

```sh
git diff --cached --stat
git commit -m "Import existing Designed Power content and images"
```

Then stage the implementation separately:

```sh
git add .gitignore README.md LICENSE-theme compose.yaml hugo.toml layouts static/css static/js docs scripts
git diff --cached --stat
git commit -m "Reproduce the existing site with Hugo and Docker"
```

Commits and pushes are performed by the repository owner. Keep future copy and
image changes separate from template, styling, and build changes as well.

## Validation

After building, run the dependency-free output check:

```sh
python3 scripts/check_site.py
```

It checks the six expected routes, local asset/link targets, product panel
counts, manufacturer/testimonial counts, and absence of WordPress runtime
references or active contact submission controls.

See [migration notes](docs/migration.md) for scope and remaining review work.
