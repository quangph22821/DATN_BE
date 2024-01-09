import express  from "express"
import { commentAdd, getCommentALL, getCommentOneId, getDelete } from "../controllers/comment";

const router= express.Router();
router.post('/comment/add', commentAdd);
router.get('/comment',getCommentALL);
router.get('/comment/:id',getCommentOneId)
router.delete('/comment/:id',getDelete)
export default router