import { Response } from "express";
import userModel from "../models/userModel.ts";
import { AuthRequest } from "../middleware/auth.ts";

const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // userId is guaranteed by middleware, but TS might check optionality
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    const cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    // We must pass { minimize: false } or mark cartData as modified usually,
    // but update query handles this cleanly:
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFromCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    const cartData = userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      res.json({ success: false, message: "User not found" });
      return;
    }
    const cartData = userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, getCart, removeFromCart };
