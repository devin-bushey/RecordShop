import { Box, Collapse, Container, IconButton, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button/Button";
import { useContext, useEffect, useState } from "react";
import { SnackBarContext } from "../App";
import { LOCATIONS } from "../constants/locations";
import { Origin } from "../components/Origin";
import { Settings } from "../components/Settings";
import { CreateNewPlaylist } from "../apiManager/RecordShop";
import { Spinner } from "../components/Spinner";
import { goToNewTabOnDesktop, scrollToTop } from "../utils/browserUtils";
import { SpotifyIcon } from "../components/Icons";
import { isMobile } from "../utils/responsiveUtils";
import SettingsIcon from "@mui/icons-material/Settings";
import { useGigsQuery } from "../hooks/useGigsQuery";
import { useAuth } from "../context/AuthContext";
import { useShakingEffect } from "../hooks/useShakingEffect";
import { GigList } from "../components/GigList";
import { StickyFadeButton } from "../components/StickyFadeButton";
import { CreatePlaylistButton } from "../components/CreatePlaylistButton";

export const ArtistsPage = () => {
  const { isLoggedIntoSpotify, redirectToAuth, token, spotifyInfo } = useAuth();
  const [origin, setOrigin] = useState(LOCATIONS[0].value);
  const { data: gigs, isLoading: isGigsQueryLoading } = useGigsQuery(origin);
  const [numTopTracks, setNumTopTracks] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const { isShaking } = useShakingEffect();
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isErrorCreatingPlaylist, setIsErrorCreatingPlaylist] = useState(false);
  const snackBar = useContext(SnackBarContext);

  useEffect(() => {
    document.title = "Record Shop | Artists";
    scrollToTop();
  }, []);

  useEffect(() => {
    if (isErrorCreatingPlaylist) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Error creating playlist. Please try again.",
        isError: true,
      });
    }
  }, [isErrorCreatingPlaylist]);

  const handleSignIn = () => redirectToAuth();
  const handleChangeOrigin = (event: any) => setOrigin(event.target.value);
  const handleNumTopTracks = (event: any) => setNumTopTracks(event.target.value);

  const handleCreatePlaylist = async () => {
    setIsCreatingPlaylist(true);
    try {
      const playlistUrl = await CreateNewPlaylist({
        city: origin,
        token,
        user_id: spotifyInfo.user_id,
        numTopTracks,
      });

      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Successfully created a playlist!",
        isError: false,
      });

      setTimeout(() => {
        if (playlistUrl && typeof playlistUrl === 'string') {
          goToNewTabOnDesktop(playlistUrl);
        }
      }, 500);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setIsErrorCreatingPlaylist(true);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const PlaylistCreation = (
    <Box
      sx={{
        width: { xs: "100%", sm: "300px" },
        margin: 0
      }}
    >
      {isLoggedIntoSpotify() ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleCreatePlaylist}
            variant="contained"
            className={`${isShaking ? "shaking" : ""}`}
            sx={{
              backgroundColor: '#2196f3',
              color: '#fff',
              width: "100%",
              height: "48px",
              borderRadius: '12px',
              textTransform: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              padding: '0 16px',
              '& .MuiSvgIcon-root': {
                fontSize: '1.25rem'
              },
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            {SpotifyIcon()}
            <Typography 
              component="span"
              sx={{ 
                fontSize: 'inherit',
                lineHeight: 1,
                mt: '1px'
              }}
            >
              Create playlist
            </Typography>
          </Button>

          <IconButton
            onClick={() => setShowSettings(!showSettings)}
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderRadius: '12px',
              width: '48px',
              height: '48px',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.2)'
              }
            }}
          >
            <SettingsIcon sx={{ color: '#2196f3' }} />
          </IconButton>
        </Box>
      ) : isMobile() ? (
        <Button
          onClick={handleSignIn}
          variant="contained"
          className={`${isShaking ? "shaking" : ""}`}
          sx={{
            backgroundColor: '#2196f3',
            color: '#fff',
            width: "100%",
            height: "48px",
            borderRadius: '12px',
            textTransform: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            padding: '0 16px',
            mb: 2,
            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem'
            },
            '&:hover': {
              backgroundColor: '#1976d2'
            }
          }}
        >
          {SpotifyIcon()}
          <Typography 
            component="span"
            sx={{ 
              fontSize: 'inherit',
              lineHeight: 1,
              mt: '10px'
            }}
          >
            Sign in
          </Typography>
        </Button>
      ) : (
        <Tooltip title="Sign in to unlock this feature!">
          <span>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "48px",
                borderRadius: '12px',
                textTransform: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                padding: '0 16px',
                opacity: 0.7,
                '& .MuiSvgIcon-root': {
                  fontSize: '1.25rem'
                }
              }}
              disabled
            >
              {SpotifyIcon()}
              <Typography 
                component="span"
                sx={{ 
                  fontSize: 'inherit',
                  lineHeight: 1,
                  mt: '10px',
                  color: "grey"
                }}
              >
                Create playlist
              </Typography>
            </Button>
          </span>
        </Tooltip>
      )}

      <Collapse in={showSettings}>
        <Box sx={{ mt: 2, backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px', p: 2 }}>
          <Settings numTopTracks={numTopTracks} setNumTopTracks={handleNumTopTracks} />
        </Box>
      </Collapse>
    </Box>
  );

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <Box 
        sx={{ 
          minHeight: '100vh',
          pt: { xs: 2, md: 4 },
          pb: 15 
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 4, md: 6 }
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                fontFamily: "Lobster, Arial, sans-serif",
                letterSpacing: "2px",
                color: '#1a1a1a',
                mb: 1
              }}
            >
              Record Shop
            </Typography>
            <Typography
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1rem',
                opacity: 0.7,
                color: '#1a1a1a',
                mb: 4
              }}
            >
              Discover upcoming shows in your city
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Box 
              sx={{ 
                maxWidth: "900px",
                width: "100%",
                backgroundColor: '#fff',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                p: { xs: 3, md: 4 },
                mb: 6
              }}
            >
              <Container
                disableGutters
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 3,
                  justifyContent: "center"
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: "300px" }
                  }}
                >
                  <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />
                </Box>

                {PlaylistCreation}
              </Container>
            </Box>

            <Box 
              sx={{ 
                width: "100%",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <GigList gigs={gigs} isQueryLoading={isGigsQueryLoading} />
            </Box>
          </Box>
        </Container>
      </Box>

      <StickyFadeButton
        bgFadeColourHex="#f0ede8"
        button={<CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />}
      />
    </>
  );
};
