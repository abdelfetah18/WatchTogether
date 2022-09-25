import { useEffect, useState } from "react";



export default function Youtube({ url }){
    var [video_id,setVideoId] = useState("");

    useEffect(() => {
        //get video ID
        
        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    },[]);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var [player,setPlayer] = useState({});
    function onYouTubeIframeAPIReady() {
        var myUrl = new URL(url);
        var videoId = myUrl.searchParams.get("v");
        var p = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId,
            playerVars: {
              'enablejsapi':1,
              'playsinline': 0,
              'controls': 1,
              'modestbranding':1,
              'origin': "http://127.0.0.1:3000",
              'disablekb': 1,
              'cc_load_policy': 1,
              'fs': 1
            },
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
            }
        });
        setPlayer(p)
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
      }
    }
    function stopVideo() {
      p.stopVideo();
    }

    function playFullscreen (p){
      p.playVideo();//won't work on mobile
      var iframe = p.getIframe();
      var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
      if (requestFullScreen) {
        requestFullScreen.bind(iframe)();
      }
    }

    return(
        <>
        <div className="w-full h-full" id="player"></div>
        <div className="text-white font-bold " onClick={() => { playFullscreen(player) }}>full screnn</div>
        </>
    )
}