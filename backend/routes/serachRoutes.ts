import { Router } from "express";
import { searchItems } from "../controllers/searchController"

const router = Router();

router.get("/", searchItems);

export default router;