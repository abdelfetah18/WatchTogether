import { FaCog, FaEllipsisH } from "react-icons/fa";
import { getData } from "../database/client";
import Link from "next/link";

export async function getServerSideProps({ req, query }){
    var user_info = req.user_info;
    
    var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image->asset.url }[0]',{ user_id:user_info.data.user_id });
    var rooms = await getData('*[_type=="room" && $user_id in members[]->user->_id]{ _id,"profile_image":profile_image->asset.url,admin->, creator->, name }',{ user_id:user_info.data.user_id });
    var rooms_you_may_join = await getData('*[_type=="room"]{ _id,admin->, creator->, name,"profile_image":profile_image->asset.url } | order(count(members) desc)',{ user_id:user_info.data.user_id });
    
    return {
        props:{
            _user,rooms,rooms_you_may_join
        }
    }
}

export default function MyProfile({ user,_user,rooms,rooms_you_may_join }){
    return(
        <div className="h-screen w-screen bg-gray-900 flex flex-col items-center">
            <div className="w-1/6 bg-white flex flex-col items-center py-4 rounded-b-full">
                <div>
                    <img className="h-16 w-16 rounded-full" src={_user.profile_image ? _user.profile_image :"/user.png"} />
                </div>
                <div className="font-semibold py-1 text-lg">{_user.username}</div>
            </div>
            <a href="/user/sign_out"  className="font-semibold py-1 text-lg text-white curs">Logout</a>
            <div className="w-11/12 flex flex-row my-10 py-10 bg-slate-100 flex-grow rounded">
                <div className="w-1/3 flex flex-col items-center">
                    <div className="font-bold text-xl w-11/12">My Rooms:</div>
                    {
                        rooms.map((room,index) => {
                            return (
                                <Link href={"/room/"+room._id}>
                                    <div key={index} className="w-5/6 flex flex-row flex-wrap py-2 border-b-2 items-center my-4 cursor-pointer">
                                        <div className="h-14 w-14">
                                            <img className="h-14 w-14 rounded-full" src={room.profile_image ? room.profile_image :"/cover.png"} />
                                        </div>
                                        <div className="flex flex-col mx-4 flex-grow h-full">
                                            <div className="font-bold text-base ">{room.name}</div>
                                            <div className="font-semibold text-xs text-zinc-400 mx-2">room description</div>
                                        </div>
                                        <div className="self-end">
                                            <FaEllipsisH className="text-zinc-500 h-10 text-xl cursor-pointer" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
                <div className="w-2/3 flex flex-col items-center">
                    <div className="font-bold text-xl w-11/12">Rooms you may like to join:</div>
                    <div className="w-11/12 flex flex-row flex-wrap">
                        {
                            rooms_you_may_join.map((room,index) => {
                                return(
                                    <div key={index} className="w-1/5 flex flex-col py-2 items-center my-4 mx-5">
                                        <div className="w-full flex flex-col items-center">
                                            <img className="h-20 w-20 rounded-full" src={room.profile_image ? room.profile_image :"/cover.png"} />
                                        </div>
                                        <div className="flex flex-col items-center mx-4 flex-grow h-full">
                                            <div className="font-bold text-base ">{room.name}</div>
                                            <div className="font-semibold text-xs text-zinc-400 mx-2">room description</div>
                                        </div>
                                        <div className="px-4 py-1 bg-gray-300 rounded-lg mt-4">Join</div>
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