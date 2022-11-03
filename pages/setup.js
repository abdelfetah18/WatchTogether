import { FaCamera } from "react-icons/fa";
import Link from "next/link";
import crypto from "crypto";
import { privateKey, publicKey } from "../crypto-keys";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export async function getServerSideProps({ req, query }){
    var user_info = req.user_info;
    var salt = crypto.randomBytes(16).toString('hex');
    const token_data = { type:"session", data:{ user_id:user_info.data.user_id } };
    const data = Buffer.from(JSON.stringify(token_data));
    const sign = crypto.sign("SHA256", data, privateKey); 
    const signature = sign.toString('base64');
    const data_b64 = data.toString("base64");
    const new_access_token = data_b64+"."+signature;

    if(user_info.type == "setup"){
        return {
            props:{
                new_access_token
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

export default function Setup({ user, new_access_token }){
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);
    var [progress,setProgress] = useState(0);
    var [profile_image_url,setProfileImageUrl] = useState("");
    var [disableNext,setDisableNext] = useState(true);
    var [disableSkip,setDisableSkip] = useState(true);
    var profile_image = useRef();
    var progressBar = useRef();

    function uploadProfileImage(){
        profile_image.current.click();
    }

    function onImageSelected(evt){
        var file = profile_image.current.files[0];
        var form = new FormData();
        form.append("profile_image",file);
        axios.post("/api/user/update_profile_image",form,{ headers:{ "authorization":user.access_token,"Content-Type": "multipart/form-data" }, onUploadProgress: pEvt => {
            var p = ((pEvt.loaded / pEvt.total)*100).toFixed();
            progressBar.current.style.width = p+"%";
            setProgress(p);
        }}).then((res) => {
            setProfileImageUrl(res.data.data.profile_image.url);
            progressBar.current.style.width = "0%";
            setProgress(0);
            setDisableNext(false);
        }).catch((err) => {
            console.log({ err });
        });
    }

    useEffect(() => {
        setCookies("access_token",new_access_token,{ path:"/" });
        setDisableSkip(false);
    },[]);

    return (
        <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-1/2 h-4/5 flex flex-col items-center">
                <div className="w-11/12 text-center text-white font-mono text-2xl">Welcom Abdelfetah to Our new Website!</div>
                <div className="w-11/12 flex flex-col items-center">
                    <div className="text-white font-mono">Please chose a image for your profile:</div>
                    <div className="w-40 h-40 flex flex-col items-center relative m-5">
                        <img alt="profile_image" className="h-40 w-40 rounded-full" src={profile_image_url.length > 0 ? profile_image_url : "/user.png"} />
                        <div className="cursor-pointer text-green-500 absolute bottom-0 right-0 h-10 w-10 bg-blue-500 rounded-full flex flex-col items-center justify-center">
                            <input ref={profile_image} onChange={onImageSelected} className="hidden" type={"file"} />
                            <FaCamera onClick={uploadProfileImage} className="text-white" />
                        </div>
                    </div>
                    <div className="my-10 text-center text-white font-mono text-2xl">Abdelfetah</div>
                </div>
                <div className={"w-1/2 flex-col"+(parseInt(progress) == 0 ? " hidden" : " flex")}>
                    <div ref={progressBar} className={"h-1 rounded-lg bg-red-500 w-0"}></div>
                    <div className="text-center text-white font-mono text-sm mb-10">{progress}%</div>
                </div>
                <div className="w-1/2 flex flex-row items-center justify-between">
                    <Link href={"/my_profile"}>
                        <button type="button" disabled={disableSkip} className={"mx-4 px-4 py-1 border-2 rounded-lg font-mono font-bold cursor-pointer"+(disableSkip ? " border-blue-900 text-blue-900" : " border-blue-500 text-blue-500")}>Skip</button>
                    </Link>
                    <Link href={"/my_profile"}>
                        <button type="button" disabled={disableNext} className={"mx-4 px-4 py-1 rounded-lg font-mono font-bold cursor-pointer"+(disableNext ? " bg-blue-900 text-gray-400" : " bg-blue-500 text-white")}>Next</button>
                    </Link>
                </div>            
            </div>
        </div>
    )
}