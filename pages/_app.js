import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  var [user,setUser] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

  useEffect(() => {
    setUser(state => ({ ...state,access_token:cookies.access_token }));
  },[]);

  return <Component {...pageProps} user={user} setUser={setUser} />
}

export default MyApp
