"use client";

interface ArticleBodyProps {
  content: string;
}

function formatInline(s: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let rest = s;
  while (rest.length > 0) {
    const bold = rest.match(/\*\*(.+?)\*\*/);
    const code = rest.match(/`([^`]+)`/);
    const link = rest.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const idx = Math.min(
      bold?.index ?? 999,
      code?.index ?? 999,
      link?.index ?? 999
    );
    if (idx === 999) {
      parts.push(rest);
      break;
    }
    if (idx > 0) parts.push(rest.slice(0, idx));
    if (bold && (bold.index ?? 999) === idx) {
      parts.push(<strong key={parts.length}>{bold[1]}</strong>);
      rest = rest.slice((bold.index ?? 0) + bold[0].length);
    } else if (code && (code.index ?? 999) === idx) {
      parts.push(
        <code
          key={parts.length}
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800"
        >
          {code[1]}
        </code>
      );
      rest = rest.slice((code.index ?? 0) + code[0].length);
    } else if (link && (link.index ?? 999) === idx) {
      parts.push(
        <a
          key={parts.length}
          href={link[2]}
          className="text-zinc-900 underline dark:text-zinc-50"
        >
          {link[1]}
        </a>
      );
      rest = rest.slice((link.index ?? 0) + link[0].length);
    } else {
      rest = rest.slice(idx);
    }
  }
  return <>{parts}</>;
}

export function ArticleBody({ content }: ArticleBodyProps) {
  const lines = content.trim().split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={nodes.length} className="mt-2 list-disc space-y-1 pl-6">
          {listItems.map((item, i) => (
            <li key={i} className="text-zinc-700 dark:text-zinc-300">
              {formatInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3
          key={nodes.length}
          className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2
          key={nodes.length}
          className="mt-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      if (!inList) flushList();
      inList = true;
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      nodes.push(
        <p
          key={nodes.length}
          className="mt-3 text-zinc-700 dark:text-zinc-300 leading-relaxed first:mt-0"
        >
          {formatInline(line)}
        </p>
      );
    }
  }
  flushList();

  return <div className="article-content space-y-3">{nodes}</div>;
}
