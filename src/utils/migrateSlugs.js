// migrateSlugs.js
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();

// Function to generate a URL-friendly slug
function generateSlug(cafeName) {
  return cafeName
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

async function migrateSlugs() {
  const uri = process.env.ATLAS_URI; // MongoDB connection URI
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db("Cluster0"); // Replace with your database name
    const cafesCollection = db.collection("cafes"); // Replace with your collection name

    // Fetch all cafes
    const cafes = await cafesCollection.find({}).toArray();
    console.log(`Found ${cafes.length} cafes`);

    // Update each cafe with a slug
    for (const cafe of cafes) {
      const slug = generateSlug(cafe.cafeName);

      // Update the cafe with the generated slug
      await cafesCollection.updateOne(
        { _id: cafe._id },
        { $set: { slug } }
      );

      console.log(`Updated cafe: ${cafe.cafeName} with slug: ${slug}`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await client.close();
    console.log("Disconnected from the database");
  }
}

// Run the migration
migrateSlugs();