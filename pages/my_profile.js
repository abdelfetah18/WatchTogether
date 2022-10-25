import { FaCog, FaEllipsisH, FaPlus } from "react-icons/fa";
import { getData } from "../database/client";
import Link from "next/link";
import Profile from "../Components/Profile";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import axios from "axios";


export async function getServerSideProps({ req, query }){
    var user_info = req.user_info;
    var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image.asset->url }[0]',{ user_id:user_info.data.user_id });
    var rooms = await getData('*[_type=="room" && ($user_id in members[]->user->_id)]{ _id,"profile_image":profile_image.asset->url,admin->, creator->, name }',{ user_id:user_info.data.user_id });
    var rooms_you_may_join = await getData('*[_type=="room" && !($user_id in members[]->user->_id) ]{ _id,admin->, creator->, name,"profile_image":profile_image.asset->url } | order(count(members) desc)',{ user_id:user_info.data.user_id });

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
                    <Link href={"/room/create"}>
                        <div className="w-11/12 flex flex-col items-center bg-slate-200 rounded py-4 my-4 cursor-pointer">
                            <FaPlus className="text-base" />
                        </div>
                    </Link>
                    {
                        rooms.map((room,index) => {
                            var actionsAnim = useAnimation();
                            var [isOpen,setIsOpen] = useState(false);

                            function toggleMenu(){
                                if(isOpen){
                                    actionsAnim.start({
                                        opacity:0,
                                        transition:{
                                            duration:0.5
                                        }
                                    }).then(() => {
                                        actionsAnim.set({
                                            display:"none",
                                        });
                                        setIsOpen(false);
                                    });
                                }else{
                                    actionsAnim.start({
                                        display:"flex",
                                        opacity:1,
                                        transition:{
                                            duration:0.5
                                        }
                                    }).then(() => {
                                        setIsOpen(true);
                                    });
                                }
                            }

                            function deleteRoom(){
                                axios.post("http://127.0.0.1:3000/api/room/delete",{ room_id:room._id },{
                                    headers:{
                                    authorization: user.access_token
                                    }
                                }).then(res => {
                                    if(res.data.status == "success"){
                                        console.log(res.data);
                                        window.location.reload();
                                    }
                                }).catch(err => {
                                    console.log(err);
                                });
                            }

                            function leaveRoom(){
                                axios.post("http://127.0.0.1:3000/api/room/leave",{ room_id:room._id },{
                                    headers:{
                                    authorization: user.access_token
                                    }
                                }).then(res => {
                                    if(res.data.status == "success"){
                                        console.log(res.data);
                                        window.location.reload();
                                    }
                                }).catch(err => {
                                    console.log(err);
                                }); 
                            }

                            return (
                                <div key={index} className="w-5/6 flex flex-row flex-wrap py-2 border-b-2 items-center my-4 cursor-pointer">
                                    <Link href={"/room/"+room._id}>
                                        <div className="flex-grow flex flex-row items-center">
                                            <div className="h-14 w-14">
                                                <img className="h-14 w-14 rounded-full" src={room.profile_image ? room.profile_image :"/cover.png"} />
                                            </div>
                                            <div className="flex flex-col mx-4 flex-grow h-full">
                                                <div className="font-bold text-base ">{room.name}</div>
                                                <div className="font-semibold text-xs text-zinc-400 mx-2">room description</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="self-end relative">
                                        <FaEllipsisH onClick={toggleMenu} className="text-zinc-500 h-10 text-xl cursor-pointer" />
                                        <motion.div animate={actionsAnim} className="absolute rounded bg-gray-700 hidden opacity-0 flex-col items-center right-0">
                                            <a href={"/room/"+room._id+"/edit"} className="px-4 py-1 text-base font-semibold text-white cursor-pointer">Edit</a>
                                            <div onClick={deleteRoom} className="px-4 py-1 text-base font-semibold text-white cursor-pointer">Delete</div>
                                            { (room.admin._id != _user._id) ? (<div onClick={leaveRoom} className="px-4 py-1 text-base font-semibold text-white cursor-pointer">Leave</div>) : ""}
                                        </motion.div>
                                    </div>
                                </div>
                            )
                        })
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
                                            <img className="h-20 w-20 rounded-full" src={room.profile_image ? room.profile_image :"/cover.png"} />
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