import express from "express";
import basicMiddleware from "../utils/auth/basic.js";
import { jwtMiddleware } from "../utils/auth/jwt.js";
import onlyOwner from "../utils/auth/onlyOwner.js";
import accomodations from "./schema.js";
import {
  checkAccomodationSchema,
  checkCommentSchema,
  checkValidationResult,
} from "./validation.js";

const router = express.Router();

// get all accomodations
router.get("/", async (req, res, next) => {
  try {
    const accomodations = await accomodations.find({}).populate({
      path: "User",
      select: "name surname avatar",
    });
    res.send(accomodations);
  } catch (error) {
    console.log({ error });
    res.send(500).send({ message: error.message });
  }
});

// create  accomodation
router.post(
  "/",
  jwtMiddleware,
  (req, res, next) => {
    req.body.user = req.user._id.toString();
    next();
  },
  checkAccomodationSchema,
  checkValidationResult,

  async (req, res, next) => {
    if (req.user.role !== "host") {
      res.send(403).send("You are not allowed to post as a guest.");
    } else {
      try {
        const accomodation = await new accomodations(req.body).save();
        res.status(201).send(accomodation);
      } catch (error) {
        console.log(error);
        res.send(500).send({ message: error.message });
      }
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const accomodation = await accomodations.findById(req.params.id).populate({
      path: "User",
      select: "name surname avatar",
    });
    if (!accomodation) {
      res
        .status(404)
        .send({ message: `accomodation with ${req.params.id} is not found!` });
    } else {
      res.send(accomodation);
    }
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// delete  accomodation
router.delete("/:id", jwtMiddleware, onlyOwner, async (req, res, next) => {
  try {
    const accomodation = req.accomodation;

    if (!accomodation) {
      res
        .status(404)
        .send({ message: `accomodation with ${req.params.id} is not found!` });
    } else {
      await accomodations.findByIdAndDelete(req.params.id);
      res.status(204).send();
    }
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  update accomodation
router.put("/:id", async (req, res, next) => {
  try {
    const updated = await accomodations.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(updated);
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

export default router;
