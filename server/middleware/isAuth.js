import jwt from "jsonwebtoken";
import { config } from "../config.js";
import * as authData from "../data/auth.data.js";

const authError = { message: "authentication error" };

export async function isAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer"))) {
    return res.status(401).json(authError);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.jwt.screatKey, async (err, decode) => {
    if (err) {
      return res.sendStatus(401);
    }
    const user = await authData.findById(decode.id);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user_id = user.id;
    req.token = token;
    next();
  });
}
