import { Box, Card, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { goTo, scrollToTop } from "../utils/browserUtils";

export const FestivalPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.title = "Record Shop | Festivals";
    scrollToTop();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const festivalList = [
    { 
      title: "Phillips Backyard", 
      endpoint: "phillipsbackyard2024", 
      colour: "#FF6B6B"  // Warm coral red
    },
    { 
      title: "Pachena Bay", 
      endpoint: "pachenabay", 
      colour: "#4ECDC4"  // Turquoise
    },
    { 
      title: "Laketown Shakedown", 
      endpoint: "laketownShakedown", 
      colour: "#45B7D1"  // Ocean blue
    },
    { 
      title: "Rifflandia", 
      endpoint: "rifflandia2024", 
      colour: "#9B5DE5"  // Purple
    },
  ];

  const festivalList2023 = [
    { 
      title: "Rifflandia", 
      endpoint: "rifflandia", 
      colour: "#FFD93D"  // Golden yellow
    },
    { 
      title: "Phillips Backyard", 
      endpoint: "phillipsbackyard", 
      colour: "#FF8E3C"  // Warm orange
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        pb: 15
      }}
    >
      {/* Subtle gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          zIndex: 0,

        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 8 } }}>
        <Box
          sx={{
            position: 'relative',
            mb: 6,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem' },
              fontFamily: "Lobster, Arial, sans-serif",
              letterSpacing: "2px",
            }}
          >
            Record Shop
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: 'center',
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-12px',
                left: '45%',
                width: '10%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #ff4081, #2196f3, transparent)'
              }
            }}
          >
            2024
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ maxWidth: "900px", width: "100%" }}>
              <Grid
                container
                spacing={3}
                justifyContent="center"
              >
                {festivalList.map((festival) => (
                  <FestivalCard
                    key={festival.endpoint}
                    title={festival.title}
                    endpoint={festival.endpoint}
                    colour={festival.colour}
                  />
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: 'center',
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-12px',
                left: '45%',
                width: '10%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #ff4081, #2196f3, transparent)'
              }
            }}
          >
            2023
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ maxWidth: "900px", width: "100%" }}>
              <Grid
                container
                spacing={3}
                justifyContent="center"
              >
                {festivalList2023.map((festival) => (
                  <FestivalCard
                    key={festival.endpoint}
                    title={festival.title}
                    endpoint={festival.endpoint}
                    colour={festival.colour}
                  />
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const FestivalCard = ({ endpoint, title, colour }: { endpoint: string; title: string; colour: string }) => (
  <Grid item xs={12} sm={6} display="flex" justifyContent="center">
    <Card
      sx={{
        backgroundColor: colour,
        maxWidth: "400px",
        width: "100%",
        borderRadius: '16px',
        cursor: "pointer",
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)'
        }
      }}
      onClick={() => goTo(`/${endpoint}`)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          px: 3
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.15)',
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </Typography>
      </Box>
    </Card>
  </Grid>
);
