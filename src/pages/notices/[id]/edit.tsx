import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import NoticeForm from "@/components/NoticeForm";
import { prisma } from "@/lib/prisma";
import { serializeNotice, type SerializedNotice } from "@/lib/notices";

type EditNoticePageProps = {
  notice: SerializedNotice;
};

export const getServerSideProps: GetServerSideProps<EditNoticePageProps> = async (context) => {
  const noticeId = context.params?.id;

  if (typeof noticeId !== "string") {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id: noticeId } });

  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: serializeNotice(notice),
    },
  };
};

export default function EditNoticePage({ notice }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Edit Notice | Notice Board</title>
        <meta name="description" content="Edit an existing notice." />
      </Head>

      <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-orange-200/80">Notice Board</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">Edit notice</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
          >
            Back to board
          </Link>
        </div>

        <NoticeForm
          notice={notice}
          submitLabel="Save changes"
          onSubmit={async (values) => {
            const response = await fetch(`/api/notices/${notice.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(payload?.error ?? "Unable to update the notice.");
            }

            await router.push("/");
          }}
        />
      </main>
    </>
  );
}
