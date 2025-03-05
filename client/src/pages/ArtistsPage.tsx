import { Box, Collapse, Container, IconButton, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button/Button";
import { useContext, useEffect, useState } from "react";
import { SnackBarContext } from "../App";
import { LOCATIONS } from "../constants/locations";
import { Origin } from "../components/Origin";
import { Settings } from "../components/Settings";
import { CreateNewPlaylist } from "../apiManager/RecordShop";
import { Spinner } from "../components/Spinner";
import { primaryButtonColours } from "../theme/AppStyles";
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

  const handleChangeOrigin = (event: any) => {
    setOrigin(event.target.value);
  };

  const handleNumTopTracks = (event: any) => {
    setNumTopTracks(event.target.value);
  };

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

      // Add a small delay before opening the URL
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
    <>
      <Box
        sx={{
          borderRadius: "10px",
          width: "300px",
          margin: "8px",
        }}
      >
        {isLoggedIntoSpotify() ? (
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={handleCreatePlaylist}
              variant="contained"
              className={`${isShaking ? "shaking" : ""}`}
              sx={{
                ...primaryButtonColours,
                color: "black",
                width: "100%",
                justifyContent: "center",
                height: "48px",
              }}
            >
              {SpotifyIcon()}
              <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
            </Button>

            <IconButton
              sx={{ marginLeft: "8px" }}
              onClick={() => {
                setShowSettings(!showSettings);
              }}
              disableRipple={true}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        ) : isMobile() ? (
          <Button
            onClick={handleSignIn}
            variant="contained"
            className={`${isShaking ? "shaking" : ""}`}
            sx={{
              ...primaryButtonColours,
              color: "black",
              width: "300px",
              marginBottom: "16px",
              justifyContent: "center",
              height: "48px",
            }}
          >
            {SpotifyIcon()}
            <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
          </Button>
        ) : (
          <Tooltip title="Sign in to unlock this feature!">
            <span>
              <Button
                variant="contained"
                sx={{
                  width: "300px",
                  marginBottom: "16px",
                  justifyContent: "center",
                  height: "48px",
                }}
                disabled
              >
                {SpotifyIcon()}
                <Typography sx={{ paddingBottom: 0, color: "grey" }}>Create playlist</Typography>
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      <Collapse in={showSettings} collapsedSize={0}>
        <Settings numTopTracks={numTopTracks} setNumTopTracks={handleNumTopTracks} />
      </Collapse>
    </>
  );

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <Box sx={{ marginTop: "-24px", textAlign: "center", paddingBottom: "150px" }}>
        <Typography
          sx={{
            fontSize: "4rem",
            fontFamily: "Lobster, Arial, sans-serif",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Record Shop
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ maxWidth: "900px" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  borderRadius: "10px",
                  width: "300px",
                  margin: "8px",
                }}
              >
                <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />
              </Box>

              {PlaylistCreation}
            </Container>

            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                paddingTop: "24px",
              }}
            >
              <GigList gigs={gigs} isQueryLoading={isGigsQueryLoading} />
            </Container>
          </Box>
        </Box>
      </Box>

      <StickyFadeButton
        bgFadeColourHex="#CBCFE7"
        // TODO make this a sign in button if on mobile
        button={<CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />}
      />
    </>
  );
};
