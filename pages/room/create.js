import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { FaCamera } from "react-icons/fa";
import Profile from "../../Components/Profile";
import { getData } from "../../database/client";

export async function getServerSideProps({ req, query }){
    var user_info = req.user_info;
    var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image->asset.url }[0]',{ user_id:user_info.data.user_id });
    
    return {
        props:{
            _user
        }
    }
}

export default function Create({ _user }){
    var [name,setName] = useState("");
    var [description,setDescription] = useState("");
    const [access_token, setAccessToken, removeAccessToken] = useCookies(['access_token']);

    function createRoom(){
        axios.post("/api/room/create",{ name,description },{
            headers:{
                authorization:access_token
            }
        }).then((response) => {
            if(response.data.status == "success"){
                console.log(response.data);
            }else{
                console.log(response.data);
            }
        })
    }

    return(
        <div className="h-screen w-screen flex flex-col items-center bg-gray-900">
            <Profile user={_user} />
            <div className="w-1/2 flex-grow flex flex-col items-center my-5">
                <div className="w-40 h-40 flex flex-col items-center m-4 relative">
                    <img className="h-40 w-40 rounded-full object-cover" src="/user.png" />
                    <div className="absolute bottom-4 right-2 bg-blue-500 p-2 rounded-full cursor-pointer">
                        <FaCamera className="text-white" />
                    </div>
                </div>
                <input className="my-2 rounded px-4 py-2 w-1/2" onChange={(evt) => setName(evt.target.value)} value={name} placeholder="room name" />
                <input className="my-2 rounded px-4 py-2 w-1/2" onChange={(evt) => setDescription(evt.target.value)} value={description} placeholder="room description" disabled/>
                <div className="w-11/12 flex flex-col items-center my-4">
                    <div onClick={createRoom} className="text-white font-semibold bg-blue-500 px-4 py-1 cursor-pointer rounded">Next</div>
                </div>
            </div>
        </div>
    )
}