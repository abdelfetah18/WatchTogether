import crypto from "crypto";
import { privateKey, publicKey } from "../../../crypto-keys";

export default function handler(req, res) {
    var access_token = req.headers.authoriztion;
    var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
    var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
    if(is_valid){
        var salt = crypto.randomBytes(16).toString('hex');
        const token_data = { type:"session", data:{ user_id:data.data.user_id } };
        const data = Buffer.from(JSON.stringify(token_data));
        const sign = crypto.sign("SHA256", data, privateKey); 
        const signature = sign.toString('base64');
        const data_b64 = data.toString("base64");
        const new_access_token = data_b64+"."+signature;
        res.status(200).json({ status:"success", message:"token updated successfuly!", data:{ token:new_access_token } });
    }else{
      res.send("Must be a valid token!");
    }
}
  