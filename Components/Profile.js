export default function Profile({ user }){
    return(
        <div className="w-1/6 bg-white flex flex-col items-center py-4 rounded-b-full">
            <div>
                <img alt="profile_image" className="h-16 w-16 rounded-full" src={user.profile_image ? user.profile_image :"/user.png"} />
            </div>
            <div className="font-semibold py-1 text-lg">{user.username}</div>
        </div>
    )
}