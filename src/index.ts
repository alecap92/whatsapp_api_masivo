import express from "express";
import { config } from "dotenv";
import { dbConnect } from "./db";
import cors from "cors"; 
import router from "./routes";
import cookies from "cookie-parser";


config();
dbConnect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(cookies());

app.use("/api/v1/", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
