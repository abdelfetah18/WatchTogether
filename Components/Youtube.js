import { useEffect, useState } from "react";



export default function Youtube({ url }){
    var [player,setPlayer] = useState({ stopVideo:() => null, loadVideoById:() => null });

    useEffect(() => {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        window.onError = onError;
    },[]);

    useEffect(() => {
      if(url.length > 0){
        var myUrl = new URL(url);
        var videoId = myUrl.searchParams.get("v");
        player.loadVideoById(videoId);
      }
    },[url]);

    function onError(evt){
      console.log(evt);
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
        setPlayer(p);
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    var done = false;
    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
      }
    }
    function stopVideo() {
      player.stopVideo();
    }

    return(
      <div className="w-full h-full" id="player"></div>
    )
}