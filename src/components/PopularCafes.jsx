import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Container from "./Container";

const TrendingCafes = () => {
  const theme = useTheme();
  const [trendingCafes, setTrendingCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCafes = async () => {
      try {
        const response = await fetch("http://localhost:5500/api/cafes");
        if (!response.ok) {
          throw new Error("Failed to fetch cafes");
        }
        const cafes = await response.json();

        // Calculate trending cafes based on review metrics
        const processed = cafes
          .map((cafe) => ({
            ...cafe,
            trendingScore: cafe.totalReviews * cafe.averageReview,
          }))
          .sort((a, b) => b.trendingScore - a.trendingScore)
          .slice(0, 3); // Take top 3

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

  if (error) return <div>{error}</div>;
  if (loading) return <div>Loading trending cafes...</div>;

  return (
    <Container>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        marginBottom={3}
      >
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
          >
            View all
          </Box>
        </Box>
        <Box textAlign={{ xs: "left", sm: "right" }}>
          <Typography fontWeight={700} variant={"h6"} gutterBottom>
            Popular Cafes
          </Typography>
          <Typography color={"text.secondary"}>
            Most reviewed and highest rated cafes
          </Typography>
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
                  image={
                    cafe.photos && cafe.photos.length > 0
                      ? cafe.photos[0]
                      : "https://via.placeholder.com/300"
                  } // Fallback image
                  title={cafe.cafeName}
                  sx={{
                    height: { xs: 200, md: 260 },
                    position: "relative",
                  }}
                >
                  {/* Keep your SVG overlay */}
                </CardMedia>
                <Box component={CardContent} position={"relative"}>
                  <Typography variant={"h6"} gutterBottom>
                    {cafe.cafeName}
                  </Typography>
                  <Typography color="text.secondary">{cafe.address}</Typography>
                  <Box mt={1}>
                    <Typography variant="body2">
                      ⭐ {cafe.averageReview} ({cafe.totalReviews} reviews)
                    </Typography>
                  </Box>
                </Box>
                <Box flexGrow={1} />
                <Box padding={2} display={"flex"} flexDirection={"column"}>
                  <Box marginBottom={2}>
                    <Divider />
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography color={"text.secondary"}>
                      {cafe.category}
                    </Typography>
                    <Typography color={"text.secondary"}>
                      {cafe.operatingHours.Monday}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrendingCafes;