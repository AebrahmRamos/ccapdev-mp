import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Container from "./Container";
import axios from "axios";

const TrendingCafes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [trendingCafes, setTrendingCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCafes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5500/api/cafes");
        const cafes = response.data;

        // Calculate trending cafes based on review metrics
        const processed = cafes
          .map((cafe) => ({
            ...cafe,
            trendingScore: (cafe.totalReviews || 0) * (cafe.averageReview || 0),
          }))
          .sort((a, b) => b.trendingScore - a.trendingScore)
          .slice(0, 6); // Take top 6

        setTrendingCafes(processed);
      } catch (error) {
        console.error("Error fetching cafes:", error);
        setError("Failed to load trending cafes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCafes();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/images/default-cafe-image.jpg";
    if (image.startsWith("http") || image.startsWith("data:image")) return image;
    return `http://localhost:5500/api/images/${image}`;
  };

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Typography>Loading trending cafes...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        marginBottom={3}
      >
        <Box textAlign={{ xs: "left", sm: "left" }}>
          <Typography fontWeight={700} variant={"h6"} gutterBottom>
            Popular Cafes
          </Typography>
          <Typography color={"text.secondary"}>
            Most reviewed and highest rated cafes
          </Typography>
        </Box>
        <Box display="flex" marginTop={{ xs: 2, md: 0 }}>
          <Box
            component={Button}
            variant="outlined"
            size="large"
            marginLeft={1}
            sx={{
              backgroundColor: "transparent",
              borderColor: "#4a3b2a",
              color: "#4a3b2a",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: "#3b2e22",
                color: "black",
              },
            }}
            onClick={() => navigate("/cafe")} // Navigate to /cafe on click
          >
            View all
          </Box>
        </Box>
      </Box>
      <Grid container spacing={4}>
        {trendingCafes.map((cafe) => (
          <Grid item xs={12} sm={6} md={4} key={cafe._id}>
            <Box
              component={"a"}
              href={`/cafe/${cafe.slug}`}
              display={"block"}
              width={1}
              height={1}
              sx={{
                textDecoration: "none",
                transition: "all .2s ease-in-out",
                "&:hover": {
                  transform: `translateY(-${theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box
                component={Card}
                width={1}
                height={1}
                boxShadow={4}
                display={"flex"}
                flexDirection={"column"}
                sx={{ backgroundImage: "none" }}
              >
                <CardMedia
                  image={getImageUrl(cafe.photos?.[0])} // Use the first photo or a default image
                  title={cafe.cafeName}
                  sx={{
                    height: { xs: 200, md: 260 },
                    position: "relative",
                  }}
                />
                <Box component={CardContent} position={"relative"}>
                  <Typography variant={"h6"} gutterBottom>
                    {cafe.cafeName}
                  </Typography>
                  <Typography color="text.secondary">{cafe.address}</Typography>
                  <Box mt={1}>
                    <Typography variant="body2">
                      ⭐ {cafe.averageReview?.toFixed(1) || "N/A"} (
                      {cafe.totalReviews || 0} reviews)
                    </Typography>
                  </Box>
                </Box>
                <Box flexGrow={1} />
                <Box padding={2} display={"flex"} flexDirection={"column"}></Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrendingCafes;