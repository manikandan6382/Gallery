import express from "express";
import {
  getImages,
  uploadImage,
  deleteImage,
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/:folder", getImages);
router.post("/:folder", uploadImage);
router.delete("/:public_id", deleteImage);

export default router;
