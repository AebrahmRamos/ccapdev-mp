import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";
import "@fontsource/glegoo";
import "@fontsource/cantata-one";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

const CtaSection = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Box>
      <Typography
        sx={{
          textTransform: "uppercase",
          fontWeight: "medium",
          fontFamily: "Glegoo, serif",
        }}
        gutterBottom
        color={"text.secondary"}
      >
        DLSU COFFEE CRAWL
      </Typography>
      <Box marginBottom={3}>
        <Typography
          variant="h2"
          color="text.primary"
          sx={{
            fontWeight: 700,
            fontFamily: "Cantata One, serif",
          }}
        >
          Cafe Spaces{" "}
          <Typography
            color={"primary"}
            component={"span"}
            variant={"inherit"}
            sx={{
              color: "#4a3b2a",
              background: `linear-gradient(180deg, transparent 82%, ${alpha(
                "#4a3b2a",
                0.3
              )} 0%)`,
              fontFamily: "Cantata One, serif",
              fontSize: { xs: "3rem", md: "3.7rem" },
            }}
          >
            Reimagined
          </Typography>
        </Typography>
      </Box>
      <Box marginBottom={3}>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{
            fontFamily: "Glegoo, serif",
          }}
        >
          DLSU Coffee Crawl is dedicated to helping students, faculty, and
          coffee enthusiasts discover the best coffee spots around De La Salle
          University. We believe that great coffee enhances productivity and
          creates memorable experiences.
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretched", sm: "flex-start" }}
        justifyContent="center"
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4a3b2a",
            "&:hover": {
              backgroundColor: "#3b2e22",
            },
            fontFamily: "Glegoo, serif",
          }}
          size="large"
          fullWidth={isMd ? false : true}
        >
          <Link to="/signup" className="cta-button">
            Sign up
          </Link>
        </Button>
        <Box
          component={Button}
          variant="outlined"
          sx={{
            borderColor: "#4a3b2a",
            color: "#4a3b2a",
            fontFamily: "Glegoo, serif",
            "&:hover": {
              borderColor: "#3b2e22",
              color: "#3b2e22",
            },
          }}
          size="large"
          marginTop={{ xs: 2, sm: 0 }}
          marginLeft={{ sm: 2 }}
          fullWidth={isMd ? false : true}
        >
          <Link to="/cafes">Browse spaces</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default CtaSection;
