/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import {
  makeInitialNoticeFormValues,
  noticeCategories,
  noticePriorities,
  type NoticeCategory,
  type NoticePriority,
  type SerializedNotice,
} from "@/lib/notices";

export type NoticeFormValues = {
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: string;
  image: string | null;
};

type NoticeFormProps = {
  initialValues?: NoticeFormValues;
  submitLabel: string;
  onSubmit: (values: NoticeFormValues) => Promise<void>;
  notice?: SerializedNotice;
};

function valuesFromNotice(notice: SerializedNotice): NoticeFormValues {
  return {
    title: notice.title,
    body: notice.body,
    category: notice.category,
    priority: notice.priority,
    publishDate: notice.publishDate.slice(0, 10),
    image: notice.image,
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read the selected image."));
    };

    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function NoticeForm({ initialValues, submitLabel, onSubmit, notice }: NoticeFormProps) {
  const [values, setValues] = useState<NoticeFormValues>(
    initialValues ?? (notice ? valuesFromNotice(notice) : makeInitialNoticeFormValues()),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = <Key extends keyof NoticeFormValues>(field: Key, value: NoticeFormValues[Key]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.");
      event.target.value = "";
      return;
    }

    setErrorMessage(null);
    const dataUrl = await readFileAsDataUrl(selectedFile);
    updateField("image", dataUrl);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await onSubmit(values);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-white/8 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Title</span>
          <input
            required
            maxLength={200}
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            placeholder="Add a clear notice title"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Body</span>
          <textarea
            required
            rows={7}
            value={values.body}
            onChange={(event) => updateField("body", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
            placeholder="Write the full notice here"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Category</span>
          <select
            value={values.category}
            onChange={(event) => updateField("category", event.target.value as NoticeCategory)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
          >
            {noticeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Priority</span>
          <select
            value={values.priority}
            onChange={(event) => updateField("priority", event.target.value as NoticePriority)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
          >
            {noticePriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Publish date</span>
          <input
            required
            type="date"
            value={values.publishDate}
            onChange={(event) => updateField("publishDate", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-white/30"
          />
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span>Optional. Upload an image or leave this blank.</span>
            {values.image ? (
              <button
                type="button"
                onClick={() => updateField("image", null)}
                className="rounded-full border border-white/15 px-3 py-1.5 font-medium text-slate-100 transition hover:border-red-300 hover:text-red-200"
              >
                Remove image
              </button>
            ) : null}
          </div>
          {values.image ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
              <img src={values.image} alt="Selected notice image preview" className="h-48 w-full object-cover" />
            </div>
          ) : null}
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
