import { use, Suspense } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "./MarkdownViewer.css";

const cache = new Map();

function fetchMarkdown(docPath) {
  if (!cache.has(docPath)) {
    cache.set(
      docPath,
      fetch(`${import.meta.env.BASE_URL}docs/${docPath}.md`).then((res) => {
        if (!res.ok) throw new Error("Document not found");
        return res.text();
      })
    );
  }
  return cache.get(docPath);
}

function MarkdownContent({ docPath }) {
  const content = use(fetchMarkdown(docPath));
  return (
    <article className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}

export default function MarkdownViewer() {
  const { "*": docPath } = useParams();
  return (
    <Suspense fallback={<div className="doc-loading">Loading…</div>}>
      <MarkdownContent docPath={docPath} />
    </Suspense>
  );
}
