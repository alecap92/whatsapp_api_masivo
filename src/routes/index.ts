import { Router } from "express";
import userRoutes from "./user";
import { verifyToken } from "../auth/user";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).send("ok");
});

router.use("/user", userRoutes);
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).send("ok");
});

export default router;
