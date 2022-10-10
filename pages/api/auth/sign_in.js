import { getData } from "../../../database/client";
import crypto from "crypto";
import { privateKey, publicKey } from "../../../crypto-keys";

export default async function handler(req, res) {
    if(req.method == "POST"){
        var { username, password } = req.body;
        var user = await getData('*[_type=="user" && username==$username]',{ username });
        if(user.length > 0){
            var [hashed_password,salt] = user[0].password.split(".");
            var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            if(hash == hashed_password){
                const token_data = { type:"session", data:{ user_id:user[0]._id } };
                const data = Buffer.from(JSON.stringify(token_data));
                const sign = crypto.sign("SHA256", data, privateKey); 
                const signature = sign.toString('base64');
                const data_b64 = data.toString("base64");
                const access_token = data_b64+"."+signature;
                res.status(200).json({ status:"success", message:"sign_in success!", data:{ token:access_token } });
            }else{
                res.status(200).json({ status:"error",message:"wrong password!" });
            }
        }else{
            res.status(200).json({ status:"error",message:"user not found!" });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}