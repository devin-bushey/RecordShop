import { useEffect, useState } from "react";
import { GigCard } from "./GigCard";
import { COLOURS, PageClassName } from "../theme/AppStyles";
import { Gig } from "../types/Gig";
import { Grid, Container, Typography, Button } from "@mui/material";
import { Loading } from "../pages/Loading";

const LOAD_INTERVAL = 10;

export const GigList = ({
  gigs,
  isQueryLoading,
  cardColours,
  pageClassName,
}: {
  gigs: Gig[] | undefined;
  isQueryLoading: boolean;
  cardColours?: string[];
  pageClassName?: PageClassName;
}) => {
  const colors = cardColours ? cardColours : COLOURS.card_colours;
  const [displayedGigs, setDisplayedGigs] = useState<Gig[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);

  useEffect(() => {
    setDisplayedGigs(gigs?.slice(0, LOAD_INTERVAL) ?? []);
    setShowMore(gigs ? gigs.length > LOAD_INTERVAL : false);
  }, [gigs]);

  const handleLoadMore = () => {
    if (gigs) {
      const gigsToShow = gigs.slice(0, displayedGigs.length + LOAD_INTERVAL);
      if (gigs.length - gigsToShow.length === 0) {
        setShowMore(false); // Hide the "Load More" button if there are no more gigs to load
      }
      setDisplayedGigs(gigsToShow);
    }
  };

  if (isQueryLoading) {
    return <Loading />;
  } else if (!gigs?.length) {
    return (
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "8px" }}>
          We couldn&#39;t find any events that match your search.
        </Typography>
      </Container>
    );
  } else {
    return (
      <>
        <Grid
          container
          justifyContent={{ xs: "center", sm: "space-between" }}
          rowSpacing={{ xs: 2, md: 3 }}
          columnSpacing={{ sm: 2, md: 3 }}
        >
          {displayedGigs.map((gig: Gig, index: number) => (
            <Grid item xs={12} sm={6} key={gig._id} display="flex" justifyContent="center">
              <GigCard gig={gig} bgcolor={colors[index % colors.length]} pageClassName={pageClassName} />
            </Grid>
          ))}
        </Grid>

        {showMore && (
          <Button className="load-more-button" variant="outlined" sx={{ marginTop: "32px", marginBottom: "32px" }} onClick={handleLoadMore}>
            Load More
          </Button>
        )}
      </>
    );
  }
};
