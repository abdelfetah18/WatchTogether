import { addData, clearDatabase, getData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var user_info = req.user_info.data;
        var { name,desciprtion,privacy,password } = req.body;
        var rooms_with_same_name = await getData('*[_type=="room" && name==$name]',{ name });
        if(rooms_with_same_name.length > 0){
            res.status(200).json({
                status:"error",
                message:"room name already exists!"
            });
        }else{
            var member_doc = { _type:"member",user:{ _type:"reference", _ref:user_info.user_id },permissions:["control_video_player","remove_members","edit_room_info"] };
            var member = await addData(member_doc);
            var doc = { _type:"room",name,creator:{ _type:"reference",_ref:user_info.user_id },admin:{ _type:"reference",_ref:user_info.user_id },members:[{ _type:"reference",_ref:member._id }],desciprtion,privacy,password };
            var result = await addData(doc);
            res.status(200).json({ status:"success", data:result });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  