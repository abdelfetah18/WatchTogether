import { addData, clearDatabase, getData, updateData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var user_info = req.user_info.data;
        var { room_id,name,desc,profile_image } = req.body;
        console.log(user_info,req.body)
        var room = await getData('*[_type=="room" && $user_id == admin->_id && _id == $room_id]',{ user_id:user_info.user_id,room_id });
        if(room.length > 0){
            var new_doc = { name,profile_image: { _type: 'image', asset: { _type: "reference", _ref: profile_image._id }} };
            var result = await updateData(room[0]._id,new_doc);
            res.status(200).json({
                status:"success",
                message:"room data edited successfully!",
                data: result
            });
        }else{
            res.status(200).json({
                status:"error",
                message:"you are not the admin!"
            });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  