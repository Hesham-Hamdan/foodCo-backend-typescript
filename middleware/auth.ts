import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request interface to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.headers;

  if (!token) {
    res.json({
      success: false,
      message: "Not Authorized. Please Login Again",
    });
    return;
  }

  // Ensure JWT_SECRET is defined
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is missing");
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }

  try {
    // Cast the decoded token to a type that has 'id'
    const token_decode = jwt.verify(token as string, secret) as jwt.JwtPayload;
    req.userId = token_decode.id;
    next();
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authMiddleware;
