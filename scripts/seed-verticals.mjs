/**
 * Seed Script: Creates/updates the 11 HEADYZINE verticals in Sanity
 * Run with: SANITY_TOKEN=<token> node scripts/seed-verticals.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "jr4q53dp",
  dataset: "production",
  apiVersion: "2024-02-25",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function seedVerticals() {
  console.log("🌱 Seeding HEADYZINE verticals...\n");

  // ─── New Verticals ───────────────────────────────────────────
  const verticals = [
    {
      _id: "cat-glutton",
      _type: "category",
      title: "Glutton",
      slug: { _type: "slug", current: "glutton" },
      description: "Food, drinks, cooking culture, restaurant deep-dives",
    },
    {
      _id: "cat-vices",
      _type: "category",
      title: "Vices",
      slug: { _type: "slug", current: "vices" },
      description: "Alcohol, weed, psychedelics, drug culture",
    },
    {
      _id: "cat-a-and-r",
      _type: "category",
      title: "A&R",
      slug: { _type: "slug", current: "a-and-r" },
      description: "New artists, music discovery",
    },
    {
      _id: "cat-quickie",
      _type: "category",
      title: "Quickie",
      slug: { _type: "slug", current: "quickie" },
      description: "Quick news updates on music-related developments",
    },
    {
      _id: "cat-q-and-a",
      _type: "category",
      title: "Q&A",
      slug: { _type: "slug", current: "q-and-a" },
      description: "Easy to digest interviews, raw, unfiltered",
    },
    {
      _id: "cat-sick-sad-world",
      _type: "category",
      title: "Sick Sad World",
      slug: { _type: "slug", current: "sick-sad-world" },
      description: "Strange news, subcultures, internet oddities",
    },
    {
      _id: "cat-canvas",
      _type: "category",
      title: "Canvas",
      slug: { _type: "slug", current: "canvas" },
      description: "Art, design, photography, street culture",
    },
    {
      _id: "cat-far-out",
      _type: "category",
      title: "Far Out",
      slug: { _type: "slug", current: "far-out" },
      description: "Underground travel guides, city culture, hidden spots",
    },
    {
      _id: "cat-love",
      _type: "category",
      title: "Love",
      slug: { _type: "slug", current: "love" },
      description: "Relationships and sex",
    },
    {
      _id: "cat-good-life",
      _type: "category",
      title: "Good Life",
      slug: { _type: "slug", current: "good-life" },
      description: "Mental health, money, wellness",
    },
    {
      _id: "cat-afters",
      _type: "category",
      title: "Afters",
      slug: { _type: "slug", current: "afters" },
      description: "Club culture, parties, DJ culture, after-hours scenes",
    },
  ];

  // ─── Create verticals ────────────────────────────────────────
  console.log("📁 Creating 11 verticals...");
  for (const v of verticals) {
    await client.createOrReplace(v);
    console.log(`  ✅ ${v.title} — ${v.description}`);
  }

  // ─── Reassign existing articles to new verticals ─────────────
  console.log("\n🔄 Reassigning existing articles to new verticals...");

  // Map old category IDs → new vertical IDs
  const reassignments = {
    "cat-music-news": "cat-a-and-r",        // Music News → A&R
    "cat-artist-spotlight": "cat-a-and-r",   // Artist Spotlight → A&R
    "cat-studio-sessions": "cat-a-and-r",    // Studio Sessions → A&R
  };

  // Fetch all articles
  const articles = await client.fetch(`*[_type == "newsArticle"]{ _id, title, category }`);
  
  for (const article of articles) {
    const oldCatRef = article.category?._ref;
    const newCatRef = reassignments[oldCatRef];
    
    if (newCatRef && newCatRef !== oldCatRef) {
      await client
        .patch(article._id)
        .set({ category: { _type: "reference", _ref: newCatRef } })
        .commit();
      console.log(`  ✅ "${article.title}" → ${newCatRef}`);
    }
  }

  // ─── Clean up old categories ─────────────────────────────────
  console.log("\n🗑️  Removing old categories...");
  const oldCatIds = ["cat-music-news", "cat-artist-spotlight", "cat-studio-sessions"];
  for (const id of oldCatIds) {
    try {
      await client.delete(id);
      console.log(`  ✅ Deleted ${id}`);
    } catch (e) {
      console.log(`  ⚠️ Could not delete ${id}: ${e.message}`);
    }
  }

  console.log("\n🎉 Done! 11 verticals created, articles reassigned, old categories removed.");
  console.log("   Visit http://localhost:3000/headyzine to see the updated verticals.");
  console.log("   Visit http://localhost:3000/studio to manage content.");
}

seedVerticals().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
