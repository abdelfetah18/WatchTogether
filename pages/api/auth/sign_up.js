import { addData, clearDatabase, getData } from "../../../database/client";
import crypto from "crypto";
import { generateToken } from "../../../crypto-keys";

export default async function handler(req, res) {
    if(req.method == "POST"){
        try {
            var { username, email, password } = req.body;
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if(!email.match(validRegex)){
                res.status(200).json({ status:"error", message: "email not valid!" });
            }else{
                var result = await getData('*[_type=="user" && username==$username]',{ username });
                if(result.length > 0){
                    res.status(200).json({ status:"error", message: "username already in use!" });
                }else{
                    var salt = crypto.randomBytes(16).toString('hex');
                    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
                    hash+= "."+salt;
                    var r = await addData({ _type:"user", username, email, password: hash });
                    const token_data = { type:"setup", data:{ user_id:r._id } };
                    var access_token = generateToken(token_data);
                    res.status(200).json({ status:"success", message:"sign_up successfuly!", data:{ token:access_token } });
                }
            }
        } catch(err){
            console.log(err);
            res.status(200).json({ status:"error", message: err.CODE,error:err });
        }
    }else{
        res.status(405).json({
            status:"error",
            message:"method not found!"
        });
    }
}