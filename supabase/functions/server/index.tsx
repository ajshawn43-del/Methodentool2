import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Health check endpoint
app.get("/make-server-aac39e77/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== LIKES =====
app.get("/make-server-aac39e77/likes/:methodId", async (c) => {
  try {
    const { methodId } = c.req.param();
    const likes = (await kv.get(`likes:${methodId}`)) || 0;
    return c.json({ methodId, likes });
  } catch (error) {
    console.log("Error getting likes:", error);
    return c.json({ error: "Failed to get likes" }, 500);
  }
});

app.post("/make-server-aac39e77/likes/:methodId", async (c) => {
  try {
    const { methodId } = c.req.param();
    const currentLikes = (await kv.get(`likes:${methodId}`)) || 0;
    const newLikes = currentLikes + 1;
    await kv.set(`likes:${methodId}`, newLikes);
    return c.json({ methodId, likes: newLikes });
  } catch (error) {
    console.log("Error adding like:", error);
    return c.json({ error: "Failed to add like" }, 500);
  }
});

app.delete("/make-server-aac39e77/likes/:methodId", async (c) => {
  try {
    const { methodId } = c.req.param();
    const currentLikes = (await kv.get(`likes:${methodId}`)) || 0;
    const newLikes = Math.max(0, currentLikes - 1);
    await kv.set(`likes:${methodId}`, newLikes);
    return c.json({ methodId, likes: newLikes });
  } catch (error) {
    console.log("Error removing like:", error);
    return c.json({ error: "Failed to remove like" }, 500);
  }
});

// ===== COMMENTS =====
app.get("/make-server-aac39e77/comments/:methodId", async (c) => {
  try {
    const { methodId } = c.req.param();
    const comments = (await kv.get(`comments:${methodId}`)) || [];
    return c.json({ methodId, comments });
  } catch (error) {
    console.log("Error getting comments:", error);
    return c.json({ error: "Failed to get comments" }, 500);
  }
});

app.post("/make-server-aac39e77/comments/:methodId", async (c) => {
  try {
    const { methodId } = c.req.param();
    const { username, text } = await c.req.json();

    if (!text || !username) {
      return c.json({ error: "Username and text are required" }, 400);
    }

    const comments = (await kv.get(`comments:${methodId}`)) || [];

    const newComment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      text,
      timestamp: new Date().toISOString(),
    };

    comments.push(newComment);
    await kv.set(`comments:${methodId}`, comments);

    return c.json({ methodId, comments });
  } catch (error) {
    console.log("Error adding comment:", error);
    return c.json({ error: "Failed to add comment" }, 500);
  }
});

// ===== PINS =====
app.get("/make-server-aac39e77/pins/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
    const pins = (await kv.get(`pins:${userId}`)) || [];
    return c.json({ userId, pins });
  } catch (error) {
    console.log("Error getting pins:", error);
    return c.json({ error: "Failed to get pins" }, 500);
  }
});

app.post("/make-server-aac39e77/pins/:userId/:methodId", async (c) => {
  try {
    const { userId, methodId } = c.req.param();
    const pins = (await kv.get(`pins:${userId}`)) || [];

    if (!pins.includes(methodId)) {
      pins.push(methodId);
      await kv.set(`pins:${userId}`, pins);
    }

    return c.json({ userId, pins });
  } catch (error) {
    console.log("Error adding pin:", error);
    return c.json({ error: "Failed to add pin" }, 500);
  }
});

app.delete("/make-server-aac39e77/pins/:userId/:methodId", async (c) => {
  try {
    const { userId, methodId } = c.req.param();
    const pins = (await kv.get(`pins:${userId}`)) || [];
    const filteredPins = pins.filter((id: string) => id !== methodId);

    await kv.set(`pins:${userId}`, filteredPins);

    return c.json({ userId, pins: filteredPins });
  } catch (error) {
    console.log("Error removing pin:", error);
    return c.json({ error: "Failed to remove pin" }, 500);
  }
});

// ===== METHODS =====
app.get("/make-server-aac39e77/methods", async (c) => {
  try {
    const methods = (await kv.get("methods:all")) || [];
    return c.json({ methods });
  } catch (error) {
    console.log("Error getting methods:", error);
    return c.json({ error: "Failed to get methods" }, 500);
  }
});

app.post("/make-server-aac39e77/methods", async (c) => {
  try {
    const method = await c.req.json();

    if (!method.title || !method.description) {
      return c.json({ error: "Title and description are required" }, 400);
    }

    const methods = (await kv.get("methods:all")) || [];

    const newMethod = {
      ...method,
      id: `method-${Date.now()}`,
      createdAt: new Date().toISOString(),
      imageUrl: method.imageUrl || "/grafik-1.png",
      contactPerson: method.contactPerson || {
        name: "Ansprechpartner",
        role: "Methodenexperte",
        email: "kontakt@beispiel.de",
      },
      examples: method.examples || [],
      pdfUrl: method.pdfUrl || null,
    };

    methods.push(newMethod);
    await kv.set("methods:all", methods);

    return c.json({ method: newMethod });
  } catch (error) {
    console.log("Error creating method:", error);
    return c.json({ error: "Failed to create method" }, 500);
  }
});

// ===== UPLOAD PDF =====
app.post("/make-server-aac39e77/upload-pdf", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return c.json({ error: "Only PDF files are supported" }, 400);
    }

    const bucketName = "make-aac39e77-pdfs";

    const { data: buckets, error: bucketListError } =
      await supabase.storage.listBuckets();

    if (bucketListError) {
      console.error("Bucket list error:", bucketListError);
      return c.json({ error: "Failed to check storage buckets" }, 500);
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      const { error: createBucketError } =
        await supabase.storage.createBucket(bucketName, {
          public: false,
        });

      if (createBucketError) {
        console.error("Create bucket error:", createBucketError);
        return c.json({ error: "Failed to create storage bucket" }, 500);
      }
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${safeFileName}`;
    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return c.json({ error: "Failed to upload PDF" }, 500);
    }

    const { data: urlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600 * 24 * 7);

    if (signedUrlError) {
      console.error("Signed URL error:", signedUrlError);
      return c.json({ error: "Failed to create PDF URL" }, 500);
    }

    return c.json({
      success: true,
      fileName: file.name,
      storedFileName: fileName,
      fileUrl: urlData?.signedUrl,
      message: "PDF uploaded successfully.",
    });
  } catch (error) {
    console.log("Error uploading PDF:", error);
    return c.json({ error: "Failed to process PDF upload" }, 500);
  }
});

Deno.serve(app.fetch);
