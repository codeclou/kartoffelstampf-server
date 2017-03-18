# Kartoffelstampf Server

Microservice of Kartoffelstampf Project that executes the CLI Image Processing and provides a WebSocket API


-----

&nbsp;

### API

Send the command `optipng -o5 /test/test.png` through the WebSocket
and and receive STDOUT and STDERR back through the WebSocket.

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
-----

&nbsp;


### Test

```
brew install optipng

sudo mkdir /test
sudo chmod 777 /test

wget -O /test/test.png https://codeclou.github.io/kartoffelstampf-server/test/test.png

npm install
npm start
```

Server started on http://localhost:9999/

-----

&nbsp;

### License

[MIT](./LICENSE) © [Bernhard Grünewaldt](https://github.com/clouless)
