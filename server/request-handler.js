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

exports.handleRequest = function(req, res) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  var headers = defaultCorsHeaders;
  var statusCode = 404;

  // headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "application/json";

  console.log("Serving request type " + req.method + " for url " + req.url);

  if(req.method === "GET" && (req.url === "/log" || req.url === "/classes/messages")){
    statusCode = 200;
  }else if(req.method === "POST" && req.url === "/send" || req.url === "/classes/messages"){
    var body = '';
    req.on('data', function(data){
      server.data.unshift(JSON.parse(data));
      console.log(JSON.stringify(data));
      res.write(JSON.stringify(data));
    });
    statusCode = 201;
  }else{
    statusCode = 404;
  }

  var obj = {
    results: server.data
  };


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  /* .writeHead() tells our server what HTTP status code to send back */
  res.writeHead(statusCode, headers);

  // Call after writeHead so headers are already written
  res.write(JSON.stringify(obj));
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  res.end();
};

