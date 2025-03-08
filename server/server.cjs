const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to the database");

    const db = client.db("Cluster0");
    const usersCollection = db.collection("users");

    // Test the connection by listing the databases
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((dbInfo) => console.log(` - ${dbInfo.name}`));

    // Signup route
    app.post("/api/signup", async (req, res) => {
      const { role, firstName, lastName, email, password, cafeName } = req.body;
      console.log(`Signup attempt with email: ${email}`);
      try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          console.log("User already exists:", existingUser);
          res.status(400).json({ message: "User already exists" });
        } else {
          const newUser = { role, firstName, lastName, email, password, cafeName };
          await usersCollection.insertOne(newUser);
          console.log("New user registered:", newUser);
          res.status(201).json({ message: "Signup successful", user: newUser });
        }
      } catch (error) {
        console.error("Error during signup", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    // Login route
    app.post("/api/login", async (req, res) => {
      const { email, password } = req.body;
      console.log(`Login attempt with email: ${email}`);
      try {
        const user = await usersCollection.findOne({ email, password });
        if (user) {
          console.log("User found:", user);
          res.status(200).json({ message: "Login successful", user });
        } else {
          console.log("Invalid email or password");
          res.status(401).json({ message: "Invalid email or password" });
        }
      } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (e) {
    console.error("Error connecting to the database", e);
    process.exit(1);
  }
}

connectToDatabase();