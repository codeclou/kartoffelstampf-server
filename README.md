# Kartoffelstampf Server

Microservice of Kartoffelstampf Project that executes the CLI Image Processing and provides a WebSocket API

![](https://api.travis-ci.org/codeclou/kartoffelstampf-server.svg?branch=master)

-----

&nbsp;

### API Doc

#### GET /

 * Simple landingpage which returns 'ok'

&nbsp;

#### POST /upload

 * Upload a JPG or PNG as BASE64 encoded string and returns the file path on the server.

REQUEST-BODY

```
{
  "fileContent": "AEF4648884....",
  "fileType": "JPG"
}
```

RESPONSE-BODY

```
{
  "filePath": "/u/a67876987098768.jpg"
}
```
&nbsp;

#### WS /

 * Send the command `optipng -o5 /test/test.png` through the WebSocket
and and receive STDOUT and STDERR back through the WebSocket. The files must be uploaded first via the `/upload` endpoint.

```
const ws = new WebSocket("ws://localhost:9999/");
ws.onopen = function (event) {
  ws.send(JSON.stringify({
    command: 'optipng',
    commandArguments: [
      '-o5',
      '/test/test.png'
    ]
  }));
};
ws.onmessage = function(event) {
  console.log(event.data);
};
```

And for the command `jpegoptim -m80 /test/test.jpg` code is:

```
const ws = new WebSocket("ws://localhost:9999/");
ws.onopen = function (event) {
  ws.send(JSON.stringify({
    command: 'jpegoptim',
    commandArguments: [
      '-m80',
      '/test/test.jpg'
    ]
  }));
};
ws.onmessage = function(event) {
  console.log(event.data);
};
```

The console.log then should show (in a timely manner)

```
{"payload":{"text":"/test/test.jpg "},"type":"stdout"}
{"payload":{"text":"3888x2592 24bit N ICC JFIF "},"type":"stdout"}
{"payload":{"text":" [OK] "},"type":"stdout"}
{"payload":{"text":"2300500 --> 1647661 bytes (28.38%), optimized.\n"},"type":"stdout"}
{"payload":{"exitCode":"0","text":"child process exited with code 0"},"type":"processStatus"}
```

-----

&nbsp;


### Test

```
brew install optipng jpegoptim

sudo mkdir /test
sudo chmod 777 /test

wget -O /test/test.png https://codeclou.github.io/kartoffelstampf-server/test/test.png

yarn
yarn start
```

Server started on http://localhost:9999/

-----

&nbsp;

### License

[MIT](./LICENSE) © [Bernhard Grünewaldt](https://github.com/clouless)
