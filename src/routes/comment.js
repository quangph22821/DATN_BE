import express  from "express"
import { commentAdd, getCommentALL, getCommentOneId, getDelete } from "../controllers/comment";
import { authenticate } from "../middlewares/authenticate";
const router= express.Router();
router.post('/comment/add',authenticate, commentAdd);
router.get('/comment',authenticate,getCommentALL);
router.get('/comment/:id',authenticate,getCommentOneId)
router.delete('/comment/:id',authenticate,getDelete)
export default router