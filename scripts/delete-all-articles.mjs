import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "jr4q53dp",
  dataset: "production",
  apiVersion: "2024-02-25",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function deleteAllArticles() {
  console.log("🗑️ Deleting all articles...");
  try {
    const articles = await client.fetch(`*[_type == "newsArticle"]{_id}`);
    if (articles.length === 0) {
      console.log("No articles found to delete.");
      return;
    }
    
    console.log(`Found ${articles.length} articles to delete.`);
    
    for (const article of articles) {
      await client.delete(article._id);
      console.log(`✅ Deleted ${article._id}`);
    }
    
    console.log("🎉 All articles deleted successfully!");
  } catch (error) {
    console.error("❌ Failed to delete articles:", error);
  }
}

deleteAllArticles().catch(console.error);
