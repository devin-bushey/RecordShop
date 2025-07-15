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
import { Loading } from "./Loading";
import "../styles/recordShopTheme.css";

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
  const handleNumTopTracks = (value: number) => setNumTopTracks(value);

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


  const COLOURS = {
    cardColours: ["#B8E1FF", "#", "#FFCAAF"],
    stickyFadeButtonBgColour: "#ece7e1",
  };

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <div className="record-shop-theme">
        <Box className="record-shop-page">
          <div className="record-shop-background-pattern">
            
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
              <Box
                sx={{
                  textAlign: "center",
                  mb: { xs: 4, md: 6 },
                  pt: { xs: 4, md: 6 }
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                    fontFamily: "Lobster, Arial, sans-serif",
                    letterSpacing: "2px",
                    color: 'var(--main-text-color)',
                    mb: 1
                  }}
                >
                  Record Shop
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1.2rem',
                    color: 'var(--main-text-color)',
                    mb: 4,
                    opacity: 0.7
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
                <Box className="content-card" sx={{ maxWidth: "900px", width: "100%", p: { xs: 3, md: 4 }, mb: 3, backgroundColor: '#3772FF33' }}>
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
                    <Box sx={{ width: { xs: "100%", sm: "300px" } }}>
                      <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />
                    </Box>

                    <Box sx={{ width: { xs: "100%", sm: "300px" }, margin: 0 }}>
                      {isLoggedIntoSpotify() ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            onClick={handleCreatePlaylist}
                            variant="contained"
                            className={`primary-button ${isShaking ? "shaking" : ""}`}
                            sx={{
                              width: "100%",
                              height: "48px",
                              textTransform: 'none',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1.5,
                              padding: '0 16px',
                              '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                            }}
                          >
                            {SpotifyIcon()}
                            <Typography component="span" sx={{ fontSize: 'inherit', lineHeight: 1, mt: '10px' }}>
                              Create playlist
                            </Typography>
                          </Button>

                          <IconButton
                            onClick={() => setShowSettings(!showSettings)}
                            sx={{
                              backgroundColor: 'var(--secondary-button-bg-color)',
                              borderRadius: '12px',
                              width: '48px',
                              height: '48px',
                              flexShrink: 0,
                              '&:hover': { backgroundColor: 'var(--secondary-button-hover-bg-color)' }
                            }}
                          >
                            <SettingsIcon sx={{ color: 'var(--secondary-button-text-color)' }} />
                          </IconButton>
                        </Box>
                      ) : isMobile() ? (
                        <Button
                          onClick={handleSignIn}
                          variant="contained"
                          className={`primary-button ${isShaking ? "shaking" : ""}`}
                          sx={{
                            width: "100%",
                            height: "48px",
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
                            '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                          }}
                        >
                          {SpotifyIcon()}
                          <Typography component="span" sx={{ fontSize: 'inherit', lineHeight: 1, mt: '10px' }}>
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
                                '& .MuiSvgIcon-root': { fontSize: '1.25rem' }
                              }}
                              disabled
                            >
                              {SpotifyIcon()}
                              <Typography component="span" sx={{ fontSize: 'inherit', lineHeight: 1, mt: '10px', color: "grey" }}>
                                Create playlist
                              </Typography>
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </Container>
                </Box>

                <Collapse in={showSettings}>
                  <Box sx={{ width: "100%", maxWidth: "900px", mb: 6 }}>
                    <div className="settings-container" style={{ padding: '24px', margin: '0 16px' }}>
                      <Settings numTopTracks={numTopTracks} setNumTopTracks={handleNumTopTracks} />
                    </div>
                  </Box>
                </Collapse>

                <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '300px', pb: 15 }}>
                  {isGigsQueryLoading ? (
                    <Box sx={{ mt: 4 }}>
                      <Loading />
                    </Box>
                  ) : (
                    <GigList gigs={gigs} isQueryLoading={isGigsQueryLoading} />
                  )}
                </Box>
              </Box>
            </Container>
          </div>
        </Box>
      </div>

      <StickyFadeButton
        bgFadeColourHex={COLOURS.stickyFadeButtonBgColour}
        button={<CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />}
      />
    </>
  );
};
