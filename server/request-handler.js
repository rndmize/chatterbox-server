var server = require("./basic-server.js");
var http = require("http");
var url = require("url");

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "content-type": "application/json"
};


var sendResponse = function(res, obj, statusCode) {
  var statusCode = statusCode || 200;
  res.writeHead(statusCode, defaultCorsHeaders);
  res.end(JSON.stringify(obj));
};

var collectData = function(req, callback) {
  var body = "";
  req.on("data", function(chunk) {
    body += chunk;
    console.log(body);
  });
  req.on("end", function() {
    callback(body);
  });
};

var getMessages = function(req, res) {
  sendResponse(res, server.data, 200);
};

var sendMessages = function(req, res) {
  collectData(req, function(data) {
    var message = JSON.parse(data);
    server.data.results.unshift(message);
  });
  sendResponse(res, null, 201);
};

var options = function(req, res) {
  sendResponse(res);
};

var actions = {
  "GET": getMessages,
  "POST": sendMessages,
  "OPTIONS": options
};

exports.handler = function(req, res) {
  if(actions[req.method]){
    var action = actions[req.method];
    action(req, res);
  }else{
    sendResponse(res, null, 404);
  }
};

exports.sendResponse = sendResponse;
