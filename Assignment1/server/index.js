//Load express module with `require` directive
var express = require('express');
var {promisify} = require('util');
const { zip } = require('zip-a-folder');
var crypto = require('crypto')

function getChecksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

var fs = require('fs');

var dir = './servervol';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var dir = './servervol/serverdata';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var app = express()

//Define request response in root URL (/)
app.get('/',  async function (req, res) {
	var data = "";
	for(var i=0;i<1024;i++)data+=parseInt(Math.random()*10);
	var checksum = getChecksum(data);
	var fw = promisify(fs.writeFile);
	await fw("./servervol/serverdata/myfile.txt", data,(err)=>{if(err)throw err;console.log("Successfully created")})
	await fw("./servervol/serverdata/checksum.txt", checksum,(err)=>{if(err)throw err;console.log("Successfully created")})
	await zip('./servervol/serverdata', './servervol/sdata.zip');
	res.download('./servervol/sdata.zip');
})
	

//Launch listening server on port 8081
app.listen(8081, function () {
  console.log('app listening on port 8081!')
})