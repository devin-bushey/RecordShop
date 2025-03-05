import { Box, Container, useTheme } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import { COLOURS } from "../theme/AppStyles";
import spotifyLogo from "../spotifyLogos/Spotify_Icon_RGB_White.png";
import { BASE_REDIRECT_URI } from "../constants/auth";
import { InAppModal } from "../components/InAppModal";
import "../styles/Background.css";
import { Link } from "react-router-dom";

import { goToNewTabOnDesktop } from "../utils/browserUtils";
import { useAuth } from "../context/AuthContext";
import { setDocumentTitle } from "../hooks/useDocumentTitleEffect";
import { useInAppModalState } from "../hooks/useInAppModalState";
import { redirectToAuthForBrowser } from "../utils/spotifyAuthUtils";

const WelcomePage = memo(() => {
  const { isLoggedIntoSpotify } = useAuth();
  const { isInAppModalOpen, openInAppModal, closeInAppModal } = useInAppModalState();
  const theme = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  setDocumentTitle("Record Shop | Login");

  return (
    <Box
      sx={{
        minHeight: '100vh',
        color: '#1a1a1a',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default'
      }}
    >
      {/* Subtle gradient background */}

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          pt: { xs: 0, md: 8 },
          pb: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem' },
              fontFamily: "Lobster, Arial, sans-serif",
              // color: '#1a1a1a',
              textAlign: 'center',
              position: 'relative',
              // textShadow: '2px 2px 0px #ff4081, -2px -2px 0px #2196f3',
              letterSpacing: '2px',

            }}
          >
            Record Shop
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontFamily: "'JetBrains Mono', monospace",
            color: '#1a1a1a',
            mb: 4,
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: '10%',
              width: '80%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #ff4081, #2196f3, transparent)'
            }
          }}
        >
          Discover new music.
        </Typography>

        <Box
          sx={{
            maxWidth: '800px',
            width: '100%',
            mb: 6,
            position: 'relative',
            p: 6,
            borderRadius: '24px',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              color: '#1a1a1a',
              lineHeight: 1.8,
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            Create personalized Spotify playlists with the top tracks from artists performing in your city or festival of choice.
          </Typography>

          {!isLoggedIntoSpotify() && (
            <Typography 
              sx={{ 
                mt: 3,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                color: '#1a1a1a',
                lineHeight: 1.8,
                textAlign: 'center',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              To get started, sign in with Spotify.
            </Typography>
          )}
        </Box>

        {!isLoggedIntoSpotify() && (
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Button
              onClick={redirectToAuthForBrowser(openInAppModal, `${BASE_REDIRECT_URI}artists`)}
              variant="contained"
              sx={{
                backgroundColor: '#1a1a1a',
                color: '#fff',
                py: 2,
                px: 6,
                borderRadius: '500px',
                textTransform: 'none',
                fontSize: '1.2rem',
                fontFamily: "'JetBrains Mono', monospace",
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#1a1a1a',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <img
                src={spotifyLogo}
                alt="spotify_logo"
                width="28px"
                height="28px"
                style={{ marginRight: '16px' }}
              />
              Sign in with Spotify
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <Typography 
            sx={{ 
              mb: 2,
              color: '#1a1a1a',
              fontSize: '1.1rem',
              fontFamily: "'JetBrains Mono', monospace",
              opacity: 0.7
            }}
          >
            Don&apos;t want to sign in?
          </Typography>

          <Button
            onClick={() => goToNewTabOnDesktop("https://open.spotify.com/user/31ma23i46a3p3vmxvvq7qmhk7w3q")}
            variant="outlined"
            sx={{
              color: '#1a1a1a',
              borderColor: 'rgba(26, 26, 26, 0.3)',
              py: 1.5,
              px: 4,
              borderRadius: '500px',
              textTransform: 'none',
              fontSize: '1rem',
              fontFamily: "'JetBrains Mono', monospace",
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#1a1a1a',
                backgroundColor: 'rgba(26, 26, 26, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <img 
              src={spotifyLogo} 
              alt="spotify_logo" 
              width="24px" 
              height="24px" 
              style={{ marginRight: '12px', filter: 'brightness(0)' }} 
            />
            Preview a Playlist
          </Button>

          <Typography
            sx={{
              mt: 2,
              color: '#1a1a1a',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              fontFamily: "'JetBrains Mono', monospace",
              opacity: 0.6,
              textAlign: 'center'
            }}
          >
            (but it&apos;s more fun to customize your own)
          </Typography>
        </Box>

        <InAppModal
          isOpen={isInAppModalOpen}
          closeModal={closeInAppModal}
          postAuthRedirectUri={`${BASE_REDIRECT_URI}artists`}
        />
      </Container>
    </Box>
  );
});

WelcomePage.displayName = "WelcomePage";

export default WelcomePage;
