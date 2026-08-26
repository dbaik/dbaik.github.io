# dbaik.github.io

GitHub Pages site:

- [Portfolio](https://dbaik.github.io/) — built from [`portfolio/`](portfolio/) (source: [dbaik/aistudio](https://github.com/dbaik/aistudio))
- [Birthday page](https://dbaik.github.io/hb/)

## Portfolio development

```bash
cd portfolio
npm install
npm run dev
```

Rebuild and publish to site root:

```bash
cd portfolio
npm run build
rsync -a --delete dist/assets/ ../assets/
rsync -a --delete dist/images/ ../images/
cp dist/index.html dist/cases.json ..
```
