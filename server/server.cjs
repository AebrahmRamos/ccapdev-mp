const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const generateSlug = require("../src/utils/slugGenerator").default;
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });
const mongoose = require('mongoose');
const Review = require("./Models/Review.cjs");
const Cafe = require("./Models/Cafe.cjs");

const app = express();
const port = process.env.PORT || 5500;

app.use(cors({ origin: '*' })); // Updated CORS configuration to allow all origins
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Successfully connected to MongoDB"))
.catch((error) => {
  console.error("Error connecting to MongoDB", error);
  process.exit(1);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user; // Add user info to request
    next();
  });
};

async function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
          const newUser = { 
            role,
            firstName,
            lastName,
            email,
            password,
            bio: "Enter your bio here",
            cafeName,
            profilePicture: "https://cdn-icons-png.flaticon.com/512/147/147285.png", // Default profile picture
          };
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
          // Generate a JWT token
          const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Return both token and user data (you can omit sensitive fields like password)
          const userData = { ...user, password: undefined };
          res.status(200).json({ 
            message: "Login successful", 
            token,
            user: userData 
          });
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
        // console.log("Cafes fetched:", cafes);
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

    app.get("/api/users/:id", authenticateToken, async (req, res) => {
      try {
      const id = req.params.id;
      console.log(`Fetching user with ID: ${id}`); // Add logging
      if (!ObjectId.isValid(id)) {
        console.log("Invalid user ID format"); // Add logging
        return res.status(400).json({ message: "Invalid user ID format" });
      }
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
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
      const session = client.startSession(); // Start a new session
      try {
        const { cafeId, userId, rating, textReview, photos, videos } = req.body;
    
        // Validate required fields
        if (!cafeId || !userId || !rating || !textReview) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        // Validate rating format
        const requiredRatingCategories = [
          'ambiance',
          'drinkQuality',
          'service',
          'wifiReliability',
          'cleanliness',
          'valueForMoney',
        ];
        const hasAllRatingCategories = requiredRatingCategories.every(
          (category) =>
            typeof rating[category] === 'number' &&
            rating[category] >= 1 &&
            rating[category] <= 5
        );
    
        if (!hasAllRatingCategories) {
          return res.status(400).json({
            message: "Invalid rating format. All categories must be rated between 1 and 5.",
          });
        }
    
        // Start a transaction
        session.startTransaction();
    
        // Check if a review by the same user for the same cafe already exists
        const existingReview = await reviewsCollection.findOne(
          { cafeId, userId },
          { session }
        );
        if (existingReview) {
          await session.abortTransaction();
          session.endSession();
          return res.status(409).json({ message: "You have already reviewed this cafe." });
        }
    
        // Calculate average rating
        const averageRating =
          Object.values(rating).reduce((sum, val) => sum + val, 0) /
          Object.keys(rating).length;
    
        // Create the new review
        const newReview = {
          cafeId,
          userId,
          rating,
          textReview,
          photos: photos || [],
          videos: videos || [],
          date: new Date(),
        };
    
        // Insert the new review
        const reviewResult = await reviewsCollection.insertOne(newReview, { session });
    
        // Find the cafe and update its review stats
        const cafe = await cafesCollection.findOne(
          { _id: new ObjectId(cafeId) },
          { session }
        );
        if (!cafe) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ message: `Cafe not found, id: ${cafeId}` });
        }
    
        // Update the cafe's review statistics
        const updatedTotalReviews = (cafe.totalReviews || 0) + 1;
    
        // Initialize averageRating if it doesn't exist
        cafe.averageRating = cafe.averageRating || {};
    
        // Update each rating category
        for (const category of requiredRatingCategories) {
          const currentTotal = (cafe.averageRating[category] || 0) * (cafe.totalReviews || 0);
          cafe.averageRating[category] = (currentTotal + rating[category]) / updatedTotalReviews;
        }
    
        // Update overall average
        const currentOverallTotal = (cafe.averageRating.overall || 0) * (cafe.totalReviews || 0);
        cafe.averageRating.overall = (currentOverallTotal + averageRating) / updatedTotalReviews;
    
        // Update the cafe's total reviews and average ratings
        await cafesCollection.updateOne(
          { _id: new ObjectId(cafeId) },
          {
            $set: {
              totalReviews: updatedTotalReviews,
              averageRating: cafe.averageRating,
            },
          },
          { session }
        );
    
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
    
        res.status(201).json({
          message: "Review created successfully",
          review: newReview,
          averageRating: cafe.averageRating,
        });
      } catch (error) {
        // Abort the transaction on error
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
    });

app.get("/api/reviews/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID format" });
    }
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.put("/api/reviews/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updatedData = req.body;
    
    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID format" });
    }
    
    // Validate updated data if needed
    if (updatedData.rating) {
      const requiredRatingCategories = ['ambiance', 'drinkQuality', 'service', 'wifiReliability', 'cleanliness', 'valueForMoney'];
      const hasAllRatingCategories = requiredRatingCategories.every(category => 
        typeof updatedData.rating[category] === 'number' && updatedData.rating[category] >= 1 && updatedData.rating[category] <= 5
      );

      if (!hasAllRatingCategories) {
        return res.status(400).json({ message: "Invalid rating format in update" });
      }
    }
    
    // Find the review first to get the old values
    const oldReview = await Review.findById(reviewId);
    if (!oldReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Update the review
    const result = await Review.findByIdAndUpdate(
      reviewId,
      { $set: updatedData },
      { new: true } // Return the updated document
    );
    
    // If rating was updated, update the cafe's average ratings
    if (updatedData.rating && oldReview.cafeId) {
      const cafe = await Cafe.findById(oldReview.cafeId);
      if (cafe) {
        // Initialize averageRating if it doesn't exist
        cafe.averageRating = cafe.averageRating || {};
        cafe.totalReviews = cafe.totalReviews || 0;
        
        if (cafe.totalReviews > 0) {
          // For each rating category, update the average
          const requiredRatingCategories = ['ambiance', 'drinkQuality', 'service', 'wifiReliability', 'cleanliness', 'valueForMoney'];
          for (const category of requiredRatingCategories) {
            // Remove old rating contribution and add new one
            const totalWithoutOld = (cafe.averageRating[category] || 0) * cafe.totalReviews - (oldReview.rating[category] || 0);
            cafe.averageRating[category] = (totalWithoutOld + updatedData.rating[category]) / cafe.totalReviews;
          }
          
          // Update overall rating
          const newAvg = Object.values(updatedData.rating).reduce((sum, val) => sum + val, 0) / Object.keys(updatedData.rating).length;
          const oldAvg = Object.values(oldReview.rating).reduce((sum, val) => sum + val, 0) / Object.keys(oldReview.rating).length;
          
          const totalOverallWithoutOld = (cafe.averageRating.overall || 0) * cafe.totalReviews - oldAvg;
          cafe.averageRating.overall = (totalOverallWithoutOld + newAvg) / cafe.totalReviews;
          
          await cafe.save();
        }
      }
    }
    
    res.status(200).json({ message: "Review updated successfully", review: result });
  } catch (error) {
    console.error("Error updating review", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    
    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID format" });
    }
    
    // Find the review first to get cafe info
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Delete the review
    const result = await Review.findByIdAndDelete(reviewId);
    
    // Update cafe stats
    if (review.cafeId) {
      const cafe = await Cafe.findById(review.cafeId);
      if (cafe && cafe.totalReviews > 0) {
        // Decrement the total review count
        cafe.totalReviews -= 1;
        
        // If this was the last review, reset averages
        if (cafe.totalReviews === 0) {
          cafe.averageRating = {
            ambiance: 0,
            drinkQuality: 0,
            service: 0,
            wifiReliability: 0,
            cleanliness: 0,
            valueForMoney: 0,
            overall: 0
          };
        } else {
          // Otherwise recalculate averages without this review
          const allCafeReviews = await Review.find({ cafeId: review.cafeId });
          
          // Calculate new averages for each category
          const requiredRatingCategories = ['ambiance', 'drinkQuality', 'service', 'wifiReliability', 'cleanliness', 'valueForMoney'];
          const categoryTotals = {};
          let overallTotal = 0;
          
          // Sum up all ratings
          allCafeReviews.forEach(rev => {
            for (const category of requiredRatingCategories) {
              categoryTotals[category] = (categoryTotals[category] || 0) + (rev.rating[category] || 0);
            }
            
            // Calculate review's overall rating and add to total
            const reviewAvg = Object.values(rev.rating).reduce((sum, val) => sum + val, 0) / Object.keys(rev.rating).length;
            overallTotal += reviewAvg;
          });
          
          // Calculate new averages
          for (const category of requiredRatingCategories) {
            cafe.averageRating[category] = categoryTotals[category] / allCafeReviews.length;
          }
          cafe.averageRating.overall = overallTotal / allCafeReviews.length;
        }
        
        await cafe.save();
      }
    }
    
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.get("/api/reviews/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await reviewsCollection.find({ userId }).toArray();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

app.get("/api/reviews/cafe/:cafeId", async (req, res) => {
  try {
    const cafeId = req.params.cafeId;
    let reviews;
    if (ObjectId.isValid(cafeId)) {
      reviews = await reviewsCollection.find({cafeId}).toArray();
    } else {
      reviews = await reviewsCollection.find({ cafeId: cafeId }).toArray();
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching cafe reviews:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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