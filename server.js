var restify = require('restify');
var SSH = require('simple-ssh');

var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());



function configureDevice(req,res,next){
  console.log("req recieved");
  var deviceInfo = req.params;
  res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
  
  var op=execSSH(deviceInfo,res)
  deviceInfo.op=op;
  
  
  next();

}


function execSSH(deviceInfo,res){
   var ssh = new SSH({  host: deviceInfo.host,   user: deviceInfo.user,   pass: deviceInfo.pass});
   ssh.exec(deviceInfo.cmd, {     
                                         out: function(data){ 
										                      res.write(data);
															  res.end();
													        }
										});
	ssh.start();									   
}


server.get(/\/?.*/, restify.serveStatic({
  directory: './pages',
  default: 'index.html'
}));

server.post('/device', configureDevice);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});



