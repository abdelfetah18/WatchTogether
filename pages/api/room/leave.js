import { addData, clearDatabase, deleteData, getData, removeMemberFromRoom } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var user_info = req.user_info.data;
        var { room_id } = req.body;
        var room = await getData('*[_type=="room" && _id==$room_id && ($user_id in members[]->user->_id) ]{ "member_id":members[_ref in *[_type=="member" && @.user._ref==$user_id]._id][0]->_id }',{ room_id,user_id:user_info.user_id });
        if(room.length > 0){
            var result = await removeMemberFromRoom(room_id,room[0].member_id);
            res.status(200).json({
                status:"success",
                message:"leaved successfuly!",
                data:result,user_info,room_id,room
            });
        }else{
            res.status(200).json({
                status:"error",
                message:"you are not a member!"
            });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  