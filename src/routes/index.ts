import { Router } from "express";
import templateRoutes from "./templates";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).send("ok");
});

router.use("/template", templateRoutes);

export default router;
