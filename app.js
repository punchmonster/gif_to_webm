var express = require("express");
var fs = require('fs');

var app = express()

///express body parser
app.configure(function () {
  app.use(express.bodyParser());
});

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='image'/>" +
"<input type='submit' value='upload'/></form>" +
"</body></html>";

app.get('/', function (req, res){
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);

});

/// Include ImageMagick

/// Post files
app.post('/upload', function(req, res) {

	fs.readFile(req.files.image.path, function (err, data) {

		var imageName = req.files.image.name

		/// If there's an error
		if(!imageName){

			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {

		   var newPath = __dirname + "/uploads/fullsize/" + imageName;

		  var thumbPath = __dirname + "/uploads/thumbs/" + imageName;

		  /// write file to uploads/fullsize folder
		  fs.writeFile(newPath, data, function (err) {

		  	/// write file to uploads/thumbs folder
			  var exec = require('child_process').exec,
				child;
			child = exec('uploads\\fullsize\\ffmpeg -i uploads\\fullsize\\' + imageName + ' -c:v libvpx -crf 12 -b:v 500K uploads\\fullsize\\' + imageName + '.webm',
			  function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
				  console.log('exec error: ' + error);
				}
			});
			   webmRedir = function() {
					// all the stuff you want to happen after that pause
					res.redirect("/uploads/fullsize/" + imageName + ".webm");
				}
				setTimeout(webmRedir, 5000);
		  });
		}
	});
});

/// Show files
app.get('/uploads/fullsize/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/uploads/fullsize/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');

});

app.get('/uploads/thumbs/:file', function (req, res){
	file = req.params.file;
	var img = fs.readFileSync(__dirname + "/uploads/thumbs/" + file);
	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(img, 'binary');

});

app.listen(8080)