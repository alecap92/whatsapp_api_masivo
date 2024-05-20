import { Router } from "express";
import userRoutes from "./user";
import contactRoutes from "./contact";
import templateRoutes from "./templates";
import { verifyToken } from "../auth/user";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).send("ok");
});

router.use("/user", userRoutes);
router.use("/contact", contactRoutes);
router.use("/template", templateRoutes);
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).send(req.user);
});

export default router;
