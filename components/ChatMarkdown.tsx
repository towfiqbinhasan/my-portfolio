import { Fragment, type ReactNode } from "react";

/*
 * Tiny Markdown renderer for chatbot replies (shared by both site designs).
 * Handles what the assistant actually sends: **bold**, *italic*, `code`, [label](url) links,
 * bare URLs / emails, "- " bullet lists and "#" headings. Built from React elements only
 * (no innerHTML), and only http(s)/mailto/tel links become clickable, so a made-up link
 * like [LinkedIn](#) shows as plain text instead of a dead link.
 */

const INLINE =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>()]+[^\s<>().,!?;:'"])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|`([^`]+)`|\*([^*\s][^*]*?)\*/g;

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:)/i;

/** A long URL shown as text reads better without the protocol and trailing slash. */
const prettyUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="font-medium text-sky-300 underline decoration-sky-300/40 underline-offset-2 transition-colors hover:text-sky-200 hover:decoration-sky-200"
    >
      {children}
    </a>
  );
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const key = `${keyPrefix}-${i++}`;
    const [, bold, label, href, url, email, code, italic] = m;
    if (bold !== undefined) out.push(<strong key={key} className="font-semibold text-white">{inline(bold, key)}</strong>);
    else if (label !== undefined) {
      out.push(SAFE_HREF.test(href) ? <Link key={key} href={href}>{label}</Link> : <Fragment key={key}>{label}</Fragment>);
    } else if (url !== undefined) out.push(<Link key={key} href={url}>{prettyUrl(url)}</Link>);
    else if (email !== undefined) out.push(<Link key={key} href={`mailto:${email}`}>{email}</Link>);
    else if (code !== undefined) out.push(<code key={key} className="rounded bg-white/10 px-1 py-0.5 text-[0.85em]">{code}</code>);
    else if (italic !== undefined) out.push(<em key={key}>{italic}</em>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ChatMarkdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: ReactNode[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-1 space-y-1 pl-1">
        {list}
      </ul>
    );
    list = [];
  };

  text.split("\n").forEach((raw, n) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      list.push(
        <li key={n} className="flex gap-2">
          <span aria-hidden className="mt-[0.6em] h-1 w-1 flex-shrink-0 rounded-full bg-sky-300/80" />
          <span className="min-w-0">{inline(bullet[1], `li${n}`)}</span>
        </li>
      );
      return;
    }
    flushList();
    if (!line.trim()) {
      blocks.push(<div key={n} className="h-2" />);
      return;
    }
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push(
      heading ? (
        <p key={n} className="font-semibold text-white">{inline(heading[1], `h${n}`)}</p>
      ) : (
        <p key={n}>{inline(line, `p${n}`)}</p>
      )
    );
  });
  flushList();

  return <>{blocks}</>;
}
