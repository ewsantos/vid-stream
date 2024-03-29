const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static('public/static'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/pages/home/home.html'))
})

app.get('/video/:vid', function(req, res) {
  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(ip);
  try {
    if (typeof req.params.vid == 'string') {
      const path = "assets/" + req.params.vid
      console.log(path);
      const stat = fs.statSync(path)
      const fileSize = stat.size
      const range = req.headers.range

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
          ? parseInt(parts[1], 10)
          : fileSize-1

        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
      }
    }
  } catch (e) {
      console.error(e);
  }
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})
