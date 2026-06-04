import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import NoticeForm from "@/components/NoticeForm";

export default function NewNoticePage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create Notice | Notice Board</title>
        <meta name="description" content="Create a new notice for the board." />
      </Head>

      <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-orange-200/80">Notice Board</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">Create notice</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
          >
            Back to board
          </Link>
        </div>

        <NoticeForm
          submitLabel="Create notice"
          onSubmit={async (values) => {
            const response = await fetch("/api/notices", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(payload?.error ?? "Unable to create the notice.");
            }

            await router.push("/");
          }}
        />
      </main>
    </>
  );
}
