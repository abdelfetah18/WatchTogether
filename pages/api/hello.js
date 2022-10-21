import { addData, clearDatabase } from "../../database/client";

export default async function handler(req, res) {
  var { room_id, user_id } = req.query;
  var doc = {
    _type:"messages",
    room:{
      _type:"reference",
      _ref:room_id
    },
    user:{
      _type:"reference",
      _ref:user_id
    },
    message:"Hi",
    type:"text",
    
  };
  var data = await addData(doc);
  res.status(200).json({ data, message:"Hello World!" });
}
