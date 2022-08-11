import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { generateToken } from '../utils';

const userRouter = express.Router();

userRouter.post('/signin', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    console.log({ user })

    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
            return;
        }
    }
    res.status(401).send({ message: "Email or Password is not valid!" })
}))

userRouter.post('/signup', expressAsyncHandler(async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    })

    const user = await newUser.save();
    try {
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user)
        });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong!" })
    }
}))

export default userRouter