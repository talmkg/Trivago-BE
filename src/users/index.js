import express from "express";

import fs from "fs";

import uniqid from "uniqid";

import path, { dirname } from "path";

import { fileURLToPath } from "url";

import { parseFile } from "../utils/upload/index.js";

import Users from "./schema.js";
import Blogs from "../blogs/schema.js";

import { generateCSV } from "../utils/csv/index.js";

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

// // get all users export as csv
// router.get("/csv", async (req, res, next) => {
//   try {
//     const fileAsBuffer = fs.readFileSync(usersFilePath);
//     const fileAsString = fileAsBuffer.toString();
//     const fileAsJSON = JSON.parse(fileAsString);
//     if (fileAsJSON.length > 0) {
//       const [first, ...rest] = fileAsJSON;
//       const fields = Object.keys(first);
//       const csvBuffer = generateCSV(fields, fileAsJSON);
//       res.setHeader("Content-Type", "text/csv");
//       res.setHeader(
//         "Content-Disposition",
//         'attachment; filename="users.csv"'
//       );
//       res.send(csvBuffer);
//     } else {
//       res.status(404).send({ message: "there is no one here." });
//     }
//   } catch (error) {
//     res.send(500).send({ message: error.message });
//   }
// });

// router.get("/me/stories", basicMiddleware, async (req, res, next) => {
router.get("/me/stories", jwtMiddleware, async (req, res, next) => {
  try {
    console.log("REQ THAT /me/stories GET:", req);
    const posts = await Blogs.find({ user: req.user._id.toString() });

    res.status(200).send(posts);
  } catch (error) {
    next(error);
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

// router.put(
//   "/:id/avatar",
//   parseFile.single("avatar"),
//   async (req, res, next) => {
//     try {
//       const fileAsBuffer = fs.readFileSync(usersFilePath);

//       const fileAsString = fileAsBuffer.toString();

//       let fileAsJSONArray = JSON.parse(fileAsString);

//       const userIndex = fileAsJSONArray.findIndex(
//         (user) => user.id === req.params.id
//       );
//       if (!userIndex == -1) {
//         res
//           .status(404)
//           .send({ message: `user with ${req.params.id} is not found!` });
//       }
//       const previoususerData = fileAsJSONArray[userIndex];
//       const changeduser = {
//         ...previoususerData,
//         avatar: req.file.path,
//         updatedAt: new Date(),
//         id: req.params.id,
//       };
//       fileAsJSONArray[userIndex] = changeduser;
//       fs.writeFileSync(usersFilePath, JSON.stringify(fileAsJSONArray));
//       res.send(changeduser);
//     } catch (error) {
//       res.send(500).send({ message: error.message });
//     }
//   }
// );

export default router;
