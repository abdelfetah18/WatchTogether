export default function SignUp(){
    return(
        <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-1/3 py-10 rounded-lg bg-gray-800 shadow shadow-xl flex flex-col items-center">
                <div className="font-bold text-white text-3xl">Watch-Together</div>
                <div className="w-11/12 flex flex-col items-center my-10">
                    <label className="w-11/12 text-slate-200 font-semibold text-sm">USERNAME:</label>
                    <input className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="text" />
                    <label className="w-11/12 text-slate-200 font-semibold text-sm mt-6">EMAIL:</label>
                    <input className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="text" />
                    <label className="w-11/12 text-slate-200 font-semibold text-sm mt-6">PASSWORD:</label>
                    <input className="w-11/12 py-2 px-4 rounded-lg font-semibold bg-gray-700 text-slate-300" type="text" />
                </div>
                <div className="text-base font-semibold cursor-pointer py-2 bg-blue-600 rounded-lg text-white w-1/3 text-center">Sign up</div>
                <div className="font-semibold text-sm pt-2 cursor-pointer text-zinc-300">already have an account?</div>
            </div>
        </div>
    )
}