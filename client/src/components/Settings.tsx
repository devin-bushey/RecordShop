import { Typography, Slider, Link, Grid, Box } from "@mui/material";
import { SpotifyColour } from "../theme/AppStyles";
import { SpotifyIcon } from "./Icons";

type SettingsProps = {
  numTopTracks: number;
  setNumTopTracks: (numTopTracks: number) => void;
  iconColour?: SpotifyColour;
  customSettings?: Array<JSX.Element>;
};

export const Settings = ({ numTopTracks, setNumTopTracks, iconColour, customSettings }: SettingsProps) => {
  const marks = [];
  for (let i = 1; i <= 5; i++) {
    marks.push({
      value: i,
      label: `${i}`,
    });
  }

  return (
    <Grid
      container
      className="settings-container"
      justifyContent="center"
      sx={{
        width: "100%",
        margin: "12px 0",
        padding: "24px 32px",
        borderRadius: "16px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        backdropFilter: "blur(8px)",
      }}
      columnGap={6}
      rowGap={4}
    >
      <Grid item xs={12} justifyContent="center">
        <Typography 
          variant="h6" 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 2,
            '& svg': {
              fontSize: '1.5rem'
            }
          }}
        >
          {SpotifyIcon(iconColour)}
          Customize
        </Typography>
      </Grid>

      <Grid item xs={12} sm={5} justifyContent="center">
        <Typography 
          sx={{ 
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.9rem',
            color: '#1a1a1a',
            opacity: 0.8,
            mb: 2,
            textAlign: 'center'
          }}
        >
          Select number of top tracks:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Slider
            aria-label="Number of tracks per artist"
            valueLabelDisplay="auto"
            className="top-tracks-slider"
            step={1}
            marks={marks}
            min={1}
            max={5}
            value={numTopTracks}
            onChange={(_, value) => setNumTopTracks(value as number)}
            sx={{ 
              width: "90%",
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#2196f3',
              },
              '& .MuiSlider-thumb': {
                backgroundColor: '#fff',
                border: '2px solid #2196f3',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(33, 150, 243, 0.16)'
                }
              },
              '& .MuiSlider-mark': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              },
              '& .MuiSlider-markLabel': {
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8rem',
                color: '#1a1a1a',
                opacity: 0.7
              }
            }}
          />
        </Box>
      </Grid>

      {customSettings?.map((setting, i) => (
        <Grid item xs={12} sm={5} justifyContent="center" key={`custom-setting-${i}`}>
          {setting}
        </Grid>
      ))}

      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
        <Link 
          href="/terms-of-use.pdf"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'none'
            }
          }}
        >
          <Typography 
            className="unsubscribe-label"
            sx={{ 
              fontSize: "0.75rem",
              color: '#1a1a1a',
              opacity: 0.5,
              transition: 'opacity 0.2s ease',
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: 'center',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            Terms of Use
          </Typography>
        </Link>
        <Link 
          href="https://www.spotify.com/account/apps"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'none'
            }
          }}
        >
          <Typography 
            className="unsubscribe-label"
            sx={{ 
              fontSize: "0.75rem",
              color: '#1a1a1a',
              opacity: 0.5,
              transition: 'opacity 0.2s ease',
              fontFamily: "'JetBrains Mono', monospace",
              textAlign: 'center',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            Unsubscribe
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
};
