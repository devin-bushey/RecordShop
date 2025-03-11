import { Modal, Box, Typography, Button } from "@mui/material";
import { useContext } from "react";
import { SnackBarContext } from "../App";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import copy from "../assets/images/copy-solid.svg";
import { redirectToAuth } from "../utils/spotifyAuthUtils";
import { getCurrentUrlWithoutParams } from "../utils/browserUtils";

export const InAppModal = ({
  isOpen,
  closeModal,
  pageClassName,
  postAuthRedirectUri,
}: {
  isOpen: boolean;
  closeModal: () => void;
  pageClassName?: string;
  postAuthRedirectUri?: string;
}) => {
  const snackBar = useContext(SnackBarContext);

  const urlToCopy = getCurrentUrlWithoutParams();

  const handleCopy = () => {
    navigator.clipboard.writeText(urlToCopy);
    snackBar.setSnackBar({
      showSnackbar: true,
      setShowSnackbar: () => true,
      message: "Copied! Please paste URL in a new browser window",
      isError: false,
    });
  };

  return (
    <Modal open={isOpen} onClose={closeModal} className={pageClassName}>
      <Box
        className="in-app-modal"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: 24,
          p: { xs: 2.5, sm: 4 },
        }}
      >
        <Typography 
          id="modal-modal-title" 
          variant="h6" 
          component="h2" 
          sx={{ 
            maxWidth: { xs: "100%", sm: "70%" },
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          Looks like you&apos;re using an in-app browser.
        </Typography>
        <Typography 
          id="modal-modal-description" 
          sx={{ 
            mt: 2,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          If you have trouble signing into Spotify, please open Record Shop in Chrome, Safari, Firefox, etc.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Button
            className="secondary-button"
            onClick={() => redirectToAuth(postAuthRedirectUri)}
            variant="contained"
            color="secondary"
            sx={{ width: "100%", marginTop: "12px", justifyContent: "center" }}
          >
            <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
            <Typography sx={{ paddingBottom: 0, fontSize: { xs: '0.875rem', sm: '1rem' } }}>Continue</Typography>
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            marginTop: "20px",
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
          }}
        >
          <Typography sx={{ 
            paddingBottom: "0px", 
            fontSize: { xs: "12px", sm: "14px" }, 
            overflowWrap: "anywhere",
            textAlign: { xs: 'center', sm: 'left' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            {urlToCopy}
          </Typography>
          <Button onClick={handleCopy} sx={{ minWidth: "20px" }}>
            <img src={copy} alt="copy" height="20px" />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
