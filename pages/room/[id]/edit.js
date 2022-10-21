import axios from "axios";
import { useRef, useState } from "react";
import { FaAngleLeft, FaCamera } from "react-icons/fa";
import { getData } from "../../../database/client";

export async function getServerSideProps({ req, query }){
    var { id:room_id } = query;
    var user_info = req.user_info.data;
    var room = await getData('*[_type=="room" && _id == $room_id && ($user_id in members[]->user->_id)]{ _id,"profile_image":profile_image.asset->,admin->, creator->, name,"members_count":count(members) }[0]',{ room_id,user_id:user_info.user_id });
    if(room){
      return {
        props:{
          room
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

export default function Edit({ user,room }){
    var imageInput = useRef();
    var [name,setName] = useState(room.name);
    var [desc,setDesc] = useState("");
    var [profile_image,setProfileImage] = useState(room.profile_image);
    var [progress,setProgress] = useState(0);
    var progressBar = useRef();

    function editRoom(){
        axios.post("/api/room/edit",{ room_id:room._id,name,desc,profile_image },{
            headers:{
                authorization: user.access_token
            }
        }).then((res) => {
            if(res.data.status == "success"){
                window.location.href = "/room/"+room._id;
            }else{
                console.log(res.data);
            }
        }).catch((err) => console.log(err));
    }

    function uploadImage(){
        var file = imageInput.current.files[0];
        var form = new FormData();
        form.append("image",file);
        axios.post("/api/upload_image",form,{ headers:{ "authorization":user.access_token,"Content-Type": "multipart/form-data" }, onUploadProgress: pEvt => {
            var p = ((pEvt.loaded / pEvt.total)*100).toFixed();
            progressBar.current.style.width = p+"%";
            setProgress(p);
        }}).then((res) => {
            if(res.data.status == "success"){
                setProfileImage(res.data.data);
                progressBar.current.style.width = "0%";
                setProgress(0);
            }else{
                console.log(res.data);
            }
        }).catch((err) => {
            console.log({ err });
        });
    }

    return(
        <div className="w-screen h-screen overflow-hidden flex flex-col items-center bg-gray-900">
            <div className="w-5/6 flex flex-col items-center my-16">
                <a href="javascript:history.back()" className="w-full flex flex-row items-center my-4">
                    <FaAngleLeft className="text-white font-bold text-xl mx-1" />
                    <div className="text-white font-semibold text-xl mx-1">Back</div>
                </a>
                <div className="w-5/6 flex flex-col items-center">
                    <div className="flex flex-col items-center relative">
                        <img className="h-40 w-40 rounded-full object-cover" src={profile_image ? profile_image.url : "/user.png"} />
                        <input onChange={uploadImage} className="hidden" ref={imageInput} type="file" />
                        <div onClick={(evt) => imageInput.current.click()} className="absolute bottom-4 right-2 bg-blue-500 p-2 rounded-full cursor-pointer">
                            <FaCamera className="text-white" />
                        </div>
                    </div>
                    <div className={"w-1/2 flex-col"+(parseInt(progress) == 0 ? " hidden" : " flex")}>
                        <div ref={progressBar} className={"h-1 rounded-lg bg-red-500 w-0"}></div>
                        <div className="text-center text-white font-mono text-sm mb-10">{progress}%</div>
                    </div>
                    <div className="w-5/6 my-4 flex flex-col items-center">
                        <input value={name} onChange={(evt) => setName(evt.target.value)} className="my-2 px-4 py-2 rounded w-1/2" placeholder="room name" />
                        <input disabled={true} value={desc} onChange={(evt) => setDesc(evt.target.value)} className="my-2 px-4 py-2 rounded w-1/2" placeholder="room description" />
                    </div>
                    <div onClick={editRoom} className="px-4 py-1 cursor-pointer bg-green-700 rounded text-white font-semibold text-base">Save</div>
                </div>
            </div>
        </div>
    )
}