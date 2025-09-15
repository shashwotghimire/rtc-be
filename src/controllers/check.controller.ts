import { Request, Response } from "express";

export const check = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "check" });
};