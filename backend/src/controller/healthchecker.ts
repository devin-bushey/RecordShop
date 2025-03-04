import { Router } from "express";
import { ResponseUtils } from "../utils/responseUtils";

const router = Router({});

router.get("/", async (_req, res) => {
  try {
    const healthcheck = {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };
    res.status(200).json(ResponseUtils.success(healthcheck));
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json(ResponseUtils.error("Service unavailable"));
  }
});

// export router with all routes included
export default router;
