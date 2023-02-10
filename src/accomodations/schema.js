import mongoose from "mongoose";
import Users from "../users/schema.js";

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    location: { type: String, required: true },
    maxGuests: { type: Number, required: false },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Accomodation", schema);

schema.pre("save", async function (done) {
  try {
    const isExist = await Users.findById(this.user);
    if (isExist) {
      done();
    } else {
      const error = new Error("this user does not exist");
      error.status = 400;
      done(error);
    }
  } catch (error) {
    done(error);
  }
});
