import jwt from "jsonwebtoken";
import { config } from "../config.js";
import * as authData from "../data/auth/auth.data.js";

export async function isAuth(req, res, next) {
  let token;
  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    token = req.cookies["token"];
  }

  if (!token) {
    console.log("no token");
    return res.sendStatus(401);
  }

  jwt.verify(token, config.jwt.screatKey, async (err, decode) => {
    if (err) {
      console.error(err);
      console.log(`${token} is invalid token`);
      return res.sendStatus(401);
    }
    const user = await authData.findById(decode.id);
    if (!user) {
      console.log("no user");
      return res.sendStatus(401);
    }
    req.email = user.email;
    req.userId = user.id;
    req.token = token;
    next();
  });
}
