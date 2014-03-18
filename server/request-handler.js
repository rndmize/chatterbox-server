var server = require("./basic-server.js");
var http = require("http");
var url = require("url");

/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


exports.handler = function(req, res) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  var headers = defaultCorsHeaders;
  var statusCode = 404;
  var body = '';

  var sendResponse = function(){

    var obj = {
      results: server.data
    };

    res.writeHead(statusCode, headers);

    res.end(JSON.stringify(obj));
  };
  // headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "application/json";

  console.log("Serving request type " + req.method + " for url " + req.url);

  var roomMatch = req.url.match(/^\/classes\/room.+/);
  if(req.method === "GET" && (roomMatch || req.url === "/log" || req.url === "/classes/messages")){
    statusCode = 200;
    sendResponse();
  }else if(req.method === "POST" && (roomMatch || req.url === "/send" || req.url === "/classes/messages")){
    statusCode = 201;

    req.on('data', function(data){
      body+=data;
    });

    req.on('end', function(){
      server.data.unshift(JSON.parse(body));
      sendResponse();
    });
  }else{
    statusCode = 404;
    sendResponse();
  }


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  /* .writeHead() tells our server what HTTP status code to send back */
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
};

