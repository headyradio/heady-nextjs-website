/**
 * Seed Script: Creates test content in Sanity for HEADYZINE
 * Run with: node scripts/seed-sanity.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const client = createClient({
  projectId: "jr4q53dp",
  dataset: "production",
  apiVersion: "2024-02-25",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// Upload an image file to Sanity
async function uploadImage(filePath, filename) {
  const buffer = readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/png",
  });
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

async function seed() {
  console.log("🌱 Seeding Sanity with test content...\n");

  // 1. Create Categories
  console.log("📁 Creating categories...");
  const categories = [
    { _id: "cat-music-news", _type: "category", title: "Music News", slug: { _type: "slug", current: "music-news" }, description: "Latest news from the music world" },
    { _id: "cat-artist-spotlight", _type: "category", title: "Artist Spotlight", slug: { _type: "slug", current: "artist-spotlight" }, description: "Deep dives into the artists we love" },
    { _id: "cat-studio-sessions", _type: "category", title: "Studio Sessions", slug: { _type: "slug", current: "studio-sessions" }, description: "Behind the scenes in the studio" },
  ];

  for (const cat of categories) {
    await client.createOrReplace(cat);
    console.log(`  ✅ ${cat.title}`);
  }

  // 2. Create Tags
  console.log("\n🏷️ Creating tags...");
  const tags = [
    { _id: "tag-indie-rock", _type: "tag", title: "Indie Rock", slug: { _type: "slug", current: "indie-rock" } },
    { _id: "tag-underground", _type: "tag", title: "Underground", slug: { _type: "slug", current: "underground" } },
    { _id: "tag-vinyl", _type: "tag", title: "Vinyl", slug: { _type: "slug", current: "vinyl" } },
    { _id: "tag-live-music", _type: "tag", title: "Live Music", slug: { _type: "slug", current: "live-music" } },
    { _id: "tag-interviews", _type: "tag", title: "Interviews", slug: { _type: "slug", current: "interviews" } },
  ];

  for (const tag of tags) {
    await client.createOrReplace(tag);
    console.log(`  ✅ ${tag.title}`);
  }

  // 3. Create Author
  console.log("\n✍️ Creating author...");
  const author = {
    _id: "author-heady-editorial",
    _type: "author",
    name: "HEADY Editorial",
    slug: { _type: "slug", current: "heady-editorial" },
    bio: "The HEADY.FM editorial team brings you the latest stories, interviews, and deep dives from the world of underground and indie music.",
  };
  await client.createOrReplace(author);
  console.log(`  ✅ ${author.name}`);

  // 4. Upload images
  console.log("\n🖼️ Uploading images...");
  const brainDir = resolve(process.cwd(), "../.gemini/antigravity/brain/7af46204-f13c-4726-933d-84dea0267974");

  let img1, img2, img3;
  try {
    img1 = await uploadImage(
      resolve(brainDir, "article_hero_1_1772064771672.png"),
      "concert-hero.png"
    );
    console.log("  ✅ Concert image uploaded");
  } catch (e) {
    console.log("  ⚠️ Concert image upload failed, using placeholder");
    img1 = null;
  }

  try {
    img2 = await uploadImage(
      resolve(brainDir, "article_hero_2_1772064884644.png"),
      "vinyl-hero.png"
    );
    console.log("  ✅ Vinyl image uploaded");
  } catch (e) {
    console.log("  ⚠️ Vinyl image upload failed, using placeholder");
    img2 = null;
  }

  try {
    img3 = await uploadImage(
      resolve(brainDir, "article_hero_3_1772065007265.png"),
      "studio-hero.png"
    );
    console.log("  ✅ Studio image uploaded");
  } catch (e) {
    console.log("  ⚠️ Studio image upload failed, using placeholder");
    img3 = null;
  }

  // 5. Create Articles
  console.log("\n📝 Creating articles...");

  const articles = [
    {
      _id: "article-underground-scene-2026",
      _type: "newsArticle",
      title: "The Rise of the Underground: How Indie Rock is Reclaiming the Airwaves",
      slug: { _type: "slug", current: "rise-of-the-underground-indie-rock-2026" },
      excerpt: "From basement shows to global streams, indie rock is experiencing a renaissance that's reshaping the music industry. We explore the artists, venues, and communities driving this movement.",
      publishedAt: "2026-02-24T18:00:00Z",
      author: { _type: "reference", _ref: "author-heady-editorial" },
      category: { _type: "reference", _ref: "cat-music-news" },
      featuredImage: img1 ? { ...img1, alt: "Indie rock band performing at an intimate venue with purple and green lighting" } : undefined,
      tags: [
        { _type: "reference", _ref: "tag-indie-rock", _key: "t1" },
        { _type: "reference", _ref: "tag-underground", _key: "t2" },
        { _type: "reference", _ref: "tag-live-music", _key: "t3" },
      ],
      readingTime: 6,
      body: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "The underground music scene is alive and thriving. In basements, warehouses, and small clubs across the world, a new generation of indie rock artists are creating music that defies mainstream conventions and speaks to something deeper in the human experience." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "A New Wave of Sound" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "What makes this moment different from previous indie explosions is the sheer diversity of sound. Artists are no longer confined to the jangly guitar-driven formula that defined earlier waves of indie rock. Instead, they're incorporating elements from post-punk, shoegaze, electronic music, and even jazz into their compositions." }] },
        { _type: "block", _key: "b4", style: "blockquote", children: [{ _type: "span", _key: "s4", text: "\"The best music right now isn't coming from major labels — it's coming from artists who are willing to take risks and create something genuinely new.\" — HEADY.FM Curator" }] },
        { _type: "block", _key: "b5", style: "h2", children: [{ _type: "span", _key: "s5", text: "The Venue Renaissance" }] },
        { _type: "block", _key: "b6", style: "normal", children: [{ _type: "span", _key: "s6", text: "Small venues are becoming the heartbeat of this movement. Places like Brooklyn's Baby's All Right, London's Windmill Brixton, and Melbourne's The Tote are cultivating communities where new acts can develop their sound in front of engaged, supportive audiences." }] },
        { _type: "block", _key: "b7", style: "h2", children: [{ _type: "span", _key: "s7", text: "What HEADY.FM Is Doing" }] },
        { _type: "block", _key: "b8", style: "normal", children: [{ _type: "span", _key: "s8", text: "At HEADY.FM, we're committed to amplifying these voices. Our playlist is carefully curated to showcase the best of the underground, from established acts pushing boundaries to brand-new artists just getting started. We believe that the future of rock music is being written right now, in the spaces between the mainstream." }] },
        { _type: "block", _key: "b9", style: "h2", children: [{ _type: "span", _key: "s9", text: "The Bottom Line" }] },
        { _type: "block", _key: "b10", style: "normal", children: [{ _type: "span", _key: "s10", text: "The underground isn't underground anymore — it's simply where the best music lives. And if you're tuned in to HEADY.FM, you're already part of the movement. Keep listening, keep discovering, and keep supporting the artists who refuse to compromise." }] },
      ],
      seo: {
        metaTitle: "The Rise of the Underground: Indie Rock's 2026 Renaissance",
        metaDescription: "How indie rock is reclaiming the airwaves in 2026, from basement shows to global streams.",
      },
    },
    {
      _id: "article-vinyl-revival",
      _type: "newsArticle",
      title: "Why Vinyl Still Matters: The Analog Experience in a Digital World",
      slug: { _type: "slug", current: "why-vinyl-still-matters-analog-digital" },
      excerpt: "In an age of endless streaming, vinyl sales continue to climb. We dive into why physical media retains its magic and how it's shaping how we listen to music.",
      publishedAt: "2026-02-22T12:00:00Z",
      author: { _type: "reference", _ref: "author-heady-editorial" },
      category: { _type: "reference", _ref: "cat-artist-spotlight" },
      featuredImage: img2 ? { ...img2, alt: "Vintage turntable spinning a vinyl record in warm ambient lighting" } : undefined,
      tags: [
        { _type: "reference", _ref: "tag-vinyl", _key: "t1" },
        { _type: "reference", _ref: "tag-indie-rock", _key: "t2" },
      ],
      readingTime: 4,
      body: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "There's something about the ritual of playing a vinyl record that digital streaming can never replicate. The careful selection of an album, the gentle placement of the needle, the warm crackle before the music begins — these are experiences that transcend mere audio playback." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "The Numbers Tell a Story" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Vinyl sales have been climbing steadily for over 15 years. In 2025, vinyl record sales in the US topped $1.5 billion for the first time, making up nearly 10% of all music revenue. This isn't just nostalgia — it's a genuine cultural shift in how people value music." }] },
        { _type: "block", _key: "b4", style: "h2", children: [{ _type: "span", _key: "s4", text: "Why Listeners Choose Vinyl" }] },
        { _type: "block", _key: "b5", style: "normal", children: [{ _type: "span", _key: "s5", text: "For many, vinyl represents intentionality. In a world where algorithms dictate what we hear next, choosing to play a record is an act of agency. It forces you to engage with an album as a complete work of art, the way the artist intended." }] },
        { _type: "block", _key: "b6", style: "blockquote", children: [{ _type: "span", _key: "s6", text: "\"When you put on a record, you're making a commitment to listen. That changes everything about the experience.\"" }] },
        { _type: "block", _key: "b7", style: "h2", children: [{ _type: "span", _key: "s7", text: "The Sound Debate" }] },
        { _type: "block", _key: "b8", style: "normal", children: [{ _type: "span", _key: "s8", text: "Whether vinyl actually sounds 'better' than digital is a debate that will never be settled. But what's undeniable is that vinyl sounds different. The warmth, the subtle imperfections, the physical resonance — these qualities create an emotional connection that pristine digital audio sometimes lacks." }] },
      ],
      seo: {
        metaTitle: "Why Vinyl Still Matters in 2026",
        metaDescription: "Exploring the enduring appeal of vinyl records in the streaming age.",
      },
    },
    {
      _id: "article-behind-the-mix",
      _type: "newsArticle",
      title: "Behind the Mix: Inside the Studios Shaping Tomorrow's Sound",
      slug: { _type: "slug", current: "behind-the-mix-studios-shaping-tomorrows-sound" },
      excerpt: "We go behind the scenes at three studios where the next wave of indie music is being crafted, exploring the creative processes and technologies that are redefining what's possible.",
      publishedAt: "2026-02-20T15:30:00Z",
      author: { _type: "reference", _ref: "author-heady-editorial" },
      category: { _type: "reference", _ref: "cat-studio-sessions" },
      featuredImage: img3 ? { ...img3, alt: "Recording studio mixing console with LED meters and glowing faders" } : undefined,
      tags: [
        { _type: "reference", _ref: "tag-interviews", _key: "t1" },
        { _type: "reference", _ref: "tag-underground", _key: "t2" },
      ],
      readingTime: 8,
      body: [
        { _type: "block", _key: "b1", style: "normal", children: [{ _type: "span", _key: "s1", text: "Every great record starts in a room. Whether it's a state-of-the-art facility or a converted bedroom, the studio is where ideas become songs and songs become albums. We visited three studios that are at the forefront of indie music production to understand what makes them tick." }] },
        { _type: "block", _key: "b2", style: "h2", children: [{ _type: "span", _key: "s2", text: "Echo Chamber Studios, Brooklyn" }] },
        { _type: "block", _key: "b3", style: "normal", children: [{ _type: "span", _key: "s3", text: "Tucked away in a Bushwick warehouse, Echo Chamber Studios has become a go-to destination for artists seeking a sound that bridges analog warmth with digital precision. The studio's centerpiece is a vintage Neve 8068 console that's been lovingly maintained since the 1970s." }] },
        { _type: "block", _key: "b4", style: "blockquote", children: [{ _type: "span", _key: "s4", text: "\"We don't force artists into a box. The best recordings happen when people feel free to experiment.\" — Studio owner" }] },
        { _type: "block", _key: "b5", style: "h2", children: [{ _type: "span", _key: "s5", text: "The Analog vs. Digital Divide" }] },
        { _type: "block", _key: "b6", style: "normal", children: [{ _type: "span", _key: "s6", text: "One thing all three studios shared was a rejection of the either/or mentality when it comes to analog and digital recording. Modern indie producers are increasingly hybrid in their approach, tracking to tape for warmth but editing in the digital domain for precision." }] },
        { _type: "block", _key: "b7", style: "h2", children: [{ _type: "span", _key: "s7", text: "The Future of Studio Recording" }] },
        { _type: "block", _key: "b8", style: "normal", children: [{ _type: "span", _key: "s8", text: "As technology continues to evolve, the role of the physical studio is changing. But these three spaces prove that the human element — the engineer's ear, the producer's vision, the artist's vulnerability — remains irreplaceable. The future of indie music is being forged in rooms just like these." }] },
      ],
      seo: {
        metaTitle: "Behind the Mix: Studios Shaping Tomorrow's Indie Sound",
        metaDescription: "Go behind the scenes at three studios where the next wave of indie music is being crafted.",
      },
    },
  ];

  for (const article of articles) {
    // Remove undefined featuredImage
    const cleanArticle = Object.fromEntries(
      Object.entries(article).filter(([_, v]) => v !== undefined)
    );
    await client.createOrReplace(cleanArticle);
    console.log(`  ✅ "${article.title}"`);
  }

  console.log("\n🎉 Seed complete! 3 categories, 5 tags, 1 author, 3 articles created.");
  console.log("   Visit http://localhost:3000/headyzine to see the articles.");
  console.log("   Visit http://localhost:3000/studio to manage content.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
