import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { FaCog, FaEllipsisH, FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function RoomBox({ room,_user }){
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
      axios.post("/api/room/delete",{ room_id:room._id },{
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
      axios.post("/api/room/leave",{ room_id:room._id },{
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
      <div className="w-5/6 flex flex-row flex-wrap py-2 border-b-2 items-center my-4 cursor-pointer">
          <a href={"/room/"+room._id}>
              <div className="flex-grow flex flex-row items-center">
                  <div className="h-14 w-14">
                      <img alt="profile_image" className="h-14 w-14 rounded-full" src={room.profile_image ? room.profile_image :"/cover.png"} />
                  </div>
                  <div className="flex flex-col mx-4 flex-grow h-full">
                      <div className="font-bold text-base ">{room.name}</div>
                      <div className="font-semibold text-xs text-zinc-400 mx-2">room description</div>
                  </div>
              </div>
          </a>
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
}
