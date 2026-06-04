import type { Notice } from "@prisma/client";
import { z } from "zod";

export const noticeCategories = ["Exam", "Event", "General"] as const;
export const noticePriorities = ["Normal", "Urgent"] as const;

export type NoticeCategory = (typeof noticeCategories)[number];
export type NoticePriority = (typeof noticePriorities)[number];

export const noticeFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(1, "Body is required"),
  category: z.enum(noticeCategories),
  priority: z.enum(noticePriorities),
  publishDate: z.string().trim().min(1, "Publish date is required"),
  image: z.string().trim().max(100000).nullable().optional(),
});

export type NoticeFormInput = z.infer<typeof noticeFormSchema>;

export type SerializedNotice = Omit<Notice, "publishDate" | "createdAt" | "updatedAt"> & {
  publishDate: string;
  createdAt: string;
  updatedAt: string;
};

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function isValidPublishDate(value: string) {
  if (!dateOnlyPattern.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
}

export function toNoticeData(input: NoticeFormInput) {
  if (!isValidPublishDate(input.publishDate)) {
    throw new Error("Publish date must be a valid calendar date.");
  }

  const image = input.image?.trim();

  if (image && !/^https?:\/\//i.test(image) && !image.startsWith("data:image/")) {
    throw new Error("Image must be a valid http(s) URL or an uploaded image data URL.");
  }

  return {
    title: input.title.trim(),
    body: input.body.trim(),
    category: input.category,
    priority: input.priority,
    publishDate: new Date(`${input.publishDate}T00:00:00.000Z`),
    image: image || null,
  };
}

export function serializeNotice(notice: Notice): SerializedNotice {
  return {
    ...notice,
    publishDate: notice.publishDate.toISOString(),
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString(),
  };
}

export function serializeNotices(notices: Notice[]) {
  return notices.map(serializeNotice);
}

export function formatNoticeDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function makeInitialNoticeFormValues() {
  const today = new Date().toISOString().slice(0, 10);

  return {
    title: "",
    body: "",
    category: "General" as NoticeCategory,
    priority: "Normal" as NoticePriority,
    publishDate: today,
    image: null as string | null,
  };
}
