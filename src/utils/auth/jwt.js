import jwt from "jsonwebtoken";
import userModel from "../../users/schema.js";
// we want to generate jwt tokens when we are authenticating one of our users

//1. func to generate jwt

export function generateJwt(payload) {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}
export function verifyJwt(token) {
  console.log(token);
  return new Promise(function (resolve, reject) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
export async function jwtMiddleware(req, res, next) {
  try {
    if (!req.headers.authorization) {
      const error = new Error("bruh");
      error.status = 401;
      next(error);
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");
      console.log("TOKEN LINE 36", token);
      const decoded = await verifyJwt(token);
      console.log("DECODED", decoded);
      const user = await userModel.findById(decoded.id);
      console.log("USER WE ARE APPENDING:", user); //null

      req.user = user;

      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//2. Verify JWT tokens when we are checking incoming requests.
