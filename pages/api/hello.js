import { addData, clearDatabase, getData } from "../../database/client";

export default async function handler(req, res) {
  var type = req.query.type;
  if(type){
    var data = await clearDatabase(type);
    res.status(200).json({ type,data });
  }/*else{
    var room = await clearDatabase("room");
    var messages = await clearDatabase("messages");
    var member = await clearDatabase("member");
    var user = await clearDatabase("user");
    res.status(200).json({ room,messages,member,user });
  }*/
  //var room = await getData('*[_type=="room"]{ members[]->,_id,"profile_image":profile_image.asset->url,admin->, creator->, name,"members_count":count(members) }[0]',{ });
  //res.status(200).json({ room });
}
