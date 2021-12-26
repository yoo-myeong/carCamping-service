import express from "express";
import * as shopMobileController from "../../controller/shop/shop.mobile.controller.js";
import { isAuth } from "../../middleware/isAuth.js";

const router = express.Router();

router.get("/:id", isAuth, shopMobileController.getMobileAccessById);
router.post("/:id", isAuth, shopMobileController.createMobileAccess);

export default router;
