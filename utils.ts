import jwt from "jsonwebtoken";
export const generateToken = (user: any) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req: any, res: any, next: any) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      // @ts-ignore
      process.env.JWT_SECRET,
      (err, decode: any) => {
        console.log({ decode });
        if (err) {
          res.status(401).send({ code: 401, messege: "Invalid Token" });
        } else if (!decode?.isAdmin) {
          res.status(401).send({ code: 401, messege: "Unauthorized User!" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ code: 401, messege: "No Token" });
  }
};
