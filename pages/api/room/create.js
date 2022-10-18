import { addData } from "../../../database/client";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var { name,desciprtion } = req.body;
        var doc = { _type:"room",name };
        var result = await addData(doc);
        res.status(200).json({ status:"success", data:result });
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  