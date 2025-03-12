import { Typography } from "@mui/material";
import { goTo } from "../utils/browserUtils";
import "../styles/RecordShopTitle.css";

export const RecordShopTitle = ({ textColour = "black" }: { textColour?: string }) => (
  <>
    <Typography
      className="record-shop-title"
      sx={{
        fontFamily: "Lobster, cursive",
        letterSpacing: "2px",
        color: textColour,
        cursor: "pointer",
        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3.5rem' },
      }}
      onClick={() => goTo("/")}
    >
      Record Shop
    </Typography>
  </>
);
