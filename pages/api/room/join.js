import { addData, addMemberToRoom, clearDatabase, getData, updateData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var user_info = req.user_info.data;
        var { room_id } = req.body;
        var room = await getData('*[_type=="room" && _id==$room_id]',{ room_id });
        if(room.length > 0){
            var member = { _type:"member",user:{ _type:"reference",_ref:user_info.user_id },permissions:["control_video_player","remove_members","edit_room_info"]};
            var createMember = await addData(member);
            var addMember = await addMemberToRoom(room_id,createMember._id);
            res.status(200).json({
                status:"succcess",
                message:"new members!",
                addMember
            });
        }else{
            res.status(200).json({
                status:"error",
                message:"room not exists!"
            });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  