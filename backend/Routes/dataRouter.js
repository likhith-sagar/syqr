const { Router } = require("express");
const dataController = require("../Controllers/dataController");
const authVerify = require("../Middlewares/authVerify");

const dataRouter = Router();

dataRouter.get("/api/getData", authVerify, dataController.getData);
dataRouter.post("/api/createqr", authVerify, dataController.createQr);
dataRouter.post("/api/deleteqr", authVerify, dataController.deleteQr);
dataRouter.post("/api/updateqr", authVerify, dataController.updateQr);

module.exports = dataRouter;
