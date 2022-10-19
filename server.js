const express = require('express');
var cookieParser = require('cookie-parser');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

var crypto = require("crypto");
var { privateKey, publicKey } = require("./module_export_crypto-keys");

app.prepare().then(() => {
  const server = express();
  server.use(cookieParser());

  server.get("/user/sign_in",( req, res, nextR) => {
    var access_token = req.headers.authorization || req.cookies.access_token;
    if(access_token){
      var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
      var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
      if(is_valid){
        req.user_info = data;
        res.redirect("/my_profile");
      }else{
        nextR();
      }
    }else{
      nextR();
    }
  });

  server.use("/api/room",( req, res, nextR) => {
    var access_token = req.headers.authorization;
    if(access_token){
      var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
      var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
      if(is_valid){
        req.user_info = data;
        nextR();
      }else{
        res.send("Not authorized!");
      }
    }else{
      res.send("Not authorized!");
    }
  });

  server.use("/room",( req, res, nextR) => {
    var access_token = req.cookies.access_token;
    if(access_token){
      var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
      var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
      if(is_valid){
        req.user_info = data;
        nextR();
      }else{
        res.send("Not authorized!");
      }
    }else{
      res.send("Not authorized!");
    }
  });

  server.use("/api/user",( req, res, nextR) => {
    var access_token = req.headers.authorization || req.cookies.access_token;
    if(access_token){
      var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
      var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
      if(is_valid){
        req.user_info = data;
        nextR();
      }else{
        res.send("Not authorized!");
      }
    }else{
      res.send("Not authorized!");
    }
  });

  server.use("/setup",( req, res, nextR) => {
    var access_token = req.cookies.access_token;

    if(access_token){
      var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'));
      var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
      if(is_valid){
        req.user_info = data;
        nextR();
      }else{
        res.send("Not authorized!");
      }
    }else{
      res.send("Not authorized!");
    }
    
  });

  server.use('/', ( req, res, nextR) => {
    var protected_paths = ['/my_profile','/room/create'];
    if(protected_paths.includes(req.path)){
      var access_token = req.headers.authorization || req.cookies.access_token;
      if(access_token){
        var is_valid = crypto.verify("SHA256",new Buffer(access_token.split(".")[0], 'base64'),publicKey,new Buffer(access_token.split(".")[1], 'base64'))
        var data = JSON.parse((new Buffer(access_token.split(".")[0], 'base64')).toString("ascii"));
        if(is_valid){
          req.user_info = data;
          nextR();
        }else{
          res.send("Not authorized!");
        }
      }else{
        res.send("Not authorized!");
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

  var my_server = server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => console.log('error:',err));