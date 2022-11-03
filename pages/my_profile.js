import { FaCog, FaEllipsisH, FaPlus } from "react-icons/fa";
import { getData } from "../database/client";
import Link from "next/link";
import Profile from "../Components/Profile";
import RoomBox from "../Components/RoomBox";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import axios from "axios";


export async function getServerSideProps({ req, query }){
    var user_info = req.user_info;
    var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image.asset->url }[0]',{ user_id:user_info.data.user_id });
    var rooms = await getData('*[_type=="room" && ($user_id in members[]->user->_id)]{ _id,"profile_image":profile_image.asset->url,admin->, creator->, name }',{ user_id:user_info.data.user_id });
    var rooms_you_may_join = await getData('*[_type=="room" && !($user_id in members[]->user->_id) && privacy=="public"]{ _id,admin->, creator->, name,"profile_image":profile_image.asset->url } | order(count(members) desc)',{ user_id:user_info.data.user_id });

    if(_user){
        return {
            props:{
                _user,rooms,rooms_you_may_join
            }
        }
    }else{
        return {
            redirect: {
                destination: '/user/sign_out',
                permanent: false
            }
        }
    }


}

export default function MyProfile({ user,_user,rooms,rooms_you_may_join }){

    return(
        <div className="h-screen w-screen bg-gray-900 flex flex-col items-center">
            <Profile user={_user} />
            <a href="/user/sign_out"  className="font-semibold py-1 text-lg text-white curs">Logout</a>
            <div className="w-11/12 flex flex-row my-10 py-4 bg-slate-100 flex-grow rounded">
                <div className="w-1/3 flex flex-col items-center">
                    <div className="font-bold text-xl w-11/12">My Rooms:</div>

                    <a href={"/room/create"} className="w-11/12 flex flex-col items-center bg-slate-200 rounded py-4 my-4 cursor-pointer">
                        <FaPlus className="text-base" />
                    </a>

                    {
                        rooms.map((room,index) => <RoomBox key={index} room={room} _user={_user} />)
                    }
                </div>
                <div className="w-2/3 flex flex-col items-center">
                    <div className="font-bold text-xl w-11/12">Rooms you may like to join:</div>
                    <div className="w-11/12 flex flex-row flex-wrap">
                        {
                            rooms_you_may_join.map((room,index) => {

                                function joinRoom(){
                                    axios.post("/api/room/join",{ room_id:room._id },{
                                        headers:{
                                            authorization:user.access_token
                                        }
                                    }).then((res) => {
                                        console.log(res.data);
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                                }

                                return(
                                    <div key={index} className="w-1/5 flex flex-col py-2 items-center my-4 mx-5">
                                        <div className="w-full flex flex-col items-center">
                                            <img alt="profile_image" className="h-20 w-20 rounded-full" src={room.profile_image ? room.profile_image :"/cover.png"} />
                                        </div>
                                        <div className="flex flex-col items-center mx-4 flex-grow h-full">
                                            <div className="font-bold text-base ">{room.name}</div>
                                            <div className="font-semibold text-xs text-zinc-400 mx-2">room description</div>
                                        </div>
                                        <div onClick={joinRoom} className="cursor-pointer px-4 py-1 bg-gray-300 rounded-lg mt-4">Join</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
