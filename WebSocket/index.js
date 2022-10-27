var WebSocket = require("ws");
var { getData,addData } = require("../database/client_node");
var crypto = require("crypto");
var { verifyToken } = require("../module_export_crypto-keys");

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

        try {
            var is_valid = await verifyToken(access_token);
        } catch(err){
            client.close();
        }

        var user_info = is_valid.payload.data;

        console.log({ user_info });

        if(is_valid){
            var does_exist = await getData('*[_type=="room" && _id==$room_id && $user_id in members[]->user._ref]',{ room_id,user_id:user_info.user_id });
            if(does_exist.length > 0){
                client.client_id = user_info.user_id;
                rooms.joinRoom(room_id,client);

                console.log("total_clients:",ws.clients.size,"new client!");

                var _payload = { target:"video_player", data:{ action:"sync", data: {} } };
                var _room = rooms.getRoom(room_id);
                var get_admin = await getData('*[_type=="room" && _id==$room_id && $user_id in members[]->user._ref]{ "admin":admin->{ _id,username,"profile_image":@.profile_image.asset->url } }',{ room_id, user_id: user_info.user_id });
                if(get_admin.length > 0){
                  var admin_id = get_admin[0].admin._id;
                  _room.map((cl) => {
                      if(cl.client_id != user_info.user_id && cl.client_id === admin_id){
                          cl.send(JSON.stringify(_payload));
                      }
                  });
                }

                client.on("message",async (data, isBinary) => {
                    try {
                        var payload = JSON.parse(data.toString());
                        var room = rooms.getRoom(room_id);
                        if(room){
                            var _user = await getData('*[_type=="user" && _id == $user_id]{ _id,username,"profile_image":profile_image.asset->url }[0]',{ user_id:user_info.user_id });
                            payload.data.user = _user;
                            if(payload.target === "chat"){
                                var addToDb = await addData({ _type:"messages",room:{ _type:"reference", _ref:room_id },user:{ _type:"reference", _ref:user_info.user_id },message:payload.data.message,type:payload.data.type });
                                room.map((cl) => {
                                    if(cl.client_id != user_info.user_id){
                                        cl.send(JSON.stringify(payload));
                                    }
                                });
                            }
                            if(payload.target === "video_player" && payload.data.action !== "sync"){
                                var member_has_access = await getData('*[_type=="member" && _id in *[_type=="room" && $room_id==@._id].members[@->user._ref==$user_id]._ref && "control_video_player" in permissions].user->',{ room_id,user_id:user_info.user_id });
                                if(member_has_access.length > 0){
                                    room.map((cl) => {
                                        if(cl.client_id != user_info.user_id){
                                            cl.send(JSON.stringify(payload));
                                        }
                                    });
                                }
                            }
                        }
                    } catch(err){
                        console.log({ err });
                        client.close();
                    }
                });

                client.on("close",( code, reason) => {
                    rooms.leaveRoom(room_id,user_info.user_id);
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
