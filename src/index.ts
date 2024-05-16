import express from "express";
import { config } from "dotenv";
import { dbConnect } from "./db";
import cors from "cors";
import router from "./routes";
import cookies from "cookie-parser";
import bodyParser from "body-parser";
import formidable from "express-formidable";

config();
dbConnect();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formidable());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(cookies());

app.use("/api/v1/", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
