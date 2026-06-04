import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { noticeFormSchema, serializeNotice, serializeNotices, toNoticeData } from "@/lib/notices";

function sendMethodNotAllowed(response: NextApiResponse) {
  response.setHeader("Allow", ["GET", "POST"]);
  return response.status(405).json({ error: "Method not allowed" });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: "desc" }, { publishDate: "desc" }, { createdAt: "desc" }],
    });

    return response.status(200).json({ notices: serializeNotices(notices) });
  }

  if (request.method === "POST") {
    const parsedBody = noticeFormSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({ error: "Please correct the notice fields and try again.", issues: parsedBody.error.flatten() });
    }

    try {
      const createdNotice = await prisma.notice.create({
        data: toNoticeData(parsedBody.data),
      });

      return response.status(201).json({ notice: serializeNotice(createdNotice) });
    } catch (error) {
      return response.status(400).json({ error: error instanceof Error ? error.message : "Unable to create the notice." });
    }
  }

  return sendMethodNotAllowed(response);
}
