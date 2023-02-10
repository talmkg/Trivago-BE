import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    surname: { type: String, required: false },
    email: { type: String, required: true },
    role: { type: String, enum: ["guest", "host"], default: "guest" },
    //password
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=Unnamed+User",
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (done) {
  this.avatar = `https://ui-avatars.com/api/?name=${this.name}+${this.surname}`;
  // hash password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  done();
});

// static: find using credentials

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await userModel.findOne({ email });

  try {
    if (await bcrypt.compare(password, user.password)) return user;
  } catch {}

  return null;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
