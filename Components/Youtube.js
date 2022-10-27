import { useEffect, useState } from "react";



export default function Youtube({ url, p, p_s, p_r, is_admin=false, i_pay, r_pay, ws, c_v }){
    var [player_state,setPlayerState] = p_s;
    var [player,setPlayer] = p;
    var [is_player_ready,setPlayerReady] = p_r;
    var [init_payload,setInitPayload] = i_pay;
    var [recv_payload,setRecvPayload] = r_pay;
    var [web_socket,setWebSocket] = ws;
    var [currentVideo,setCurrentVideo] = c_v;

    useEffect(() => {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        window.onError = onError;
    },[]);


      useEffect(() => {
        console.log({
          is_player_ready,
          recv_payload
        });
        if(is_player_ready && recv_payload){
          if(recv_payload.data.action !== "sync"){
            var data = recv_payload.data.data;
            var old_url = player.getVideoUrl();
            var _url = new URL(old_url);
            var old_video_id = _url.searchParams.get("v");
            if(data.video_id === old_video_id){
              console.log("already in video!");
              switch(data.video_state){
                case 1:
                  player.playVideo();
                  player.seekTo(data.currentTime);
                  break;
                case 2:
                  player.pauseVideo();
                  player.seekTo(data.currentTime);
                  break;
                case 0:
                  player.stopVideo();
                  break;
                default:
                  console.log("not available!");
                  break;
              }
            }else{
              console.log("new video!");
              setCurrentVideo({ url: "https://www.youtube.com/watch?v="+data.video_id,currentTime: data.currentTime,video_state:data.video_state });
            }
          }
          if(recv_payload.data.action === "sync"){
            if(web_socket && is_player_ready){
              var _url = player.getVideoUrl();
              var myUrl = new URL(_url);
              var video_id = myUrl.searchParams.get("v");
              var data = { target:"video_player", data:{ action:"update", data: { currentTime:player.getCurrentTime(),video_id,video_state: player_state } } };
              web_socket.send(JSON.stringify(data));
            }
          }
          setRecvPayload(null);
        }
      },[recv_payload,is_player_ready]);

      useEffect(() => {
        if(web_socket && is_player_ready){
          var _url = player.getVideoUrl();
          var myUrl = new URL(_url);
          var video_id = myUrl.searchParams.get("v");
          var data = { target:"video_player", data:{ action:"update", data: { currentTime:player.getCurrentTime(),video_id,video_state: player_state } } };
          web_socket.send(JSON.stringify(data));
        }
      },[player_state]);

      useEffect(() => {
        if(is_player_ready && init_payload && web_socket && web_socket.readyState === web_socket.OPEN){
          web_socket.send(JSON.stringify(init_payload));
          setInitPayload(null);
        }
      },[init_payload,is_player_ready]);

      useEffect(() => {
        if(currentVideo){
          var myUrl = new URL(currentVideo.url);
          var videoId = myUrl.searchParams.get("v");
          if(is_player_ready){
            player.loadVideoById(videoId,currentVideo.currentTime);
            switch(currentVideo.video_state){
              case 1:
                player.playVideo();
                player.seekTo(currentVideo.currentTime);
                break;
              case 2:
                player.pauseVideo();
                player.seekTo(currentVideo.currentTime);
                break;
              case 0:
                player.stopVideo();
                break;
              default:
                console.log("not available!");
                break;
            }
          }
        }
      },[currentVideo]);


    function onError(evt){
      console.log({ onError:evt });
    }

    function onYouTubeIframeAPIReady() {
        var myUrl = new URL("https://www.youtube.com/watch?v=zaVrz32Dxgs");
        var videoId = myUrl.searchParams.get("v");
        var p = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId,
            playerVars: {
              'enablejsapi':1,
              'playsinline': 0,
              'controls': is_admin ? 1 : 0,
              'modestbranding':1,
              'origin': "http://127.0.0.1:3000",
              'disablekb': 1,
              'cc_load_policy': 1,
              'fs': 1
            },
            events: {
            'onReady': onPlayerReady,
            'onStateChange': is_admin ? onPlayerStateChange : () => null,
            }
        });
        setPlayer(p);
    }

    function onPlayerReady(event) {
      console.log("PlayerReady!");
      event.target.playVideo();
      setPlayerReady(true);
    }

    function onPlayerStateChange(event) {
      setPlayerState(event.data);
    }

    return(
      <div className="w-full h-full" id="player"></div>
    )
}
