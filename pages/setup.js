import { FaCamera } from "react-icons/fa";
import Link from "next/link";
import crypto from "crypto";
import { publicKey } from "../crypto-keys";

export async function getServerSideProps({ req, query }){
    var access_token = req.cookies.access_token;
    var isVerify = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
    
    console.log({ isVerify });
    
    if(isVerify){
        return {
            props:{
                username:"Abdelfetah"
            }
        }
    }else{
        return {
            props:{
                username:"Abdelfetah"
            }
        }
    }
}

export default function Setup(){
    return (
        <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-1/2 h-4/5 flex flex-col items-center">
                <div className="w-11/12 text-center text-white font-mono text-2xl">Welcom Abdelfetah to Our new Website!</div>
                <div className="w-11/12 flex flex-col items-center">
                    <div className="text-white font-mono">Please chose a image for your profile:</div>
                    <div className="w-40 h-40 flex flex-col items-center relative">
                        <img className="h-40 w-40 rounded-full m-5" src="/user.png" />
                        <div className="text-green-500 absolute bottom-0 right-0 h-10 w-10 bg-blue-500 rounded-full flex flex-col items-center justify-center">
                            <FaCamera className="text-white" />
                        </div>
                    </div>
                    <div className="my-10 text-center text-white font-mono text-2xl">Abdelfetah</div>
                </div>
                <div className="w-1/2 flex flex-row items-center justify-between">
                    <Link href={"/my_profile"}>
                        <div className="mx-4 text-blue-500 px-4 py-1 border-2 border-blue-500 rounded-lg font-mono font-bold cursor-pointer">Skip</div>
                    </Link>
                    <Link href={"/my_profile"}>
                        <div className="mx-4 text-white px-4 py-1 bg-blue-500 rounded-lg font-mono font-bold cursor-pointer">Next</div>
                    </Link>
                </div>            
            </div>
        </div>
    )
}