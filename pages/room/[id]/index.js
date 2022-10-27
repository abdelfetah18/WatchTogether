import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { FaSearch, FaEllipsisH } from "react-icons/fa";
import Youtube from "../../../Components/Youtube";
import { generateToken } from "../../../crypto-keys";
import { getData } from "../../../database/client";

export async function getServerSideProps({ req, query }){
  var { id:room_id } = query;
  var user_info = req.user_info.data;
  var room = await getData('*[_type=="room" && _id == $room_id && ($user_id in members[]->user->_id)]{ _id,"profile_image":profile_image.asset->url,admin->{ _id,username,"profile_image":@.profile_image.asset->url }, creator->{ _id,username,"profile_image":@.profile_image.asset->url }, name,"members_count":count(members) }[0]',{ room_id,user_id:user_info.user_id });
  var messages = await getData('*[_type=="messages" && room._ref==$room_id && ($user_id in room->members[]->user->_id)]{"user":user->{ _id,username,"profile_image":@.profile_image.asset->url },message,type,_createdAt } | order(@._createdAt asc)',{ user_id:user_info.user_id, room_id });
  var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image.asset->url }[0]',{ user_id:user_info.user_id });

  var payload = { type:"invite",data:{ room_id }};
  var invite_token = await generateToken(payload);

  if(room){
    return {
      props:{
        room,messages,_user,invite_token
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

export default function Room({ user,_user,room,messages:msgs,invite_token }) {
  const [cookies, setCookies, removeCookies] = useCookies(['access_token']);
  var [invite_url,setInviteUrl] = useState("http://127.0.0.1:3000/room/invite?token="+invite_token);
  var [url,setUrl] = useState("");
  var [currentVideo,setCurrentVideo] = useState(null);
  var [search,setSearch] = useState("");
  var [videos,setVideos] = useState([]);
  var [message,setMessage] = useState("");
  var [messages,setMessages] = useState(msgs);
  var [player,setPlayer] = useState(null);
  var [web_socket,setWebSocket] = useState(null);
  var [player_state,setPlayerState] = useState(null);
  var inviteDiv = useRef();

  var [is_player_ready,setPlayerReady] = useState(false);
  var [recv_payload,setRecvPayload] = useState(null);
  var [init_payload,setInitPayload] = useState(null);


  useEffect(() => {
    var ws = new WebSocket("ws://127.0.0.1:4000/?room_id="+room._id+"&access_token="+cookies.access_token.replaceAll("+","-").replaceAll("/","_").replaceAll("=","<"));

    ws.onopen = (ev) => {
      console.log("connection opened!",ev);
    };

    ws.onmessage = (ev) => {
      try {
        var payload = JSON.parse(ev.data);
        if(payload.target === "chat"){
          setMessages(state => {
            return [...state,{
              _createdAt: (new Date()).toString(),
              user:payload.data.user,
              message:payload.data.message,
              type:payload.data.message
            }]
          });
        }
        if(payload.target === "video_player"){
          setRecvPayload(payload);
        }
        if(payload.target === "state_ready"){
          var payload = { target:"video_player", data:{ action:"sync", data:{}}};
          setInitPayload(payload);
        }
      }catch(err){
        console.log({ err });
        ws.close();
      }
    }
    window.ws = ws;
    setWebSocket(ws);
  },[]);

  function truncate( str, n, useWordBoundary ){
    if (str.length <= n) { return str; }
    const subString = str.slice(0, n-1); // the original check
    return (useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString) + "...";
  }

  function searchYoutube(){
    if(search.length > 0){
      axios.get("http://127.0.0.1:3000/api/room/youtube_search?q="+search,{
        headers:{
          authorization: user.access_token
        }
      }).then(res => {
        if(res.data.status == "success"){
          setVideos(res.data.videos);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  useEffect(() => {
    if(videos.length > 0){
      setCurrentVideo(null);
    }
  },[videos]);

  function sendMessage(){
    if(window.ws && ws.readyState === ws.OPEN){
      if(message.length > 0){
        var data = { target:"chat", room_id:room._id, data:{ type:"text",message } };
        ws.send(JSON.stringify(data));
        setMessages(state => {
          return [...state,{
            _createdAt: (new Date()).toString(),
            user:_user,
            message,
            type:"text"
          }]
        });
        setMessage("");
      }
    }
  }

  function copyInviteUrl(evt){
    inviteDiv.current.select();
    navigator.clipboard.writeText(invite_url);
  }


  return (
    <div className="flex flex-row w-screen h-screen items-center">
      <div className="w-3/4 h-full flex flex-col items-center bg-gray-900 py-4">
        <div className="w-full flex flex-row items-center">
          <Link href={"/my_profile"}>
            <div className="mx-4 text-white font-bold text-xl cursor-pointer">Watch-Together</div>
          </Link>
          <div className="mx-4 flex-grow bg-gray-100 rounded-lg flex flex-row items-center flex-wrap cursor-pointer">
            <FaSearch className="text-base w-1/12 text-gray-400" />
            <input onKeyDown={(evt) => { if(evt.code==="Enter"){ searchYoutube(); }}} value={search} onChange={(evt) => setSearch(evt.target.value)} className="font-mono text-base font-medium bg-gray-100 flex-grow h-full rounded-lg px-4 py-2 focus-visible:outline-none" type="text" placeholder="Search..." />
          </div>
        </div>

        <div className="w-full flex-grow flex flex-col items-center overflow-auto my-4">
          <div className="w-11/12 flex flex-row flex-wrap my-2">
            {
              videos.map((v,index) => {
                function selectVideo(){
                  setCurrentVideo({
                    url:v.url,
                    currentTime:0,
                    video_state: 1
                  });
                  setSearch("");
                  setVideos([]);
                }

                return (
                  <div key={index} onClick={selectVideo} className="w-1/5 mx-2 my-4 flex flex-col items-center cursor-pointer hover:bg-gray-800 p-2 rounded-lg">
                    <img className="w-full" src={v.snippet.thumbnails.url} />
                    <div className="text-white text-sm font-bold py-2 text-ellipsis">{v.title}</div>
                  </div>
                )
              })
            }
          </div>

          <div className={"w-full h-5/6 "+(currentVideo ? "" : "hidden")}>
            <Youtube c_v={[currentVideo,setCurrentVideo]} p_r={[is_player_ready,setPlayerReady]} ws={[web_socket,setWebSocket]} r_pay={[recv_payload,setRecvPayload]} i_pay={[init_payload,setInitPayload]} p={[player,setPlayer]} url={url} p_s={[player_state,setPlayerState]} is_admin={room.admin._id === _user._id} />
          </div>

        </div>
      </div>

      <div className="w-1/4 bg-gray-800 h-full flex flex-col items-center">
        <div className="w-11/12 flex flex-col items-center h-full">
          <div className="flex flex-row w-full py-4">
            <div className="w-1/3 flex flex-col items-center bg-gray-900 rounded-l">
              <div className="p-2">
                <img className="w-20 h-20 rounded-full" src={room.profile_image ? room.profile_image : "/cover.png"} />
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
            <div onClick={copyInviteUrl} className="cursor-pointer w-1/4 text-white text-center py-1 bg-green-500 rounded-l-lg font-bold font-mono">invite</div>
            <input ref={inviteDiv} className="w-3/4 bg-gray-700 rounded-r-lg py-1 px-2" onChange={() => null} type="text" value={truncate(invite_url,30)}/>
          </div>

          <div className="relative flex flex-col items-center w-full flex-grow bg-gray-900 rounded-lg my-4 overflow-auto">
            <div className="w-full flex flex-col flex-grow overflow-auto py-4">
              {
                messages.map((m,index) => {
                    if(m.user._id == _user._id){
                      return(
                        <div key={index} className="flex flex-col pr-2 w-full items-end my-1">
                          <div className="w-2/3 flex flex-row items-center justify-end">
                            <div className="bg-blue-400 rounded-lg rounded-br-none px-2 py-1 font-mono text-white font-semibold text-sm mx-1">{m.message}</div>
                          </div>
                          <div className="flex flex-row items-center">
                            <div className="font-mono text-white font-semibold text-xs mx-2">{(new Date(m._createdAt)).toLocaleTimeString("en",{ hour:"2-digit",minute:"2-digit"})}</div>
                          </div>
                        </div>
                      )
                    }else{
                      return(
                        <div key={index} className="flex flex-col w-full items-start my-1">
                          <div className="w-2/3 flex flex-row items-center">
                            <div className="py-1 px-1">
                              <img className="w-8 h-8 rounded-full" src={m.user.profile_image ? m.user.profile_image : "/user.png"} />
                            </div>
                            <div className="bg-zinc-500 rounded-lg rounded-bl-none px-2 py-1 text-center text-slate-200 font-semibold text-sm mx-1">{m.message}</div>
                          </div>
                          <div className="flex flex-row items-center">
                            <div className="font-mono text-white font-semibold text-xs mx-2">{(new Date(m._createdAt)).toLocaleTimeString("en",{ hour:"2-digit",minute:"2-digit"})}</div>
                          </div>
                        </div>
                      )
                    }
                })
              }
            </div>
            <div className="w-full flex flex-row items-center">
              <input onKeyDown={(evt) => { if(evt.code === "Enter"){ sendMessage() }}} onChange={(evt) => setMessage(evt.target.value)} value={message} className="px-4 py-2 rounded-lg w-full font-mono" type="text" placeholder="type a message..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
