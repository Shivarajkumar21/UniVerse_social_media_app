import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return { email: session.user.email };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  videoUploader: f({ video: { maxFileSize: "64MB" } })
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

  imageUploader: f({ image: { maxFileSize: "16MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),

  // Announcement uploader for all file types
  announcementUploader: f({
    "application/pdf": { maxFileSize: "64MB" },
    "application/pdfs": { maxFileSize: "64MB" },
    "application/msword": { maxFileSize: "64MB" },
    "application/mswords": { maxFileSize: "64MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "64MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.documents": { maxFileSize: "64MB" },
    "application/vnd.ms-excel": { maxFileSize: "64MB" },
    "application/vnd.ms-excels": { maxFileSize: "64MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "64MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheets": { maxFileSize: "64MB" },
    "image": { maxFileSize: "64MB" },
    "images": { maxFileSize: "64MB" },
    "video": { maxFileSize: "64MB" },
    "videos": { maxFileSize: "64MB" },
    "audio": { maxFileSize: "64MB" },
    "audios": { maxFileSize: "64MB" },
    "text": { maxFileSize: "64MB" },
    "texts": { maxFileSize: "64MB" },
    "*": { maxFileSize: "64MB" },
    "*s": { maxFileSize: "64MB" },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Announcement upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),

  // Document uploader for chat messages
  chatDocumentUploader: f({
    "application/pdf": { maxFileSize: "32MB" },
    "application/msword": { maxFileSize: "32MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "32MB" },
    "application/vnd.ms-excel": { maxFileSize: "32MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "32MB" },
    "text/plain": { maxFileSize: "32MB" },
    "application/zip": { maxFileSize: "32MB" },
    "application/x-rar-compressed": { maxFileSize: "32MB" },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userEmail: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Chat document upload complete for user:", metadata.userEmail);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
