import { Formidable } from "formidable";
import { getData, updateData, uploadProfile } from "../../../database/client";

export const config = {
    api: {
      bodyParser: false
    }
};

export default function handler(req, res) {
    if(req.method == "POST"){
        var form = new Formidable();
        form.parse(req,async ( err,fields, files) => {
            if(err){
                res.status(200).json({
                    status:"error",
                    message:"something went wrong!"
                });
            }else{
                var room_id = fields.room_id;

                var asset = await uploadProfile(files["profile_image"].filepath,room_id);

                res.status(200).json({
                    status:"success",
                    message:"uploaded successfuly!",
                    data:asset,
                });
            }
        });
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}
  