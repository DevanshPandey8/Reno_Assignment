/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { formatNoticeDate, type SerializedNotice } from "@/lib/notices";

type NoticeCardProps = {
  notice: SerializedNotice;
  onDelete: (id: string) => Promise<void>;
};

function categoryStyles(category: string) {
  switch (category) {
    case "Exam":
      return "bg-sky-500/15 text-sky-100 border-sky-400/30";
    case "Event":
      return "bg-violet-500/15 text-violet-100 border-violet-400/30";
    default:
      return "bg-emerald-500/15 text-emerald-100 border-emerald-400/30";
  }
}

function excerpt(text: string) {
  return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
}

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/55 shadow-[0_24px_72px_rgba(15,23,42,0.28)] backdrop-blur-xl">
      {notice.image ? <img src={notice.image} alt={notice.title} className="h-44 w-full object-cover" /> : null}

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryStyles(notice.category)}`}>{notice.category}</span>
          {isUrgent ? <span className="rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-100">Urgent</span> : null}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-50">{notice.title}</h2>
          <p className="whitespace-pre-line text-sm leading-6 text-slate-300">{excerpt(notice.body)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2 text-sm text-slate-400">
          <span>{formatNoticeDate(notice.publishDate)}</span>
          <span className="font-medium uppercase tracking-[0.2em] text-slate-500">{notice.priority}</span>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(notice.id)}
            className="inline-flex items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
