import express from "express";
import { config } from "dotenv";
import cors from "cors";
import router from "./routes";
import cookies from "cookie-parser";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(cookies());

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});
app.use("/api/v1/", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
