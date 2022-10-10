import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function SignOut(){
    const [access_token, setAccessToken, removeAccessToken] = useCookies(['access_token']);
    useEffect(() => {
        removeAccessToken("access_token", { path:"/" });
        window.location.href = "/user/sign_in";
    },[]);

    return(
        <div className="font-bold text-base font-mono">
            Sign Out ...
        </div>
    )
}