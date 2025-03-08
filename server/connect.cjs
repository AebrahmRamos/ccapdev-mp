const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

async function main() {
  const Db = process.env.ATLAS_URI;
  const client = new MongoClient(Db);


  try {
    await client.connect();
    console.log("Successfully connected to the database");

    // List the databases to verify the connection
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    for (const dbInfo of databasesList.databases) {
      console.log(` - ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      collections.forEach((collection) =>
        console.log(`   - ${collection.name}`)
      );
    }
  } catch (e) {
    console.error("Error connecting to the database", e);
  } finally {
    await client.close();
  }
}

main();
