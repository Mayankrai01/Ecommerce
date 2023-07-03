import express from "express";
import catetgoryFileUpload from "../config/categoryUpload.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} from "../controllers/categoriesCtrl.js";
const categoriesRouter = express.Router();
categoriesRouter.post(
  "/",
  isLoggedIn,
  catetgoryFileUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.delete("/:id",isLoggedIn, deleteCategoryCtrl);
categoriesRouter.put("/:id",isLoggedIn, updateCategoryCtrl);
export default categoriesRouter;