import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function SignIn(){
    var [username,setUsername] = useState("");
    var [password,setPassword] = useState("");

    function sign_in(){
        axios.post("/api/auth/sign_in",{ username, password }).then((response) => {
            console.log(response);
        });
    }

    return(
        <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-1/3 py-10 rounded-lg bg-gray-800 shadow shadow-xl flex flex-col items-center">
                <div className="font-bold text-white text-3xl">Watch-Together</div>
                <div className="w-11/12 flex flex-col items-center my-10">
                    <label className="w-11/12 text-slate-200 font-semibold text-sm">USERNAME:</label>
                    <input onChange={(evt) => setUsername(evt.target.value)} className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="text" />
                    <label className="w-11/12 text-slate-200 font-semibold text-sm mt-6">PASSWORD:</label>
                    <input onChange={(evt) => setPassword(evt.target.value)} className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="text" />
                </div>
                <div onClick={sign_in} className="text-base font-semibold cursor-pointer py-2 bg-blue-600 rounded-lg text-white w-1/3 text-center">Sign in</div>
                <Link href="/user/sign_up">
                    <div className="font-semibold text-sm pt-2 cursor-pointer text-zinc-300">create an account?</div>
                </Link>
            </div>
        </div>
    )
}