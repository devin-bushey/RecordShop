import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, IconButton, Menu, Typography, Popover } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { COLOURS, primaryButtonColours, secondaryButtonColours } from "../theme/AppStyles";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { redirectToAuth, logOut } from "../utils/spotifyAuthUtils";
import { ContactUsModal } from "./ContactUsModal";
import { ProfileMenu } from "./ProfileMenu";
import { AboutUsContents } from "./AboutUsPopover";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

type MenuProps = {
  openContactUsModal: () => void;
};

const Navbarr = () => {
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
  const openContactUsModal = () => setIsContactUsModalOpen(true);
  const closeContactUsModal = () => setIsContactUsModalOpen(false);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          padding: "15px 0 0 0",
        }}
      >
        <Container>
          <Toolbar>
            <HeaderMenu openContactUsModal={openContactUsModal} />

            <DropdownMenu openContactUsModal={openContactUsModal} />
          </Toolbar>
        </Container>
      </AppBar>

      <ContactUsModal isOpen={isContactUsModalOpen} closeModal={closeContactUsModal} />

      <Container sx={{ marginTop: "24px" }}>
        <Outlet />
      </Container>
    </>
  );
};

const HeaderMenu = ({ openContactUsModal }: MenuProps) => {
  const [aboutUsAnchor, setAboutUsAnchor] = useState<HTMLButtonElement | null>(null);
  const handleAboutUsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAboutUsAnchor(event.currentTarget);
  };
  const handleAboutUsClose = () => {
    setAboutUsAnchor(null);
  };
  const isAboutUsOpen = Boolean(aboutUsAnchor);

  const optionButtonAppearance = {
    my: 2,
    color: "black",
    display: "block",
    maxWidth: "175px",
    alignSelf: "center",
  };

  const NavBarMenuOption = (label: string, toPage: string) => (
    <Button component={Link} to={toPage} sx={optionButtonAppearance}>
      {label}
    </Button>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexGrow: 1,
          margin: "0 16px",
        }}
      >
        {NavBarMenuOption("Home", "/")}
        {NavBarMenuOption("Cities", "/artists")}
        {NavBarMenuOption("Festivals", "/festivals")}
        {/* {NavBarMenuOption("Explore", "/explore")} */}
        <Button sx={optionButtonAppearance} onClick={handleAboutUsClick}>
          Contact me
        </Button>
        <Popover
          open={isAboutUsOpen}
          anchorEl={aboutUsAnchor}
          onClose={handleAboutUsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <AboutUsContents />
        </Popover>
      </Box>

      <ProfileMenuOption />
    </>
  );
};

const ProfileMenuOption = () => {
  const { isLoggedIntoSpotify } = useSpotifyAuth();

  const SignInButton = (
    <Button
      onClick={() => redirectToAuth()}
      variant="contained"
      sx={{
        ...primaryButtonColours,
        width: "150px",
        height: "48px",
        alignSelf: "center",
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
      <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
    </Button>
  );

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexGrow: 0,
        color: COLOURS.black,
      }}
    >
      {isLoggedIntoSpotify ? <ProfileMenu /> : SignInButton}
    </Box>
  );
};

const DropdownMenu = ({ openContactUsModal }: MenuProps) => {
  const { isLoggedIntoSpotify } = useSpotifyAuth();
  const [navMenuAnchor, setNavMenuAnchor] = useState<null | HTMLElement>(null);
  const [aboutUsAnchor, setAboutUsAnchor] = useState<HTMLButtonElement | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchor(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setNavMenuAnchor(null);
  };
  const handleAboutUsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAboutUsAnchor(event.currentTarget);
  };
  const handleAboutUsClose = () => {
    setAboutUsAnchor(null);
  };
  const isAboutUsOpen = Boolean(aboutUsAnchor);

  const optionButtonAppearance = {
    color: COLOURS.black,
    margin: { xs: "4px 4px", md: "0px 4px" },
  };

  const accountButtonAppearance = {
    width: "140px",
    height: "45px",
    alignSelf: "center",
    margin: "15px 30px 10px 30px",
  };

  const NavBarDropdownMenuOption = (label: string, toPage: string) => (
    <Button onClick={handleCloseNavMenu} component={Link} to={toPage} sx={optionButtonAppearance}>
      {label}
    </Button>
  );

  const SignInButton = (
    <Button
      onClick={() => redirectToAuth()}
      variant="contained"
      sx={{
        ...accountButtonAppearance,
        ...primaryButtonColours,
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
      <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
    </Button>
  );

  const SignOutButton = (
    <Button
      variant="contained"
      onClick={logOut}
      sx={{
        ...accountButtonAppearance,
        ...secondaryButtonColours,
      }}
    >
      Sign Out
    </Button>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", md: "none" },
        justifyContent: "right",
      }}
    >
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="primary"
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={navMenuAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(navMenuAnchor)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
          }}
        >
          {NavBarDropdownMenuOption("Home", "/")}
          {NavBarDropdownMenuOption("Cities", "/artists")}
          {NavBarDropdownMenuOption("Festivals", "/festivals")}
          {/* {NavBarDropdownMenuOption("Explore", "/explore")} */}

          <Button
            sx={optionButtonAppearance}
            onClick={handleAboutUsClick}
          >
            Contact me
          </Button>
          <Popover
            open={isAboutUsOpen}
            anchorEl={aboutUsAnchor}
            onClose={handleAboutUsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <AboutUsContents />
          </Popover>

          {isLoggedIntoSpotify ? SignOutButton : SignInButton}
        </Box>
      </Menu>
    </Box>
  );
};

export default Navbarr;
