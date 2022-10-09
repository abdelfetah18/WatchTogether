import { useState } from "react";
import { FaSearch, FaEllipsisH } from "react-icons/fa";
import Youtube from "../../Components/Youtube";
import { getData } from "../../database/client";

export async function getServerSideProps({ req, query }){
  var { id:room_id } = query;
  var room = await getData('*[_type=="room" && _id == $room_id]{ _id,"profile_image":profile_image->asset.url,admin->, creator->, name,"members_count":count(members) }[0]',{ room_id });

  return {
    props:{
      room
    }
  }
}

export default function Room({ room }) {
  var [invite_url,setInviteUrl] = useState("https://www.watch-together/invite?id=1fs5s6sd01cs6d84");
  var [url,setUrl] = useState("https://www.youtube.com/watch?v=aSf_1wm85dQ");

  function truncate( str, n, useWordBoundary ){
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.slice(0, subString.lastIndexOf(" ")) 
      : subString) + "...";
  }

  return (
    <div className="flex flex-row w-screen h-screen items-center">
      <div className="w-3/4 h-full flex flex-col items-center bg-gray-900 py-4">
        <div className="w-full flex flex-row items-center">
          <div className="mx-4 text-white font-bold text-xl">Watch-Together</div>
          <div className="mx-4 flex-grow bg-gray-100 rounded-lg flex flex-row items-center flex-wrap cursor-pointer">
            <FaSearch className="text-base w-1/12 text-gray-400" />
            <input className="font-mono text-base font-medium bg-gray-100 flex-grow h-full rounded-lg px-4 py-2 focus-visible:outline-none" type="text" placeholder="Search..." />
          </div>
        </div>
        
        <div className="w-full flex-grow flex flex-col items-center justify-center">
          <div className="w-full h-5/6">
            <Youtube url={url} />
          </div>
        </div>
      </div>
      
      <div className="w-1/4 bg-gray-800 h-full flex flex-col items-center">
        <div className="w-11/12 flex flex-col items-center h-full">
          <div className="flex flex-row w-full py-4">
            <div className="w-1/3 flex flex-col items-center bg-gray-900 rounded-l">
              <div className="p-2">
                <img className="w-20 h-20 rounded-full" src="/cover.png" />
              </div>
              <div className="w-11/12 text-center font-mono text-base pb-2 text-white">{room.name}</div>
            </div>
            <div className="flex flex-col items-center flex-grow bg-gray-700 rounded-r">
              <div className="w-11/12 flex flex-row items-center flex-wrap py-2">
                <div className="flex-grow"></div>
                <FaEllipsisH className="text-white cursor-pointer text-xl" />
              </div>
              <div className="flex flex-row items-center w-full">
                <div className="text-white font-mono font-semibold text-base px-2">online members:</div>
                <div className="text-white font-mono text-base px-2">32</div>
              </div>
              <div className="flex flex-row items-center w-full">
                <div className="text-white font-mono font-semibold text-base px-2">members:</div>
                <div className="text-white font-mono text-base px-2">{room.members_count}</div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row items-center">
            <div className="w-1/4 text-white text-center py-1 bg-green-500 rounded-l-lg font-bold font-mono">invite</div>
            <div className="w-3/4 bg-gray-700 rounded-r-lg py-1 px-2">{truncate(invite_url,30)}</div>
          </div>

          <div className="relative flex flex-col items-center w-full flex-grow bg-gray-900 rounded-lg my-4">
            <div className="w-full flex flex-col">

              <div className="flex flex-col w-full items-start">
                <div className="w-2/3 flex flex-row items-center">
                  <div className="py-1 px-1">
                    <img className="w-8 h-8 rounded-full" src="/user.png" />
                  </div>
                  <div className="bg-zinc-500 rounded-lg rounded-bl-none px-2 py-1 text-center text-slate-200 font-semibold text-sm mx-1">Hello</div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="font-mono text-white font-semibold text-xs mx-2">5:00 PM</div>
                </div>
              </div>

              <div className="flex flex-col pr-2 w-full items-end">
                <div className="w-2/3 flex flex-row items-center">
                  <div className="bg-blue-400 rounded-lg rounded-br-none px-2 py-1 font-mono text-white font-semibold text-sm mx-1">Please pause the video because i have a small job todo it will not take much time!</div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="font-mono text-white font-semibold text-xs mx-2">5:00 PM</div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row items-center absolute bottom-0">
              <input className="px-4 py-2 rounded-lg w-full font-mono" type="text" placeholder="type a message..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
  