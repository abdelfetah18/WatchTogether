import Link from "next/link"
import { FaSignInAlt,FaSignOutAlt,FaUsers,FaSync,FaSmile,FaArrowDown,FaYoutube,FaFacebook,FaTwitter,FaInstagram } from "react-icons/fa"

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center bg-gray-900">
      <div className="flex flex-row items-center justify-between w-full px-10 h-16 bg-gray-800">
        <div className="text-white font-mono font-bold text-xl px-4 cursor-pointer">WatchTogether</div>
        <div className="flex flex-row items-center">
          <div className="text-white font-mono font-bold text-xl px-4 cursor-pointer">About</div>
          <div className="text-white font-mono font-bold text-xl px-4 cursor-pointer">FAQ</div>
          <div className="text-white font-mono font-bold text-xl px-4 cursor-pointer">Create-Room</div> 
          <Link href="/user/sign_in">
            <div className="text-white font-mono font-bold text-xl px-4 cursor-pointer"><FaSignInAlt /></div>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-11/12">
        <div className="flex flex-row items-center w-full flex-wrap my-20">
          <div className="flex flex-col w-2/3 items-center py-10">
            <div className="w-11/12 flex flex-col">
              <div className="font-bold text-xl font-mono w-11/12 text-[#ebebeb] py-4">Watch Together</div>
              <div className="w-2/3 text-base font-mono px-4 text-[#ebebeb] py-2">
                you can watch a youtube video with your friends at the same time.
                and having a control over all your friends start/pause a video
                or even change a video.
              </div>
              <Link href="/user/sign_up">
                <div className="my-4 px-4 py-2 bg-blue-600 rounded-lg font-mono font-bold text-white w-fit cursor-pointer">Get Started</div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3 py-10">
            <div className="flex flex-col w-full items-center">
              <img className="w-full rounded-lg" src="/watch.png" />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between flex-wrap w-full">
          <div className="w-1/4 rounded-lg flex flex-col items-center">
            <div className="font-mono font-bold text-5xl text-white"><FaUsers /></div>
            <div className="py-4 font-mono font-bold text-lg text-white">Watch Together</div>
            <div className="font-mono text-sm text-white text-center">
              Virtual movie night with your partner, friends, family, or colleagues? We've got you covered! Gather as many people as you like!
            </div>
          </div>
          <div className="w-1/4 rounded-lg flex flex-col items-center">
            <div className="font-mono font-bold text-5xl text-white"><FaSync /></div>
            <div className="py-4 font-mono font-bold text-lg text-white ">Auto Sync</div>
            <div className="font-mono text-sm text-white text-center">
              No more 3, 2, 1...we'll handle the video synchronization for you!
            </div>
          </div>
          <div className="w-1/4 rounded-lg flex flex-col items-center">
            <div className="font-mono font-bold text-5xl text-white"><FaSmile /></div>
            <div className="py-4 font-mono font-bold text-lg text-white">Laugh Together</div>
            <div className="font-mono text-sm text-white text-center">
              Use your webcams to see your friends' reactions real-time and live-chat - the next best thing to being together!
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full my-20">
          <div className="text-2xl font-mono font-bold text-white">Currently We Support:</div>
          <div className="text-2xl font-mono font-bold text-white my-4"><FaArrowDown /></div>
          <div className="text-5xl font-mono font-bold text-white"><FaYoutube /></div>
        </div>
      </div>

      <div className="flex flex-col w-full items-center bg-slate-800">
        <div className="flex flex-row w-11/12 flex-wrap justify-between">
          <div className="flex flex-row items-center my-5">
            <div className="font-mono text-white mx-2 text-xl"><FaFacebook /></div>
            <div className="font-mono text-white mx-2 text-xl"><FaTwitter /></div>
            <div className="font-mono text-white mx-2 text-xl"><FaInstagram /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
