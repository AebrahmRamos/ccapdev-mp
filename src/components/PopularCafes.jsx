import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";

import Container from "./Container";

// Temporary image locations
import cafe1 from "../images/cafe1.jpg";
import cafe2 from "../images/cafe2.jpg";
import cafe3 from "../images/cafe3.jpg";

const trends = [
  {
    image: cafe1,
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
    title: "Starbucks",
    author: {
      name: "Clara Bertoletti",
      avatar: "https://assets.maccarianagency.com/avatars/img1.jpg",
    },
    date: "02 Aug",
  },
  {
    image: cafe2,
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus",
    title: "JCO's Donuts",
    author: {
      name: "Jhon Anderson",
      avatar: "https://assets.maccarianagency.com/avatars/img2.jpg",
    },
    date: "05 Mar",
  },
  {
    image: cafe3,
    description:
      "Qui blanditiis praesentium voluptatum deleniti atque corrupti",
    title: "Elsewhere Cafe",
    author: {
      name: "Chary Smith",
      avatar: "https://assets.maccarianagency.com/avatars/img3.jpg",
    },
    date: "10 Jan",
  },
];

const TrendingCafes = () => {
  const theme = useTheme();
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
            You can never go wrong with these!
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={4}>
        {trends.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box
              component={"a"}
              href={""}
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
                  image={item.image}
                  title={item.title}
                  sx={{
                    height: { xs: 200, md: 260 },
                    position: "relative",
                  }}
                >
                  <Box
                    component={"svg"}
                    viewBox="0 0 2880 480"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      color: theme.palette.background.paper,
                      transform: "scale(2)",
                      height: "auto",
                      width: 1,
                      transformOrigin: "top center",
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2160 0C1440 240 720 240 720 240H0v240h2880V0h-720z"
                      fill="currentColor"
                    />
                  </Box>
                </CardMedia>
                <Box component={CardContent} position={"relative"}>
                  <Typography variant={"h6"} gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {item.description}
                  </Typography>
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
                    <Box display={"flex"} alignItems={"center"}>
                      <Avatar
                        src={item.author.avatar}
                        sx={{ marginRight: 1 }}
                      />
                      <Typography color={"text.secondary"}>
                        {item.author.name}
                      </Typography>
                    </Box>
                    <Typography color={"text.secondary"}>
                      {item.date}
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
