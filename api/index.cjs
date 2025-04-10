const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });

// Import Mongoose models
const Review = require("./Models/Review.cjs");
const Cafe = require("./Models/Cafe.cjs");
const User = require("./Models/Users.cjs");
const Image = require("./Models/Image.cjs");

// Initialize Express app
const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors({ 
  origin: ['https://coffee-crawl-ccapdev.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Cluster0", // Explicitly specify the database name
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  });

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
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

// Helper function to generate a unique slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return token and user data (excluding password)
    const userData = { ...user.toObject(), password: undefined };
    res
      .status(200)
      .json({ message: "Login successful", token, user: userData });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Signup as Student Endpoint
app.post(
  "/api/signup/student",
  [
    check("firstName").notEmpty().trim(),
    check("lastName").notEmpty().trim(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "Student",
      });

      await newUser.save();
      res
        .status(201)
        .json({ message: "Student signup successful", user: newUser });
    } catch (error) {
      console.error("Error during student signup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Signup as Cafe Owner Endpoint
app.post(
  "/api/signup/cafe-owner",
  [
    check("firstName").notEmpty().trim(),
    check("lastName").notEmpty().trim(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 }),
    check("cafeName").notEmpty().trim(),
    check("address").notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      cafeName,
      address,
      category,
      operatingHours,
    } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "Cafe Owner",
        bio: "Enter your bio here",
        profilePicture: "https://cdn-icons-png.flaticon.com/512/147/147285.png",
        cafeName,
      });

      await newUser.save();

      // Create cafe
      const slug = generateSlug(cafeName);
      const newCafe = new Cafe({
        cafeName,
        slug,
        category: category || "Cafe",
        address,
        operatingHours: operatingHours || {
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        },
        ownerId: newUser._id, // Link cafe to owner
      });

      await newCafe.save();
      res.status(201).json({
        message: "Cafe owner signup successful",
        user: newUser,
        cafe: newCafe,
      });
    } catch (error) {
      console.error("Error during cafe owner signup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// CRUD User Endpoints
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, profilePicture, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, profilePicture, bio },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CRUD Cafe Endpoints

app.get("/api/cafe", authenticateToken, async (req, res) => {
  const ownerId = req.user.userId;

  try {
    const cafe = await Cafe.findOne({ ownerId });
    if (!cafe) {
      return res.status(404).json({ message: "Cafe not found" });
    }

    res.status(200).json({ cafe });
  } catch (error) {
    console.error("Error fetching cafe data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to fetch all cafes
app.get("/api/cafes", async (req, res) => {
  try {
    const cafes = await Cafe.find();
    res.status(200).json(cafes);
  } catch (error) {
    console.error("Error fetching cafes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/cafes/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    const cafe = await Cafe.findOne({ slug });
    if (!cafe) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    res.status(200).json(cafe);
  } catch (error) {
    console.error("Error fetching cafe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/cafes/:slug", authenticateToken, async (req, res) => {
  const slug = req.params.slug;
  const { cafeName, address, category, operatingHours, photos } = req.body;

  try {
    const cafe = await Cafe.findOne({ slug, ownerId: req.user.userId });
    if (!cafe) {
      return res
        .status(404)
        .json({ message: "Cafe not found or unauthorized" });
    }

    if (cafeName) {
      cafe.cafeName = cafeName;
      cafe.slug = generateSlug(cafeName);
    }
    if (address) cafe.address = address;
    if (category) cafe.category = category;
    if (operatingHours) cafe.operatingHours = operatingHours;
    if (photos) cafe.photos = photos;

    await cafe.save();
    res.status(200).json({ message: "Cafe updated successfully", cafe });
  } catch (error) {
    console.error("Error updating cafe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/cafes/:slug", authenticateToken, async (req, res) => {
  const slug = req.params.slug;

  try {
    const cafe = await Cafe.findOneAndDelete({
      slug,
      ownerId: req.user.userId,
    });
    if (!cafe) {
      return res
        .status(404)
        .json({ message: "Cafe not found or unauthorized" });
    }
    res.status(200).json({ message: "Cafe deleted successfully" });
  } catch (error) {
    console.error("Error deleting cafe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/cafes/owner/:ownerId", authenticateToken, async (req, res) => {
  try {
    const cafe = await Cafe.findOne({ ownerId: req.params.ownerId });
    if (!cafe) return res.status(404).json({ message: "Cafe not found" });
    res.json(cafe);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cafe", error });
  }
});

// CRUD Review Endpoints
app.post("/api/reviews", authenticateToken, async (req, res) => {
  const { cafeId, rating, textReview, photos, videos } = req.body;
  const userId = req.user.userId;

  try {
    // Validate rating fields
    const requiredRatingFields = [
      "ambiance",
      "drinkQuality",
      "service",
      "wifiReliability",
      "cleanliness",
      "valueForMoney",
    ];
    for (const field of requiredRatingFields) {
      if (!rating[field] || rating[field] < 1 || rating[field] > 5) {
        return res.status(400).json({ message: `Invalid rating for ${field}` });
      }
    }

    // Validate textReview length
    if (textReview.length < 10 || textReview.length > 1000) {
      return res.status(400).json({
        message: "Text review must be between 10 and 1000 characters",
      });
    }

    const newReview = new Review({
      cafeId,
      userId,
      rating,
      textReview,
      photos: photos || [],
      videos: videos || [],
    });

    await newReview.save();

    const cafe = await Cafe.findOne({ _id: cafeId });
    if (!cafe) {
      return res.status(404).json({ message: `Cafe not found, id: ${cafeId}` });
    }

    const updatedTotalReviews = (cafe.totalReviews || 0) + 1;

    const existingReviews = await Review.find({ cafeId });

    // Calculate the average rating for the new review
    const newReviewAverageRating =
      (rating.ambiance +
        rating.drinkQuality +
        rating.service +
        rating.wifiReliability +
        rating.cleanliness +
        rating.valueForMoney) /
      6;

    let newTotalAverageRating;

    if (existingReviews.length === 0) {
      // If there are no existing reviews, the new total average rating is the new review's average rating
      newTotalAverageRating = newReviewAverageRating;
    } else {
      // Calculate the sum of average ratings of all existing reviews
      const totalAverageRatings = existingReviews.reduce((acc, review) => {
        const reviewAverageRating =
          (review.rating.ambiance +
            review.rating.drinkQuality +
            review.rating.service +
            review.rating.wifiReliability +
            review.rating.cleanliness +
            review.rating.valueForMoney) /
          6;
        return acc + reviewAverageRating;
      }, 0);

      // Calculate the new total average rating
      newTotalAverageRating = totalAverageRatings / updatedTotalReviews;
    }

    newTotalAverageRating = parseFloat(newTotalAverageRating.toFixed(1));

    // Update the cafe's total reviews and average ratings
    await Cafe.updateOne(
      { _id: cafeId },
      {
        $set: {
          totalReviews: updatedTotalReviews,
          averageReview: newTotalAverageRating,
        },
      }
    );

    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
      reviewsCount: updatedTotalReviews,
      totalAverageRating: newTotalAverageRating,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/reviews/cafe/:cafeId", async (req, res) => {
  let cafeId = req.params.cafeId;

  try {
    cafeId = cafeId.trim();
    const reviews = await Review.find({ cafeId: cafeId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by cafe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/reviews/user/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const reviews = await Review.find({ userId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a review
app.put("/api/reviews/:id", authenticateToken, async (req, res) => {
  const reviewId = req.params.id;
  const { textReview, rating } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this review" });
    }

    // Update review fields
    if (textReview) review.textReview = textReview;
    if (rating) review.rating = rating;

    await review.save();

    // Update the cafe's ratings
    const cafeId = review.cafeId;
    const reviews = await Review.find({ cafeId });
    const totalReviews = reviews.length;

    const totalAverageRating =
      reviews.reduce((acc, review) => {
        const reviewAverageRating =
          (review.rating.ambiance +
            review.rating.drinkQuality +
            review.rating.service +
            review.rating.wifiReliability +
            review.rating.cleanliness +
            review.rating.valueForMoney) /
          6;
        return acc + reviewAverageRating;
      }, 0) / totalReviews;

    await Cafe.updateOne(
      { _id: cafeId },
      {
        $set: {
          totalReviews,
          averageReview: parseFloat(totalAverageRating.toFixed(1)),
        },
      }
    );

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/reviews/:id", authenticateToken, async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the cafe's ratings
    const cafeId = review.cafeId;
    const reviews = await Review.find({ cafeId });
    const totalReviews = reviews.length;

    let totalAverageRating = 0;

    if (totalReviews > 0) {
      totalAverageRating =
        reviews.reduce((acc, review) => {
          const reviewAverageRating =
            (review.rating.ambiance +
              review.rating.drinkQuality +
              review.rating.service +
              review.rating.wifiReliability +
              review.rating.cleanliness +
              review.rating.valueForMoney) /
            6;
          return acc + reviewAverageRating;
        }, 0) / totalReviews;
    }

    await Cafe.updateOne(
      { _id: cafeId },
      {
        $set: {
          totalReviews,
          averageReview: parseFloat(totalAverageRating.toFixed(1)),
        },
      }
    );

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/api/reviews/:id/helpful", authenticateToken, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.userId;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const userIndex = review.helpfulVoters.indexOf(userId);
    if (userIndex === -1) {
      // User has not upvoted yet, add their vote
      review.helpfulVotes += 1;
      review.helpfulVoters.push(userId);
    } else {
      // User has already upvoted, remove their vote
      review.helpfulVotes -= 1;
      review.helpfulVoters.splice(userIndex, 1);
    }

    await review.save();

    res.status(200).json({
      message: "Helpful vote toggled",
      helpfulVotes: review.helpfulVotes,
    });
  } catch (error) {
    console.error("Error updating helpful votes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// CRUD Image Endpoints
app.post("/api/upload", async (req, res) => {
  const imageData = req.body.image;
  const imageBuffer = Buffer.from(imageData.data, "base64");

  try {
    const savedImage = await Image.create({
      name: imageData.name,
      type: imageData.type,
      data: imageBuffer,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageId: savedImage._id, // Return the image ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to upload image",
    });
  }
});

// Handle GET request to /api/images/:id
app.get("/api/images/:id", (req, res) => {
  const id = req.params.id;
  Image.findById(id)
    .then((image) => {
      res.setHeader("Content-Type", image.type);
      res.send(image.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error retrieving image");
    });
});

// Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

module.exports = app;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}