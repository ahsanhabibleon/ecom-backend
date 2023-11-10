import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { generateToken, isAuth } from "../utils";

const userRouter = express.Router();

userRouter.get("/", isAuth, async (req, res) => {
  const users = await User.find({});
  if (users) {
    return res.status(201).json({ success: true, data: users });
  } else {
    return res.status(404).json({ success: false, msg: "No Users Found" });
  }
});

userRouter.get("/:id", isAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.status(201).json({ success: true, data: user });
  } else {
    return res.status(404).json({ success: false, msg: "User not found" });
  }
});

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Email or Password is not valid!" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res
        .status(500)
        .send({ message: "User already exists for this email address!" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      });

      const user = await newUser.save();
      try {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
      } catch (error) {
        res.status(500).send({ message: "Something went wrong!" });
      }
    }
  })
);

export default userRouter;
