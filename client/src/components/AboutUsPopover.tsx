import { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import { ContactUsModal } from "./ContactUsModal";
import { PageClassName } from "../theme/AppStyles";
import coffeeCup from "../assets/images/coffee-cup.png";

const DEFAULT_BACKGROUND_COLOUR = "#CEE4A9";
const DEFAULT_PRIMARY_BUTTON_COLOUR = {
  backgroundColor: "#00AEEF",
  color: "black",
  ":hover": { backgroundColor: "#3772ff33" },
};

export const AboutUsPopover = ({ pageClassName }: { pageClassName?: PageClassName }) => {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const closePopover = () => setPopoverAnchor(null);

  const open = Boolean(popoverAnchor);

  return (
    <Box className={`about-us-popover ${PageClassName}`}>
      <Button onClick={handleClick} sx={DEFAULT_PRIMARY_BUTTON_COLOUR} className="secondary-button">
        CREDITS
      </Button>
      <Popover
        open={open}
        anchorEl={popoverAnchor}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className={pageClassName}
      >
        <AboutUsContents pageClassName={pageClassName} />
      </Popover>
    </Box>
  );
};

export const AboutUsContents = ({ pageClassName }: { pageClassName?: PageClassName }) => {
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
  const openContactUsModal = () => setIsContactUsModalOpen(true);
  const closeContactUsModal = () => setIsContactUsModalOpen(false);

  return (
    <Box
      sx={{ padding: "24px", textAlign: "right", backgroundColor: DEFAULT_BACKGROUND_COLOUR }}
      className="about-us-contents"
    >
      <Box>
        <a
          href="/"
          style={{
            fontFamily: "Lobster, cursive",
            fontSize: "20px",
            color: "black",
          }}
        >
          Record Shop
        </a>
        <span style={{ fontSize: "16px" }}> by Devin B</span>
        <Typography style={{ fontSize: "12px" }}>Made in Victoria, BC</Typography>
      </Box>

      <Box sx={{ marginTop: "12px" }}>
        <Button
          href="https://bmc.link/buushh"
          target="_blank"
          className="secondary-button"
          sx={{ width: "100%", ...DEFAULT_PRIMARY_BUTTON_COLOUR }}
        >
          <img src={coffeeCup} alt="coffee" width="20px" height="20px" style={{ marginRight: "8px" }} />
          Buy me a coffee
        </Button>
      </Box>

      <Box sx={{ marginTop: "12px" }}>
        <Button
          className="primary-button"
          onClick={openContactUsModal}
          sx={{ width: "100%", ...DEFAULT_PRIMARY_BUTTON_COLOUR }}
        >
          Contact Us
        </Button>
      </Box>

      <ContactUsModal isOpen={isContactUsModalOpen} closeModal={closeContactUsModal} pageClassName={pageClassName} />
    </Box>
  );
};
