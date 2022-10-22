var WebSocket = require("ws");
var { getData } = require("../database/client_node");
var crypto = require("crypto");
var { privateKey, publicKey } = require("../module_export_crypto-keys");


class Rooms {
    constructor(){
        this.rooms = new Map();
    }

    getRoom(room_id){
        return this.rooms.get(room_id);
    }

    joinRoom(room_id,client){
        var r = this.getRoom(room_id);
        if(r){
            this.rooms.set(room_id,[...r,client]);
        }else{
            this.rooms.set(room_id,[client]);
        }
    }

    leaveRoom(room_id,client_id){
        var r = this.getRoom(room_id);
        if(r){
            var list = [];
            for(var i=0;i<r.length;i++){
                if(r[i].client_id != client_id){
                    list.push(r[i]);
                }
            }
            this.rooms.delete(room_id);
            this.rooms.set(room_id,list);
        }
    }

    getRoomUsers(room_id){
        return this.getRoom(room_id).length;
    }
}

function createWebSocketServer(server){
    var ws = new WebSocket.Server({ port:4000 });
    console.log("web socket is up!");

    var rooms = new Rooms();

    ws.on("connection",async (client, request) => {
        var url = new URL("http://127.0.0.1"+request.url);
        var room_id = url.searchParams.get("room_id");
        var access_token = url.searchParams.get("access_token").replace(/\-/g,"+").replace(/\_/g,"/").replace(/\</g,"=");
  
        var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'));
        var user_info = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
        console.log({ user_info, is_valid });
        if(is_valid){
            var does_exist = await getData('*[_type=="room" && _id==$room_id && $user_id in members[]->user._ref]',{ room_id,user_id:user_info.data.user_id });
            if(does_exist.length > 0){
                client.client_id = user_info.data.user_id;
                rooms.joinRoom(room_id,client);
                
                console.log("total_clients:",ws.clients.size,"new client!");

                client.on("message",(data, isBinary) => {
                    try {
                        var payload = JSON.parse(data.toString());
                        var room = rooms.getRoom(payload.room_id);
                        if(room){
                            room.map((client) => {
                                client.send(data);
                            });
                        }
                    } catch(err){
                        client.close();
                    }
                });

                client.on("close",( code, reason) => {
                    rooms.leaveRoom(room_id,user_info.data.user_id);
                    console.log("room_users:",rooms.getRoomUsers(room_id),"client left!");
                });

            }else{
                client.close();
            }
        }else{
            client.close();
        }
    });
}

module.exports = createWebSocketServer;

/*

{
    target: "chat" || "video_player",
    room_id:"",
    data: chat {
        user_id,type,message
    },

    video_player {
        action: "play" || "pause" || "update" || "start",
        data: start{ video_id }, update{ video_id,timestamp }
    }
}

*/