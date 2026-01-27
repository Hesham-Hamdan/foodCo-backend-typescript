import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.ts";

const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string);
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = createToken(user._id as string);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, password, email } = req.body;

  try {
    // checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      res.json({ success: false, message: "User already exists" });
      return;
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      res.json({ success: false, message: "Please enter a valid email" });
      return;
    }

    if (password.length < 8) {
      res.json({
        success: false,
        message: "Please enter a strong password",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id as string);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
