import { addData, clearDatabase, deleteData, getData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var user_info = req.user_info.data;
        var { room_id } = req.body;
        var room = await getData('*[_type=="room" && _id==$room_id && admin->_id==$user_id ]',{ room_id,user_id:user_info.user_id });
        if(room.length > 0){
            var result = await deleteData(room_id);
            res.status(200).json({
                status:"success",
                message:"deleted successfuly!",
                result
            });
        }else{
            res.status(200).json({
                status:"error",
                message:"you are not allowed!"
            });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  