import { useState } from "react";
import { Box, Button, Card, CardMedia, Grid, Typography } from "@mui/material";
import { Gig } from "../../../types/Gig";
import { Spinner } from "../../../components/Spinner";
import { SpotifyPreviewModal } from "../../../Rifflandia/SpotifyPreviewModal";
import spotifyLogoBlack from "../../../spotifyLogos/Spotify_Logo_RGB_Black.png";
import { Loading } from "../../../pages/Loading";


interface LampPostGigListProps {
  gigs: Gig[] | undefined;
  isQueryLoading: boolean;
}

export const LampPostGigList = ({ gigs, isQueryLoading }: LampPostGigListProps) => {
  const [visibleGigs, setVisibleGigs] = useState(12);
  const [spotifyPreviewArtistId, setSpotifyPreviewArtistId] = useState<string | undefined>(undefined);

  const loadMore = () => {
    setVisibleGigs((prev) => prev + 12);
  };

  // Format date to "MMM d, yyyy" (e.g., "Jan 1, 2025")
  const formatDate = (dateString: string) => {
    const dateUnformatted = new Date(dateString);
    const utcDate = new Date(Date.UTC(
      dateUnformatted.getUTCFullYear(),
      dateUnformatted.getUTCMonth(),
      dateUnformatted.getUTCDate()
    ));
    
    return utcDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  // Get day of week
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  };

  if (isQueryLoading) {
    return <Loading />;
  }

  if (!gigs || gigs.length === 0) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", my: 4 }}>
        No upcoming shows found.
      </Typography>
    );
  }

  const displayedGigs = gigs.slice(0, visibleGigs);

  return (
    <>
      <Box>
        <Grid container spacing={3}>
          {displayedGigs.map((gig, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${gig.artist.id}-${index}`}>
              <Card 
                elevation={0} 
                className="event-card"
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  bgcolor: '#F9F0F0',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                {/* Spotify Logo and Listen Button */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: { xs: 1.5, sm: 2 },
                  borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <img 
                    src={spotifyLogoBlack} 
                    alt="Spotify" 
                    style={{ 
                      height: '24px',
                      width: 'auto'
                    }} 
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setSpotifyPreviewArtistId(gig.artist.id)}
                    sx={{
                      bgcolor: "#FFC107",
                      color: "#000",
                      "&:hover": {
                        bgcolor: "#e0aa00",
                      },
                      textTransform: "uppercase",
                      fontWeight: 600,
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      padding: '6px 16px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Listen
                  </Button>
                </Box>
                
                {/* Artist Image */}
                <CardMedia
                  component="img"
                  sx={{ 
                    height: { xs: '200px', sm: '240px', md: '270px' },
                    objectFit: "cover",
                    objectPosition: 'center'
                  }}
                  image={gig.artist.albumArtUrl}
                  alt={gig.artist.name}
                />
                
                {/* Content */}
                <Box sx={{ 
                  p: { xs: 2, sm: 2.5, md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  textAlign: 'left'
                }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                    {getDayOfWeek(gig.date)}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {formatDate(gig.date)}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1.5,
                      fontSize: { xs: '1.25rem', sm: '1.4rem', md: '1.5rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {gig.artist.name}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0,
                      color: '#555',
                      fontWeight: 500
                    }}
                  >
                    {gig.venue}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {visibleGigs < (gigs?.length || 0) && (
          <Box sx={{ display: "flex", justifyContent: "center", }}>
            <Button 
              onClick={loadMore} 
              variant="outlined" 
              className="load-more-button"
              sx={{
                borderColor: "#FFC107",
                color: "#000",
                "&:hover": {
                  borderColor: "#FFC107",
                  bgcolor: "rgba(255, 193, 7, 0.1)",
                },
                textTransform: "uppercase",
                fontWeight: 600,
                borderRadius: "50px",
                padding: "8px 24px",
                marginTop: "32px",
                marginBottom: { xs: '100px', sm: '100px', md: '130px' }
              }}
            >
              More
            </Button>
          </Box>
        )}
      </Box>
      <SpotifyPreviewModal artistId={spotifyPreviewArtistId} setArtistId={setSpotifyPreviewArtistId} />
    </>
  );
}; 

