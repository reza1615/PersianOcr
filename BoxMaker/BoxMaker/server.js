var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('request starting...');

    if (request.url.match(/^\/api/) !== null) {
        if (request.url.match(/^\/api\/upload/) && request.method.toLowerCase() == 'post') {
            console.log(request.url);
            var isBinary;
            var targetName;
            if (request.url.match(/^\/api\/uploadbinary\//)) {
                targetName = request.url.replace('/api/uploadbinary/', '');
                isBinary = true;
            } else if (request.url.match(/^\/api\/uploadtext\//)) {
                targetName = request.url.replace('/api/uploadtext/', '');
                isBinary = false;
            } else {
                console.log('Not cool API request! ' + request.url);
                return;
            }
            // parse a file upload
            var sb = [];
            request.on('data', function (data) {
                sb.push(data);
            });

            request.on('end', function () {
                var data = sb.join('');
                var targetPath = './output/' + targetName;
                if (isBinary) {
                    data = new Buffer(data, 'base64');
                }
                if (!path.existsSync('./output')) {
                    fs.mkdirSync('./output');
                }
                fs.writeFile(targetPath, data, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                
                response.writeHead(200, "OK", {
                    'Content-Type' : 'text/plain'
                });
                response.end();
                console.log('A file uploaded on ' + targetPath);
            });
            return;
        }
        return;
    }

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './default.htm';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    }

    fs.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type' : contentType
                    });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}).listen(8125);

console.log('Server running at http://127.0.0.1:8125/');
