import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import NoticeCard from "@/components/NoticeCard";
import { prisma } from "@/lib/prisma";
import { serializeNotices, type SerializedNotice } from "@/lib/notices";

type HomePageProps = {
  notices: SerializedNotice[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }, { createdAt: "desc" }],
  });

  return {
    props: {
      notices: serializeNotices(notices),
    },
  };
};

export default function Home({ notices: initialNotices }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [notices, setNotices] = useState(initialNotices);

  const handleDelete = async (noticeId: string) => {
    try {
      const shouldDelete = window.confirm("Delete this notice? This action cannot be undone.");

      if (!shouldDelete) {
        return;
      }

      const response = await fetch(`/api/notices/${noticeId}`, {
        method: "DELETE",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok && response.status !== 204) {
        throw new Error(payload?.error ?? "Unable to delete the notice.");
      }

      setNotices((current) => current.filter((notice) => notice.id !== noticeId));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to delete the notice.");
    }
  };

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta
          name="description"
          content="A responsive notice board with full CRUD operations built for the Reno internship assignment."
        />
      </Head>

      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 px-6 py-8 shadow-[0_40px_120px_rgba(15,23,42,0.4)] backdrop-blur-2xl sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.4em] text-orange-200/80">Reno Platforms assignment</p>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
                  Notice Board with database-backed CRUD, urgent-first ordering, and a polished operator view.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Create, edit, and delete notices through API routes, persist them with Prisma and MySQL, and keep urgent items visible above normal ones.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 text-center">
                <p className="text-3xl font-semibold text-slate-50">{notices.length}</p>
                <p className="mt-1 text-sm text-slate-300">Active notices</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 text-center">
                <p className="text-3xl font-semibold text-slate-50">API</p>
                <p className="mt-1 text-sm text-slate-300">Server validation</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 text-center">
                <p className="text-3xl font-semibold text-slate-50">MySQL</p>
                <p className="mt-1 text-sm text-slate-300">Persistent storage</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/notices/new"
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
            >
              Create notice
            </Link>
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300">
              Urgent notices are ordered first in the database query.
            </span>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-50">All notices</h2>
              <p className="mt-1 text-sm text-slate-300">Responsive cards with edit and delete actions.</p>
            </div>
          </div>

          {notices.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-slate-950/40 px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-slate-50">No notices yet</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">
                Create the first notice to verify the end-to-end CRUD flow and the urgent-first ordering.
              </p>
              <Link
                href="/notices/new"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-100"
              >
                Add notice
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
