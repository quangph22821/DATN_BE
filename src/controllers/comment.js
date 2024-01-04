import comment from "../models/comment"

export const getCommentALL= async(req,res)=>{
        try{
            const comments=await comment.find().populate("productId").populate("userId")
            console.log(comments);
            if(comments.length === 0){
                return res.status(400).json({
                    message:"không tìm thấy dữ liệu"
                })
            }
            return res.status(200).json({
                message:"bạn đã lấy thành công",
                comments
            })
        }catch (error) {
            // return res.status(500).json({
            //     message: error,
            // });
        }
}
export const getCommentOneId= async(req,res)=>{
    console.log(req.params.id);
    try{
        const commentId = await comment.findById(req.params.id)
        console.log(req.params.id);
        if(!commentId){
            res.status(404).json({
                message:"không có dữ liệu"
            })
        }
        return res.json({
            message:"bạn lấy 1 id thành công",
            commentId
        })
    }catch{

    }
}