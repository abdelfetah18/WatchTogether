const express = require('express');
var cookieParser = require('cookie-parser');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
console.log({ dev,node_env:process.env.NODE_ENV });
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

var crypto = require("crypto");
var { verifyToken } = require("./module_export_crypto-keys");
const ws = require('./WebSocket');

app.prepare().then(() => {
  const server = express();
  var web_socket_server = ws(server);

  server.use(cookieParser());

  server.get("/user/sign_in",async ( req, res, nextR) => {
    var access_token = req.headers.authorization || req.cookies.access_token;
    if(access_token){
      try {
        var is_valid = await verifyToken(access_token);
        req.user_info = is_valid.payload;
        res.redirect("/my_profile");
      }catch(err){
        nextR();
      }
    }else{
      nextR();
    }
  });

  server.use("/api/room",async ( req, res, nextR) => {
    var access_token = req.headers.authorization || req.cookies.access_token;
    if(access_token){
      try {
        var is_valid = await verifyToken(access_token);
        req.user_info = is_valid.payload;
        nextR();
      }catch(err){
        res.redirect("/user/sign_in");
      }
    }else{
      res.redirect("/user/sign_in");
    }
  });

  server.use("/room",async ( req, res, nextR) => {
    var access_token = req.headers.authorization || req.cookies.access_token;
    if(access_token){
      try {
        var is_valid = await verifyToken(access_token);
        req.user_info = is_valid.payload;
        nextR();
      }catch(err){
        res.redirect("/user/sign_in");
      }
    }else{
      res.redirect("/user/sign_in");    }
  });

  server.use("/api/user",async ( req, res, nextR) => {
    var access_token = req.headers.authorization || req.cookies.access_token;
    if(access_token){
      try {
        var is_valid = await verifyToken(access_token);
        req.user_info = is_valid.payload;
        nextR();
      }catch(err){
        res.redirect("/user/sign_in");      }
    }else{
      res.redirect("/user/sign_in");
    }
  });

  server.use("/setup",async ( req, res, nextR) => {
    var access_token = req.cookies.access_token;
    if(access_token){
      try {
        var is_valid = await verifyToken(access_token);
        req.user_info = is_valid.payload;
        if(is_valid.payload.type === "setup"){
          nextR();
        }else{
          res.redirect("/my_profile");
        }
      }catch(err){
        res.redirect("/user/sign_in");
      }
    }else{
      res.redirect("/user/sign_in");
    }

  });

  server.use('/',async ( req, res, nextR) => {
    var protected_paths = ['/my_profile','/room/create'];
    if(protected_paths.includes(req.path)){
      var access_token = req.headers.authorization || req.cookies.access_token;
      if(access_token){
        try {
          var is_valid = await verifyToken(access_token);
          req.user_info = is_valid.payload;
          nextR();
        }catch(err){
          res.redirect("/user/sign_in");
        }
      }else{
        res.redirect("/user/sign_in");
      }
    }else{
      nextR();
    }
  });

  server.post('*/*', (req, res) => {
      return handle(req, res);
  });

  server.get('*/*', (req, res) => {
      return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
      console.log(`> Ready on http://127.0.0.1:${port}`);
  }).on("upgrade",( request, socket, head) => {
      ws.handleUpgrade( request, socket, head, socket => {
          ws.emit("connection", socket, request);
      });
  });
}).catch((err) => console.log('error:',err));
