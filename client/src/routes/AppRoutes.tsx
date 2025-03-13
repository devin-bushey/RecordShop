import { Routes, Route } from "react-router-dom";
import WelcomePage from "../pages/WelomePage";
import Navbarr from "../components/Navbar";
import NotFound from "../pages/NotFound";
import { Box } from "@mui/material";
import { ArtistsPage } from "../pages/ArtistsPage";
import { FestivalPage } from "../pages/FestivalPage";
import useAnalytics from "../hooks/useAnalytics";
import { Rifflandia } from "../Rifflandia/pages/Rifflandia";
import { PachenaBay } from "../festivals/PachenaBay/PachenaBay";
import { PhillipsBackyard } from "../festivals/PhillipsBackyard/PhillipsBackyard";
import { PhillipsBackyard2024 } from "../festivals/PhillipsBackyard2024/PhillipsBackyard2024";
import { LaketownShakedown } from "../festivals/LaketownShakedown/LaketownShakedown";
import { Rifflandia2024 } from "../festivals/Rifflandia2024/Rifflandia2024";
import { LampPost } from "../festivals/LampPost/LampPost";
import { SaltyHearts2025 } from "../festivals/LaketownShakedown copy/SaltyHearts2025";

export const AppRoutes = () => {
  useAnalytics();
  return (
    <>
      <Box sx={{ minHeight: "calc(100vh - 46px)" }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={<WelcomePage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/festivals" element={<FestivalPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/rifflandia" element={<Rifflandia />} />
          <Route path="/pachenabay" element={<PachenaBay />} />
          <Route path="/phillipsbackyard" element={<PhillipsBackyard />} />
          <Route path="/phillipsbackyard2024" element={<PhillipsBackyard2024 />} />
          <Route path="/laketownShakedown" element={<LaketownShakedown />} />
          <Route path="/rifflandia2024" element={<Rifflandia2024 />} />
          <Route path="/lamppost" element={<LampPost />} />
          <Route path="/saltyhearts2025" element={<SaltyHearts2025 />} />
        </Routes>
      </Box>
    </>
  );
};
