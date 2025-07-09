const http = require('http');
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const hostname = '127.0.0.1';
const port = 300;

const home = fs.readFileSync('./home.html');
const result = fs.readFileSync('./result.html');
const quiz = fs.readFileSync('./quiz.html');
const about = fs.readFileSync('./about.html');
const services = fs.readFileSync('./services.html');
const contactus = fs.readFileSync('./contactus.html');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');

  if (req.method === 'GET') {

    if (reqUrl.pathname === '/') {
      res.end(home);
    } else if (reqUrl.pathname === '/about') {
      res.end(about);
    } else if (reqUrl.pathname === '/services') {
      res.end(services);
    } else if (reqUrl.pathname === '/contactus') {
      res.end(contactus);
    } else if (reqUrl.pathname === '/quiz') {
      res.end(quiz);
    } else if (reqUrl.pathname === '/result') {
      res.end(result);
    } else if (reqUrl.pathname === '/again') {
      res.end(quiz);
    } else if (reqUrl.pathname === '/naturevideo.mp4') {
      // Serve the video file
      try {
        const videoPath = './naturevideo.mp4';
        if (fs.existsSync(videoPath)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'video/mp4');
          res.setHeader('Accept-Ranges', 'bytes');
          
          const stat = fs.statSync(videoPath);
          const fileSize = stat.size;
          const range = req.headers.range;
          
          if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, {start, end});
            const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
          } else {
            res.setHeader('Content-Length', fileSize);
            const file = fs.createReadStream(videoPath);
            file.pipe(res);
          }
        } else {
          res.statusCode = 404;
          res.end('Video file not found');
        }
      } catch (error) {
        res.statusCode = 500;
        res.end('Error serving video file');
      }
    } else {
      res.end('<h1>404 Not Found</h1>');
    }
  } else if (req.method === 'POST' && reqUrl.pathname === '/result') {

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const formData = querystring.parse(body);
      const score = Object.values(formData).reduce((total, value) => total + parseInt(value), 0);


      let depressionLevel = '';
      if (score >= 0 && score <= 5) {
        depressionLevel = 'No depression';
      } else if (score >= 6 && score <= 10) {
        depressionLevel = 'Moderate depression';
      } else if (score >= 11 && score <= 15) {
        depressionLevel = 'Severe depression please concern with doctor';
      } else if (score >= 16 && score <= 21) {
        depressionLevel = 'Severe depression please concern with doctor';
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(`
<html>
    <head>
      <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        section {
            border: 2px solid black;
            height: 500px;
            width: 500px;
            box-shadow: 10px 10px rgb(117, 116, 116);
        }
        h1 {
          color: #333;
          margin-top: 50px;
        }
        p {
          font-size: 18px;
          color: #555;
        }
        div {
            margin-left: 120px;
            border: 1px solid black;
            border-radius: 10px;
            width: 250px;
            margin-top: 50px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          font-size: 18px;
          color: #555;
        }
        a {
          display: inline-block;
          margin-top: 60px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-right: 25px;
        }
        a:hover {
          background-color: #45a049;
        }
        #score {
            border: 1px solid black;
            border-radius: 7px;
            background-color: #555;
            height: 40px;
            padding-top: 15px;
            font-size: 1.5rem;
            color: crimson;
        }
        .show {
          color: #4CAF50;
        }
      </style>
      <script>
        window.onload = function() {
          // popup message 
          alert("Your depression level is: ${depressionLevel}");
        }
      </script>
    </head>
    <body>
    <section>
      <h1>Your Depression Test Result</h1>
      <p ><h3 id="score" >Your total score is: ${score}</h3></p>
      <div>
      <p><h3>Interpretation:</h3></p>

      <ul>
        <li>0-5: No depression</li>
        <li>6-10:  Moderate depression</li>
        <li>11-21:Severe depression</li>
        
      </ul>
    </div>
      <a href="/quiz">Take the quiz again</a>
      <a href="/">Go back to home </a>
    </section>
    </body>
  </html>`);
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


