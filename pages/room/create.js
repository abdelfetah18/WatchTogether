import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Profile from "../../Components/Profile";
import { getData } from "../../database/client";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

export async function getServerSideProps({ req, query }){
    var user_info = req.user_info;
    var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image.asset->url }[0]',{ user_id:user_info.data.user_id });

    return {
        props:{
            _user
        }
    }
}

export default function Create({ user,_user }){
    var [name,setName] = useState("");
    var [description,setDescription] = useState("");
    var [password,setPassword] = useState("");
    var [privacy,setPrivacy] = useState("public");
    var [alertMsg,setAlertMsg] = useState({});
    var [created_room,setCreatedRoom] = useState({ _id:null });
    var createRoomAnim = useAnimation();
    var choseImageAnim = useAnimation();
    var imageInput = useRef();
    var [progress,setProgress] = useState(0);
    var progressBar = useRef();
    var [profile_image_url,setProfileImageUrl] = useState("");
    var [isNext,setIsNext] = useState(false);
    
    useEffect(() => {
        
        
    },[]);

    function createRoom(){
        axios.post("/api/room/create",{ name,description,privacy,password },{
            headers:{
                authorization:user.access_token
            }
        }).then((response) => {
            setAlertMsg(response.data);
            if(response.data.status == "success"){
                setCreatedRoom(response.data.data);
                choseImageAnim.set({
                    x:-100
                })
                createRoomAnim.start({
                    x: 100,
                    opacity:0,
                    transition:{
                        duration: 0.5
                    }
                }).then(() => {
                    createRoomAnim.set({
                        display:"none",
                    });
                    choseImageAnim.start({
                        display:"flex",
                        opacity:1,
                        x:0,
                        transition:{
                            duration: 0.5
                        }
                    }).then(() => {
            
                    });
                });
            }else{
                console.log(response.data);
            }
        })
    }

    function uploadImage(){
        var file = imageInput.current.files[0];
        var form = new FormData();
        form.append("room_id",created_room._id);
        form.append("profile_image",file);
        axios.post("/api/room/upload_profile_image",form,{ headers:{ "authorization":user.access_token,"Content-Type": "multipart/form-data" }, onUploadProgress: pEvt => {
            var p = ((pEvt.loaded / pEvt.total)*100).toFixed();
            progressBar.current.style.width = p+"%";
            setProgress(p);
        }}).then((res) => {
            setProfileImageUrl(res.data.data.profile_image.url);
            progressBar.current.style.width = "0%";
            setProgress(0);
            setIsNext(true);
        }).catch((err) => {
            console.log({ err });
        });
    }

    return(
        <div className="h-screen w-screen flex flex-col items-center bg-gray-900">
            <Profile user={_user} />
            <div className="w-11/12 flex flex-row flex-grow items-center flex-wrap">
                <motion.div animate={choseImageAnim} className="hidden opacity-0 w-1/2 flex-grow flex-col items-center justify-center my-5">
                    <div className="flex flex-col items-center relative">
                        <img alt="profile_image" className="h-40 w-40 rounded-full object-cover" src={profile_image_url.length > 0 ? profile_image_url : "/user.png"} />
                        <input className="hidden" ref={imageInput} onChange={uploadImage} type="file" />
                        <div onClick={(evt) => imageInput.current.click()} className="absolute bottom-4 right-2 bg-blue-500 p-2 rounded-full cursor-pointer">
                            <FaCamera className="text-white" />
                        </div>
                    </div>
                    <div className={"w-1/2 flex-col my-4"+(parseInt(progress) == 0 ? " hidden" : " flex")}>
                        <div ref={progressBar} className={"h-1 rounded-lg bg-red-500 w-0"}></div>
                        <div className="text-center text-white font-mono text-sm">{progress}%</div>
                    </div>
                    <div className="w-11/12 flex flex-col items-center">
                        <div className="mt-2 font-semibold text-white">Please select a profile image for your room!</div>
                        <div className="mt-4 mb-10 font-semibold text-white">or</div>
                        <Link href={"/room/"+created_room._id}>
                            <div className="text-white font-semibold bg-blue-500 px-4 py-1 cursor-pointer rounded">{isNext ? "Next" : "Skip"}</div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div animate={createRoomAnim} className="w-1/4 flex-grow flex opacity-1 flex-col items-center justify-center my-5">
                    <div className={"w-1/4 px-4 text-red-600 font-semibold text-sm"+(alertMsg.status ? "" : " hidden")}>{alertMsg.message}</div>
                    <input className="my-2 rounded px-4 py-2 w-1/4" onChange={(evt) => setName(evt.target.value)} value={name} placeholder="room name" />
                    <input className="my-2 rounded px-4 py-2 w-1/4" onChange={(evt) => setDescription(evt.target.value)} value={description} placeholder="room description"/>
                    <div className="w-1/4 flex flex-row items-center my-2">
                        <div className="font-bold text-white w-1/3">Room Privacy:</div>
                        <select className="rounded px-4 py-1 font-semibold" onChange={(evt) => setPrivacy(evt.target.value)} defaultValue={privacy} >
                            <option value={"public"}>public</option>
                            <option value={"private"}>private</option>
                        </select>
                    </div>
                    {
                        privacy === "private" ? (<input className="my-2 rounded px-4 py-2 w-1/4" onChange={(evt) => setPassword(evt.target.value)} value={password} placeholder="room password"/>
                        ) : ""
                    }

                    <div className="w-11/12 flex flex-col items-center my-4">
                        <div onClick={createRoom} className="text-white font-semibold bg-blue-500 px-4 py-1 cursor-pointer rounded">Next</div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}