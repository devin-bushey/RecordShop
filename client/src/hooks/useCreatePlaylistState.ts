import { useContext, useEffect, useState } from "react";
import { CreateNewPlaylist } from "../apiManager/RecordShop";
import { SnackBarContext } from "../App";
import { goTo, goToNewTab, goToNewTabOnDesktop } from "../utils/browserUtils";
import { useAuth } from "../context/AuthContext";
import { Gig } from "../types/Gig";

type PlaylistStateProps = {
  dbCollectionName: string;
  numTopTracks: number;
  overrideGigs?: Gig[];
};

export const useCreatePlaylistState = ({ dbCollectionName, numTopTracks, overrideGigs }: PlaylistStateProps) => {
  const { token, spotifyInfo } = useAuth();

  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isErrorCreatingPlaylist, setIsErrorCreatingPlaylist] = useState(false);
  const snackBar = useContext(SnackBarContext);

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

  const handleCreatePlaylist = async () => {
    setIsCreatingPlaylist(true);
    try {
      const playlistUrl = await CreateNewPlaylist({
        city: dbCollectionName,
        token,
        user_id: spotifyInfo.user_id,
        numTopTracks,
        overrideGigs,
      });

      console.log("Raw playlist URL:", playlistUrl);
      console.log("URL type:", typeof playlistUrl);

      // Ensure we have a valid URL
      if (!playlistUrl || typeof playlistUrl !== 'string') {
        throw new Error("Invalid playlist URL received");
      }

      // Show success message
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Successfully created a playlist!",
        isError: false,
      });
      
      // Add a small delay before opening the URL
      setTimeout(() => {
        console.log("Attempting to open URL:", playlistUrl);
        try {
          // Try window.open first
          const newWindow = window.open(playlistUrl, '_blank');
          if (newWindow === null) {
            // If window.open was blocked, fall back to location.assign
            console.log("window.open blocked, trying location.assign...");
            window.location.assign(playlistUrl);
          }
        } catch (e) {
          console.error("Error opening URL:", e);
          // Final fallback
          window.location.href = playlistUrl;
        }
      }, 500); // 500ms delay
    } catch (error) {
      console.error("Error creating playlist:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        error
      });
      setIsErrorCreatingPlaylist(true);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  return {
    isCreatingPlaylist,
    setIsCreatingPlaylist,
    isErrorCreatingPlaylist,
    setIsErrorCreatingPlaylist,
    handleCreatePlaylist,
  };
};
