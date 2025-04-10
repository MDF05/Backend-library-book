import { Router } from "express";
import { getAllMembers } from "../controllers/member.controller";

const router = Router();

router.get("/", getAllMembers);

export default router;
