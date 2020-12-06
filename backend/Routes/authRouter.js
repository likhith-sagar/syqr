const { Router } = require("express");
const authController = require("../Controllers/authController");
const authVerify = require("../Middlewares/authVerify");

const authRouter = Router();

authRouter.get("/api/isLoggedIn",authVerify, authController.isLoggedIn);
authRouter.post("/api/login", authController.logUserIn);
authRouter.post("/api/signup",authController.signUserUp);
authRouter.get("/api/logout", authController.logUserOut);
authRouter.get("/api/deleteuser", authVerify, authController.deleteUser);


module.exports = authRouter;