import { createFileRoute } from "@tanstack/react-router";
import { db } from "../server/db";

export const Route = createFileRoute("/api/banners/$slug")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);

        try {
          let base64Data = await db.getSetting(`banner_image:${slug}`);

          // Fallback to local files if setting is not in the database (e.g. local dev server restart)
          if (!base64Data) {
            try {
              const fs = await import("fs");
              const path = await import("path");
              const uploadDir = path.resolve(process.cwd(), "public/uploads/banners");
              let localFilePath = path.join(uploadDir, `${slug}.jpg`);
              if (!fs.existsSync(localFilePath)) {
                localFilePath = path.join(uploadDir, `${slug}.png`);
              }
              if (!fs.existsSync(localFilePath)) {
                localFilePath = path.join(uploadDir, `${slug}`);
              }

              if (fs.existsSync(localFilePath)) {
                const buffer = fs.readFileSync(localFilePath);
                const ext = path.extname(localFilePath).toLowerCase();
                const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
                base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;
              }
            } catch (fsErr) {
              console.warn("Local filesystem fallback check failed:", fsErr);
            }
          }

          if (!base64Data) {
            return new Response("Not Found", { status: 404 });
          }

          // Parse base64 content
          const parts = base64Data.split(",");
          const contentType = parts.length > 1 ? parts[0].split(";")[0].split(":")[1] : "image/jpeg";
          const base64Str = parts.length > 1 ? parts[1] : parts[0];

          const { Buffer } = await import("buffer");
          const buffer = Buffer.from(base64Str, "base64");

          return new Response(buffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (e) {
          console.error("Failed to serve banner image:", e);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
