import { serverConfig } from "@/config";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, serverConfig.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export default generateToken;
