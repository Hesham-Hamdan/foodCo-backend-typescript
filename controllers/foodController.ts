import { Request, Response } from "express";
import foodModel from "../models/foodModel.ts";
import { v2 as cloudinary } from "cloudinary";

const addFood = async (req: Request, res: Response): Promise<void> => {
  // Multer adds 'file' to req
  const imageFile = req.file;
  if (!imageFile) {
    res.json({ success: false, message: "No image uploaded" });
    return;
  }

  const imageUrl = imageFile.path;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: imageUrl,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      res.json({ success: false, message: "Food not found" });
      return;
    }

    // --- DELETE IMAGE FROM CLOUDINARY ---
    const imageUrl = food.image;
    // Extract Public ID safely
    const urlParts = imageUrl.split("/");
    const lastPart = urlParts.pop();
    if (lastPart) {
      const imagePublicId = lastPart.split(".")[0];
      await cloudinary.uploader.destroy(`food-images/${imagePublicId}`);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };
