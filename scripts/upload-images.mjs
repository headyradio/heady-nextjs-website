/**
 * Upload images to Sanity and update articles
 * Run with: node scripts/upload-images.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const client = createClient({
  projectId: "jr4q53dp",
  dataset: "production",
  apiVersion: "2024-02-25",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const images = [
  {
    path: "/Users/johan/.gemini/antigravity/brain/7af46204-f13c-4726-933d-84dea0267974/article_hero_1_1772064771672.png",
    filename: "concert-hero.png",
    articleId: "article-underground-scene-2026",
    alt: "Indie rock band performing at an intimate venue with purple and green lighting",
  },
  {
    path: "/Users/johan/.gemini/antigravity/brain/7af46204-f13c-4726-933d-84dea0267974/article_hero_2_1772064884644.png",
    filename: "vinyl-hero.png",
    articleId: "article-vinyl-revival",
    alt: "Vintage turntable spinning a vinyl record in warm ambient lighting",
  },
  {
    path: "/Users/johan/.gemini/antigravity/brain/7af46204-f13c-4726-933d-84dea0267974/article_hero_3_1772065007265.png",
    filename: "studio-hero.png",
    articleId: "article-behind-the-mix",
    alt: "Recording studio mixing console with LED meters and glowing faders",
  },
];

async function run() {
  console.log("🖼️ Uploading images and patching articles...\n");

  for (const img of images) {
    try {
      const buffer = readFileSync(img.path);
      console.log(`  📤 Uploading ${img.filename} (${(buffer.length / 1024).toFixed(0)} KB)...`);

      const asset = await client.assets.upload("image", buffer, {
        filename: img.filename,
        contentType: "image/png",
      });

      console.log(`  ✅ Uploaded: ${asset._id}`);

      await client.patch(img.articleId).set({
        featuredImage: {
          _type: "image",
          alt: img.alt,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
      }).commit();

      console.log(`  ✅ Patched article ${img.articleId}\n`);
    } catch (err) {
      console.error(`  ❌ Failed for ${img.filename}:`, err.message);
    }
  }

  console.log("🎉 Done! Images uploaded and articles updated.");
}

run().catch(console.error);
