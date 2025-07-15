import { Box, Container, useTheme } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import { COLOURS } from "../theme/AppStyles";
import spotifyLogo from "../spotifyLogos/Spotify_Icon_RGB_White.png";
import { BASE_REDIRECT_URI } from "../constants/auth";
import { InAppModal } from "../components/InAppModal";
import "../styles/Background.css";
import "../styles/recordShopTheme.css";
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
    <div className="record-shop-theme">
      <Box className="record-shop-page">
        <div className="record-shop-background-pattern">
          
          <Container 
            maxWidth="lg" 
            sx={{ 
              position: 'relative',
              zIndex: 3,
              pt: { xs: 6, md: 10 },
              pb: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '100vh'
            }}
          >
            <Box sx={{ position: 'relative', mb: { xs: 4, md: 6 } }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem' },
                  fontFamily: "Lobster, Arial, sans-serif",
                  color: 'var(--main-text-color)',
                  textAlign: 'center',
                  position: 'relative',
                  letterSpacing: '2px'
                }}
              >
                Record Shop
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--main-text-color)',
                mb: 6,
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '4px',
                  background: 'linear-gradient(90deg, #C76D7E33 0%, #3772FF33 50%, #E5C4B3 100%)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  animation: 'shimmer 3s ease-in-out infinite'
                },
                '@keyframes shimmer': {
                  '0%, 100%': {
                    transform: 'translateX(-50%) scaleX(1)',
                    opacity: 0.8
                  },
                  '50%': {
                    transform: 'translateX(-50%) scaleX(1.1)',
                    opacity: 1
                  }
                }
              }}
            >
              Discover new music.
            </Typography>

            <Box
              className="content-card"
              sx={{
                maxWidth: '800px',
                width: '100%',
                mb: 6,
                position: 'relative',
                p: 6,
                backgroundColor: '#3772FF33'
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  lineHeight: 1.8,
                  textAlign: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500
                }}
              >
                Create personalized Spotify playlists with the top tracks from artists performing in your city or festival of choice.
              </Typography>

              {!isLoggedIntoSpotify() && (
                <Typography 
                  sx={{ 
                    mt: 3,
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    // color: '#ffffff',
                    lineHeight: 1.8,
                    textAlign: 'center',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 400
                  }}
                >
                  To get started, sign in with Spotify.
                </Typography>
              )}
            </Box>

            {!isLoggedIntoSpotify() && (
              <Box 
                sx={{ 
                  mb: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Button
                  onClick={redirectToAuthForBrowser(openInAppModal, `${BASE_REDIRECT_URI}artists`)}
                  variant="contained"
                  className="primary-button"
                  sx={{
                    py: 2.5,
                    px: 8,
                    borderRadius: '500px',
                    textTransform: 'none',
                    fontSize: '1.3rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={spotifyLogo}
                    alt="spotify_logo"
                    width="32px"
                    height="32px"
                    style={{ marginRight: '16px' }}
                  />
                  Sign in
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
                  mb: 3,
                  color: 'var(--main-text-color)',
                  fontSize: '1.2rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  opacity: 0.7
                }}
              >
                Don&apos;t want to sign in?
              </Typography>

              <Button
                onClick={() => goToNewTabOnDesktop("https://open.spotify.com/user/31ma23i46a3p3vmxvvq7qmhk7w3q")}
                variant="outlined"
                className="secondary-button"
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: '500px',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid var(--secondary-button-bg-color)'
                }}
              >
                <img 
                  src={spotifyLogo} 
                  alt="spotify_logo" 
                  width="28px" 
                  height="28px" 
                  style={{ marginRight: '12px' }} 
                />
                Preview a Playlist
              </Button>

              <Typography
                sx={{
                  mt: 3,
                  color: 'var(--main-text-color)',
                  fontSize: '1rem',
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
        </div>
      </Box>
    </div>
  );
});

WelcomePage.displayName = "WelcomePage";

export default WelcomePage;
