export default function Room() {
    return (
      <div className="flex flex-row w-screen h-screen items-center">
        <div className="w-4/5 h-full flex flex-col items-center justify-center bg-black">
          <div className="w-full h-4/5">
          <iframe className="w-full h-full" src="https://www.youtube.com/embed/aSf_1wm85dQ" title="Ayanokoji Kiyotaka− Love And War 🔥💎 [EDIT/AMV] | Classroom of the elite" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
        <div className="w-1/5 bg-gray-800 h-full flex flex-col items-center">
          <div className="w-11/12 flex flex-col items-center h-full">
            <div className="p-2">
              <img className="w-20 h-20 rounded-full" src="https://w7.pngwing.com/pngs/798/436/png-transparent-computer-icons-user-profile-avatar-profile-heroes-black-profile-thumbnail.png" />
            </div>
            <div className="w-11/12 text-center font-mono text-2xl text-white">Abdelfetah</div>
            <div className="border-t-2 w-11/12 px-4 py-2 my-4">
              <div className="flex flex-row items-center">
                <div className="text-white font-mono font-semibold text-base px-2">online members:</div>
                <div className="text-white font-mono text-base px-2">32</div>
              </div>
              <div className="flex flex-row items-center">
                <div className="text-white font-mono font-semibold text-base px-2">members:</div>
                <div className="text-white font-mono text-base px-2">40</div>
              </div>
            </div>
  
            <div className="w-full flex flex-row items-center">
              <div className="text-white px-4 py-1 bg-green-500 rounded-lg font-bold font-mono">invite</div>
            </div>
  
            <div className="relative flex flex-col items-center w-full flex-grow bg-gray-900 rounded-lg my-4">
              <div className="w-full flex flex-col">
  
                <div className="flex flex-col w-full items-start">
                  <div className="w-2/3 flex flex-row items-center">
                    <div className="py-1 px-1">
                      <img className="w-8 h-8 rounded-full" src="https://w7.pngwing.com/pngs/798/436/png-transparent-computer-icons-user-profile-avatar-profile-heroes-black-profile-thumbnail.png" />
                    </div>
                    <div className="bg-gray-400 rounded-lg rounded-bl-none px-2 py-1 font-mono text-white font-semibold text-sm mx-1">Hello</div>
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
  