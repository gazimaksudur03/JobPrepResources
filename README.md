# Job Prep Resources

A React documentation site for IT job interview preparation. Content is authored in Markdown files and rendered with a clean, professional layout.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site.

## Adding Content

1. Create a new `.md` file inside `public/docs/`. Use sub-folders for categories (e.g. `public/docs/SQL/joins.md`).
2. Register the page in `src/docsConfig.js`:

```js
{
  category: "SQL",
  pages: [
    { title: "Joins", path: "SQL/joins" },
  ],
}
```

3. The page will appear in the sidebar and on the home page automatically.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
