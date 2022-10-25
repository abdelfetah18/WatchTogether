import { useEffect } from "react";
import { verifyToken } from "../../crypto-keys";
import { addData, addMemberToRoom, getData } from "../../database/client";

export async function getServerSideProps(ctx){
    const token = ctx.query.token;
    var is_valid = await verifyToken(token);
    if(is_valid && is_valid.payload.type === "invite"){
        var room_id = is_valid.payload.data.room_id;
        var user_info = ctx.req.user_info.data;
        var room = await getData('*[_type=="room" && _id==$room_id && !($user_id in members[]->user->_id)]',{ room_id, user_id:user_info.user_id });
        if(room.length > 0){
            var member = { _type:"member",user:{ _type:"reference",_ref:user_info.user_id },permissions:["control_video_player","remove_members","edit_room_info"]};
            var createMember = await addData(member);
            var addMember = await addMemberToRoom(room_id,createMember._id);
            return {
                redirect: {
                    destination: '/room/'+room_id,
                    permanent: false
                }
            }
        }else{
            return {
                props:{ status:"error",message:"room not found or you already in!" }
            }
        }
        
    }else{
        return {
            redirect: {
                destination: '/my_profile',
                permanent: false
            }
        }
    }
    
}
    

  export default function Invite({ user, status, message }){
    useEffect(() => {
        setTimeout(() => window.location.href = "/my_profile",3000);
    },[]);
    return(
        <div className="w-screen h-screen flex flex-row items-center justify-center">
            <div className="font-mono text-lg font-bold text-red-500 px-4">{status}:</div>
            <div className="font-mono text-lg font-semibold">{message}</div>
        </div>
    )
}