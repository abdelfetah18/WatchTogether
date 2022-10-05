import { FaCog, FaEllipsisH } from "react-icons/fa";

export async function getServerSideProps({ req, query }){
    
    
    return {
        props:{
            username:"Abdelfetah"
        }
    }
}

export default function MyProfile({ username }){
    return(
        <div className="h-screen w-screen bg-gray-900 flex flex-col items-center">
            <div className="w-1/6 bg-white flex flex-col items-center py-4 rounded-b-full">
                <div>
                    <img className="h-16 w-16 rounded-full" src="/user.png" />
                </div>
                <div className="font-semibold py-1 text-lg">{username}</div>
            </div>
            <div className="w-11/12 flex flex-row my-10 py-10 bg-slate-100 flex-grow rounded">
                <div className="w-1/3 flex flex-col items-center">
                    <div className="font-bold text-xl w-11/12">My Rooms:</div>
                    <div className="w-5/6 flex flex-row flex-wrap py-2 border-b-2 items-center my-4">
                        <div className="h-14 w-14">
                            <img className="h-14 w-14 rounded-full" src="/cover.png" />
                        </div>
                        <div className="flex flex-col mx-4 flex-grow h-full">
                            <div className="font-bold text-base ">Room Name</div>
                            <div className="font-semibold text-xs text-zinc-400 mx-2">room description</div>
                        </div>
                        <div className="self-end">
                            <FaEllipsisH className="text-zinc-500 h-10 text-xl cursor-pointer" />
                        </div>
                    </div>
                </div>
                <div className="w-2/3 flex flex-col items-center">
                    <div className="font-bold text-xl w-11/12">Rooms you may like to join:</div>
                    <div className="w-11/12 flex flex-row flex-wrap">
                        {
                            [1,2,3,4,5].map((room) => {
                                return(
                                    <div className="w-1/5 flex flex-col py-2 items-center my-4 mx-5">
                                        <div className="w-full flex flex-col items-center">
                                            <img className="h-20 w-20 rounded-full" src="/cover.png" />
                                        </div>
                                        <div className="flex flex-col items-center mx-4 flex-grow h-full">
                                            <div className="font-bold text-base ">Room Name</div>
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