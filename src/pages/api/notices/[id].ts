import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { noticeFormSchema, serializeNotice, toNoticeData } from "@/lib/notices";

function extractId(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function sendMethodNotAllowed(response: NextApiResponse) {
  response.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  return response.status(405).json({ error: "Method not allowed" });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const noticeId = extractId(request.query.id);

  if (!noticeId) {
    return response.status(400).json({ error: "A valid notice id is required." });
  }

  if (request.method === "GET") {
    const notice = await prisma.notice.findUnique({ where: { id: noticeId } });

    if (!notice) {
      return response.status(404).json({ error: "Notice not found." });
    }

    return response.status(200).json({ notice: serializeNotice(notice) });
  }

  if (request.method === "PATCH") {
    const parsedBody = noticeFormSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({ error: "Please correct the notice fields and try again.", issues: parsedBody.error.flatten() });
    }

    try {
      const existingNotice = await prisma.notice.findUnique({ where: { id: noticeId } });

      if (!existingNotice) {
        return response.status(404).json({ error: "Notice not found." });
      }

      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: toNoticeData(parsedBody.data),
      });

      return response.status(200).json({ notice: serializeNotice(updatedNotice) });
    } catch (error) {
      return response.status(400).json({ error: error instanceof Error ? error.message : "Unable to update the notice." });
    }
  }

  if (request.method === "DELETE") {
    try {
      const existingNotice = await prisma.notice.findUnique({ where: { id: noticeId } });

      if (!existingNotice) {
        return response.status(404).json({ error: "Notice not found." });
      }

      await prisma.notice.delete({ where: { id: noticeId } });

      return response.status(204).end();
    } catch (error) {
      return response.status(400).json({ error: error instanceof Error ? error.message : "Unable to delete the notice." });
    }
  }

  return sendMethodNotAllowed(response);
}
