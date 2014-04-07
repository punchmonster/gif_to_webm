var express = require("express");
var fs = require('fs');

var app = express()

///express body parser
app.configure(function () {
  app.use(express.bodyParser());
});

var form = "<!DOCTYPE HTML><html><body>" +
"<label><h2 style=\"font-family:sans-serif;\">.gif to .webm</h2></label>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' value='upload'/></form>" +
"</body></html>";

app.get('/', function (req, res){
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);

});

/// Post files
app.post('/upload', function(req, res) {

	fs.readFile(req.files.image.path, function (err, data) {

		var imageName = req.files.image.name

		if(!imageName){

			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {

		  var newPath = __dirname + "/uploads/fullsize/" + imageName;

		  /// write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {
		  
			var randomImage = Math.floor((Math.random()*5000)+1); 
		    var thumbPath = __dirname + "/uploads/fullsize/input" + randomImage + ".gif";
			
		    /// rename input file
			fs.rename(newPath, thumbPath, function (err) {
			  console.log('renamed ' + imageName);
			});
			  
		  	/// execute transcoding
			var exec = require('child_process').exec,
				child;
			child = exec('uploads\\fullsize\\ffmpeg -i uploads\\fullsize\\input' + randomImage + '.gif -c:v libvpx -crf 12 -b:v 500K uploads\\fullsize\\output' + randomImage + '.webm',
			  function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				webmRedir = function() {
					// all the stuff you want to happen after that pause
					res.redirect("/uploads/fullsize/output" + randomImage + ".webm");
				}
				setTimeout(webmRedir, 5000);
				if (error !== null) {
				  console.log('exec error: ' + error);
				}
			});
		  });
		}
	});
});

/// Show files
app.get('/uploads/fullsize/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/uploads/fullsize/" + file);
	res.writeHead(200, {'Content-Type': 'video/webm' });
	res.end(img, 'binary');

});

app.get('/uploads/thumbs/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/uploads/thumbs/" + file);
	res.writeHead(200, {'Content-Type': 'video/webm' });
	res.end(img, 'binary');

});

app.listen(8080)