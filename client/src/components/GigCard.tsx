import { Card, Typography, CardMedia, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Artist, Gig } from "../types/Gig";
import { useAdjustFontSize } from "../hooks/useAdjustFontSize";
import spotifyLogoBlack from "../spotifyLogos/Spotify_Logo_RGB_Black.png";
import { useState } from "react";
import { SpotifyPreviewModal } from "../Rifflandia/SpotifyPreviewModal";
import { BioModal } from "./BioModal";
import { PageClassName } from "../theme/AppStyles";

export const GigCard = ({
  gig,
  bgcolor,
  pageClassName,
}: {
  gig: Gig;
  bgcolor: string;
  pageClassName?: PageClassName;
}) => {
  const [spotifyPreviewArtistId, setSpotifyPreviewArtistId] = useState<string | undefined>();
  const [artist, setArtist] = useState<Artist | undefined>();

  return (
    <>
      <Card
        sx={{
          backgroundColor: bgcolor,
          maxWidth: "400px",
          width: "100%",
          alignItems: "center",
          marginBottom: "0",
        }}
        className="gig-card"
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SpotifyLogoLong />
          <Box sx={{ marginTop: "-4px", marginRight: "-12px" }}>
            {gig.artist.bio && (
              <Button
                sx={{ scale: "70%", marginRight: "-12px" }}
                variant="outlined"
                onClick={() => setArtist(gig.artist)}
              >
                Bio
              </Button>
            )}
            <Button
              sx={{ scale: "70%", padding: "4px 12px" }}
              variant="outlined"
              onClick={() => setSpotifyPreviewArtistId(gig.artist.id)}
            >
              Listen
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <SpotifyAlbumArt image={gig.artist.albumArtUrl} />
          <Box sx={{ alignItems: "center", textAlign: "left" }}>
            <SpotifyGigName name={gig.artist.name} />
            <Description gig={gig} />
          </Box>
        </Box>
      </Card>
      <SpotifyPreviewModal artistId={spotifyPreviewArtistId} setArtistId={setSpotifyPreviewArtistId} />
      <BioModal artist={artist} setArtist={setArtist} pageClassName={pageClassName} />
    </>
  );
};

const SpotifyLogoLong = () => (
  <Box sx={{ display: "flex", alignItems: "left" }}>
    <img
      src={spotifyLogoBlack}
      alt="spotify_logo"
      width="75px"
      height="22.48px"
      style={{ marginBottom: "12px" }}
      loading="lazy"
    />
  </Box>
);

const SpotifyAlbumArt = ({ image }: { image: string }) => (
  <CardMedia
    component="img"
    sx={{
      display: "inline-block",
      width: 60,
      height: 60,
      marginRight: "12px",
    }}
    image={image}
    alt="Album"
  />
);

const SpotifyGigName = ({ name }: { name: string }) => {
  const containerRef = useAdjustFontSize();
  return (
    <div ref={containerRef}>
      <Typography sx={{ fontSize: "16px", fontWeight: "700" }}>{name}</Typography>
    </div>
  );
};

const Description = ({ gig }: { gig: Gig }) => {
  // Parse the UTC date and force it to be treated as UTC
  const dateUnformatted = new Date(gig.date);
  const utcDate = new Date(Date.UTC(
    dateUnformatted.getUTCFullYear(),
    dateUnformatted.getUTCMonth(),
    dateUnformatted.getUTCDate()
  ));
  
  const date = utcDate.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric",
    timeZone: 'UTC' // Force UTC interpretation
  });
  
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: "700",
          fontSize: "0.77rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "4",
          WebkitBoxOrient: "vertical",
        }}
      >
        {date} at {gig.venue}
      </Typography>
    </Box>
  );
};
