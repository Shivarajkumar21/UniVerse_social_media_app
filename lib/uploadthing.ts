// UploadThing config will be handled in the API route and frontend per UploadThing docs.
// This file is intentionally left empty or can export a placeholder if needed.
export {};

import { createUploadthing, type FileRouter } from 'uploadthing/server';

export const uploadThing = createUploadthing({
  secret: process.env.UPLOADTHING_SECRET!,
  token: process.env.UPLOADTHING_TOKEN!,
});

export const announcementFileRouter = {
  announcementFiles: uploadThing.file({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: [
      'image/*',
      'video/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed',
      'text/plain',
      '*/*',
    ],
  }),
} satisfies FileRouter; 