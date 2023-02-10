import express from "express";

import fs from "fs";

import uniqid from "uniqid";

import path, { dirname } from "path";

import { fileURLToPath } from "url";

import Users from "./schema.js";
import Accomodation from "../accomodations/schema.js";

import basicMiddleware from "../utils/auth/basic.js";
import { jwtMiddleware } from "../utils/auth/jwt.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const usersFilePath = path.join(__dirname, "users.json");

const router = express.Router();

// get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await Users.find({});
    res.send(users);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// router.get("/me/stories", basicMiddleware, async (req, res, next) => {
router.get("/me/accomodations", jwtMiddleware, async (req, res, next) => {
  if (req.user.role !== "host") {
    const error = new Error("You have not registered yet.");
    error.status = 403;
    res.status(403).send(error);
    next(error);
  } else {
    try {
      console.log("REQ THAT /me/stories GET:", req);
      const posts = await Accomodation.find({ user: req.user._id.toString() });

      res.status(200).send(posts);
    } catch (error) {
      next(error);
    }
  }
});

// get single users
router.get("/:id", async (req, res, next) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      res
        .status(404)
        .send({ message: `user with ${req.params.id} is not found!` });
    } else res.send(user);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// delete  user
router.delete("/:id", async (req, res, next) => {
  try {
    const user = Users.findById(req.params.id);
    if (!user) {
      res
        .status(404)
        .send({ message: `user with ${req.params.id} is not found!` });
    }
    await Users.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  update user
router.put("/:id", async (req, res, next) => {
  try {
    const changeduser = await users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(changeduser);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default router;
