import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.ts";
import foodRouter from "./routes/foodRoute.ts";
import userRouter from "./routes/userRoute.ts";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.ts";
import orderRouter from "./routes/orderRoute.ts";

const app: Express = express();

app.use(express.json());

const frontendURL = "https://food-co-theta.vercel.app";
const adminURL = "https://foodco-admin.vercel.app";

app.use(
  cors({
    origin: [frontendURL, adminURL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --- DATABASE CONNECTION ---
try {
  connectDB();
  console.log("Database connection initiated successfully.");
} catch (error) {
  console.error("CRITICAL ERROR: Database connection failed.", error);
  app.get("/", (req: Request, res: Response) => {
    res.status(500).send("API failed to connect to the database.");
  });
}

// API endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req: Request, res: Response) => {
  console.log("Root route '/' was hit.");
  res.send("API is Working");
});

// const PORT = 4000;

// app.listen(PORT, () => {
//   console.log(`Server Started on http://localhost:${PORT}`);
// });

export default app;
