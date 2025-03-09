const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const generateSlug = require("../src/utils/slugGenerator").default;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });

const app = express();
const port = process.env.PORT || 5500;

app.use(cors({ origin: "http://localhost:5173" }));
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
    const cafesCollection = db.collection("cafes");
    const reviewsCollection = db.collection("reviews");

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

    // Cafe endpoints
    app.get("/api/cafes", async (req, res) => {
      try {
        const cafes = await cafesCollection.find({}).toArray();
        console.log("Cafes fetched:", cafes);
        res.status(200).json({ cafes });
      } catch (error) {
        console.error("Error fetching cafes", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.get("/api/cafes/search", async (req, res) => {
      const cafeName = req.query.name;
      if (!cafeName) {
        return res.status(400).json({ message: "Cafe name is required" });
      }
      try {
        const cafe = await cafesCollection.findOne({
          cafeName: { $regex: new RegExp(`^${cafeName}$`, "i") },
        });
        if (!cafe) {
          return res.status(404).json({ message: "Cafe not found" });
        }
        res.status(200).json(cafe);
      } catch (error) {
        console.error("Error searching for cafe", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.post("/api/cafes", async (req, res) => {
      try {
        const { cafeName, address, operatingHours, photos, userReviews } = req.body;

        // Generate a slug from the cafe name
        const slug = generateSlug(cafeName);
        const newCafe = {
          cafeName,
          slug, // Store the slug in the database
          address,
          operatingHours,
          photos,
          userReviews,
        };

        const result = await cafesCollection.insertOne(newCafe);
        res.status(201).json({
          message: "Cafe created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error creating cafe:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/api/cafes/:slug", async (req, res) => {
      try {
        const slug = req.params.slug;
        const cafe = await cafesCollection.findOne({ slug });
        if (!cafe) return res.status(404).json({ error: "Cafe not found" });
        res.json(cafe); // Return the cafe directly
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.put("/api/cafes/:slug", async (req, res) => {
      try {
      const slug = req.params.slug;
      const updatedData = req.body;
      // Generate new slug if cafe name is being updated
      if (updatedData.cafeName) {
        updatedData.slug = generateSlug(updatedData.cafeName);
      }
      const result = await cafesCollection.updateOne(
        { slug },
        { $set: updatedData }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Cafe not found" });
      }
      res.status(200).json({ message: "Cafe updated successfully" });
      } catch (error) {
      console.error("Error updating cafe", error);
      res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.delete("/api/cafes/:slug", async (req, res) => {
      try {
      const slug = req.params.slug;
      const result = await cafesCollection.deleteOne({ slug });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Cafe not found" });
      }
      res.status(200).json({ message: "Cafe deleted successfully" });
      } catch (error) {
      console.error("Error deleting cafe", error);
      res.status(500).json({ message: "Internal server error", error });
      }
    });

    // User endpoints
    app.post("/api/users", async (req, res) => {
      try {
        const newUser = req.body;
        const existingUser = await usersCollection.findOne({ email: newUser.email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({
          message: "User created successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error creating user", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.get("/api/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.put("/api/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const updatedData = req.body;
        const result = await usersCollection.updateOne(
          { email },
          { $set: updatedData }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
      } catch (error) {
        console.error("Error updating user", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.delete("/api/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const result = await usersCollection.deleteOne({ email });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    // Review endpoints
    app.post("/api/reviews", async (req, res) => {
      try {
        const { cafeId, userId, rating, textReview, photos, videos } = req.body;

        // Create the new review
        const newReview = new Review({
          cafeId,
          userId,
          rating,
          textReview,
          photos,
          videos,
        });

        // Save the review
        await newReview.save();

        // Find the cafe and update its review stats
        const cafe = await Cafe.findById(cafeId);
        if (!cafe) {
          return res.status(404).json({ message: "Cafe not found" });
        }

        cafe.totalReviews += 1;
        cafe.averageReview = (
          (cafe.averageReview * (cafe.totalReviews - 1) + rating.overall) / cafe.totalReviews);

        await cafe.save();

        res.status(201).json({ message: "Review created successfully", review: newReview });
      } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.get("/api/reviews/:id", async (req, res) => {
      try {
        const reviewId = req.params.id;
        const review = await reviewsCollection.findOne({
          _id: new ObjectId(reviewId),
        });
        if (!review) {
          return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(review);
      } catch (error) {
        console.error("Error fetching review", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.put("/api/reviews/:id", async (req, res) => {
      try {
        const reviewId = req.params.id;
        const updatedData = req.body;
        const result = await reviewsCollection.updateOne(
          { _id: new ObjectId(reviewId) },
          { $set: updatedData }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review updated successfully" });
      } catch (error) {
        console.error("Error updating review", error);
        res.status(500).json({ message: "Internal server error", error });
      }
    });

    app.delete("/api/reviews/:id", async (req, res) => {
      try {
        const reviewId = req.params.id;
        const result = await reviewsCollection.deleteOne({
          _id: new ObjectId(reviewId),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ message: "Review deleted successfully" });
      } catch (error) {
        console.error("Error deleting review", error);
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