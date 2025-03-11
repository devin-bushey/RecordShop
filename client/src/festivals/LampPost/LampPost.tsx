import { Box, Button, Collapse, Grid, IconButton, Typography, Container, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Cities } from "../../constants/enums";
import { useGigsQuery } from "../../hooks/useGigsQuery";
import { useAuth } from "../../context/AuthContext";
import { setDocumentTitle } from "../../hooks/useDocumentTitleEffect";
import { SignInButton } from "../../components/SignInButton";
import { RecordShopTitle } from "../../components/RecordShopTitle";
import { ProfileMenu } from "../../components/ProfileMenu";
import { goToNewTab } from "../../utils/browserUtils";
import { PageClassName, SpotifyColour } from "../../theme/AppStyles";
import { redirectToAuthForBrowser } from "../../utils/spotifyAuthUtils";
import { useSettingsState } from "../../hooks/useSettingsCollapseState";
import { Settings } from "../../components/Settings";
import { StickyFadeButton } from "../../components/StickyFadeButton";
import { Spinner } from "../../components/Spinner";
import { isMobile } from "../../utils/responsiveUtils";
import { useCreatePlaylistState } from "../../hooks/useCreatePlaylistState";
import { InAppModal } from "../../components/InAppModal";
import { useInAppModalState } from "../../hooks/useInAppModalState";
import { LampPostGigList } from "./components/LampPostGigList";
import { useState } from "react";
import "./lampPostStyles.css";
import { AboutUsPopover } from "../../components/AboutUsPopover";
import { CreatePlaylistButton } from "../../components/CreatePlaylistButton";
import lampPostLogo from "./assets/lampPostLogo.avif";

const DB_COLLECTION_NAME = Cities.Victoria_2025;

const SAMPLE_PLAYLIST_URL = "https://open.spotify.com/playlist/6ikQbhMvzqR7g9NoH1ViVR"; // TODO: Update this with a LampPost sample playlist
const TICKET_LINK = "https://www.lamppostvictoria.com/events/live-music-folder/live-music"; // LampPost Victoria website

const PAGE_CLASS = PageClassName.LampPost;

const COLOURS = Object.freeze({
  text: "#333333",
  accent: "#FFC107", // Yellow accent color
  // secondary: "#ef6461",
  cardColours: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
  stickyFadeButtonBgColour: "#ffffff",
});

export const LampPost = () => {
  const { isLoggedIntoSpotify } = useAuth();
  const { data: gigs, isLoading: isGigsQueryLoading } = useGigsQuery(DB_COLLECTION_NAME);
  const { isSettingsOpen, openSettings, closeSettings, numTopTracks, setNumTopTracks } = useSettingsState();
  const { isInAppModalOpen, openInAppModal, closeInAppModal } = useInAppModalState();

  const { isCreatingPlaylist, handleCreatePlaylist } = useCreatePlaylistState({
    dbCollectionName: DB_COLLECTION_NAME,
    numTopTracks,
  });

  setDocumentTitle("LampPost Victoria | Live Music & Concerts");

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <div className={PAGE_CLASS}>
        <Box
          className="lamp-post-page"
          sx={{
            minHeight: "100vh",
          }}
        >
          {/* Navigation Bar */}
          <Box className="lamp-post-navbar">
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RecordShopTitle textColour={COLOURS.text} />
                    x
                    <LampPostTitle />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AboutUsPopover pageClassName={PAGE_CLASS} />
                  {isLoggedIntoSpotify() ? (
                    <ProfileMenu />
                  ) : (
                    <SignInButton redirectToAuth={redirectToAuthForBrowser(openInAppModal)} />
                  )}
                  <IconButton
                    sx={{ color: COLOURS.text }}
                    onClick={() => (isSettingsOpen ? closeSettings() : openSettings())}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </Box>
            </Container>
          </Box>

          <Container maxWidth="lg">
            {/* Main Content */}
            <Box sx={{ textAlign: 'center', mb: 4, mt: 6 }}>
              <Typography 
                variant="h1" 
                className="lamp-post-title"
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 0
                }}
              >
                <span style={{ color: COLOURS.accent }}>Live music & concerts</span>
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3
                }}
              >
                in Victoria
              </Typography>
              <Typography variant="subtitle1" className="lamp-post-subtitle" sx={{ mt: 2, mb: 4 }}>
                Concerts & live music of every genre and every vibe.
              </Typography>
            </Box>

            <Collapse in={isSettingsOpen} collapsedSize={0}>
              <Settings numTopTracks={numTopTracks} setNumTopTracks={setNumTopTracks} />
            </Collapse>
            
            {/* Event Listings */}
            <Box>
              <LampPostGigList gigs={gigs} isQueryLoading={isGigsQueryLoading} />
            </Box>

            <StickyFadeButton
              bgFadeColourHex={COLOURS.stickyFadeButtonBgColour}
              button={
                isMobile() && !isLoggedIntoSpotify() ? (
                  <SignInButton redirectToAuth={redirectToAuthForBrowser(openInAppModal)} />
                ) : (
                  <CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />
                )
              }
            />

            <InAppModal isOpen={isInAppModalOpen} closeModal={closeInAppModal} pageClassName={PAGE_CLASS} />
            
          </Container>
        </Box>
      </div>
    </>
  );
}; 

const LampPostTitle = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={lampPostLogo} alt="LampPost Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <Typography sx={{ fontFamily: "Cothamsans, Verdana, sans-serif", fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.05em' }}>
                LampPost
            </Typography>
        </Box>

    );
};



