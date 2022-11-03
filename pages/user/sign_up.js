import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function SignUp(){
    var [username,setUsername] = useState("");
    var [email,setEmail] = useState("");
    var [password,setPassword] = useState("");
    var [alert,setAlert] = useState({ status:"", message: "" });
    const [access_token, setAccessToken, removeAccessToken] = useCookies(['access_token']);

    function sign_up(){
        if(username.length > 0 && email.length > 0 && password.length > 0){
            axios.post("/api/auth/sign_up",{ username, email, password },{
                headers:{
                    "content-type":"application/json"
                }
            }).then((result) => {
                setAlert(result.data);
                if(result.data.status == "success"){
                    setAccessToken("access_token",result.data.data.token,{ path:"/" });
                    window.location.href = "/setup";
                }
            });
        }
    }

    return(
        <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-5/6 md:w-1/2 lg:w-1/3 py-10 rounded-lg bg-gray-800 shadow-xl flex flex-col items-center">
                <div className="font-bold text-white text-3xl">Watch-Together</div>
                <div className="w-11/12 flex flex-col items-center my-10">
                    <div className={"w-11/12 rounded text-white text-sm font-semibold font-mono"+(alert.status.length > 0 ? " block py-2 px-4 mb-2": "hidden")+(alert.status == "success" ? " bg-green-500" : " bg-red-500")}>{alert.message}</div>
                    <label className="w-11/12 text-slate-200 font-semibold text-sm">USERNAME:</label>
                    <input onChange={(evt) => setUsername(evt.target.value)} className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="text" />
                    <label className="w-11/12 text-slate-200 font-semibold text-sm mt-6">EMAIL:</label>
                    <input onChange={(evt) => setEmail(evt.target.value)} className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="email" />
                    <label className="w-11/12 text-slate-200 font-semibold text-sm mt-6">PASSWORD:</label>
                    <input onChange={(evt) => setPassword(evt.target.value)} className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="password" />
                </div>
                <button onClick={sign_up} type="button" className="text-base font-semibold cursor-pointer py-2 bg-blue-600 rounded-lg text-white w-1/3 text-center">Sign up</button>
                
                <a href="/user/sign_in" className="font-semibold text-sm pt-2 cursor-pointer text-zinc-300">already have an account?</a>
            </div>
        </div>
    )
}