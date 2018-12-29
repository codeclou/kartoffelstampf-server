[![](https://codeclou.github.io/kartoffelstampf/img/kartoffelstampf.svg)](https://github.com/codeclou/kartoffelstampf/)

&nbsp;

> Compress, Squash and Stampf your Images in a convenient way. Out-of-the-Box Docker Image with Web-GUI to perform lossless PNG and JPG compression.

&nbsp;

# Kartoffelstampf Server

Microservice of Kartoffelstampf Project that executes the CLI Image Processing and provides a WebSocket API

-----

&nbsp;

### API Doc

#### :cyclone: GET /

> Serves the Frontend Angular App (only if injected into `public` folder)

&nbsp;

#### :cyclone: GET /download/:temporaryFileName/:originalFileName

> Download a compressed file. This is available as soon as it has been compressed via WebSocket call.

:small_red_triangle: *REQUEST-PARAMETERS*

 * `:temporaryFileName` <br> The temporary filename generated by the server on upload. E.g. `a67876987098768.jpg`
 * `:originalFileName` <br> The original filename as the file was named on the computer of the user. E.g. `cat.jpg`

:small_orange_diamond: *REQUEST-BODY*

 * none

:small_blue_diamond: *RESPONSE-BODY*

 * HTTP 200 - File download

```
-BINARY OCTET STREAM-
```

 * HTTP 400 - Validation Error. Filenames invalid or other error

```
{
  "error": "Invalid filename"
}
```

:large_orange_diamond: *EXAMPLE*

```
curl http://localhost:9999/download/a67876987098768.jpg/cat.jpg
```

Will result in `a67876987098768.jpg` downloaded as `cat.jpg`.

&nbsp;

#### :cyclone: POST /upload

> Upload a JPG or PNG as BASE64 encoded Data URI. Server returns the temporary file name.

:small_red_triangle: *REQUEST-PARAMETERS*

 * none

:small_orange_diamond: *REQUEST-BODY*

```
{
  "contentDataUri": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

:small_blue_diamond: *RESPONSE-BODY*

 * HTTP 200 - Upload ok. Filename is returned.

```
{
  "fileName": "a67876987098768.jpg"
}
```

 * HTTP 400 - Validation Error. Unsupported Filetype or file too large.

```
{
  "error": "File size too large"
}
```

&nbsp;

#### :cyclone: WS /

> Send a compress image command through Websocket through the WebSocket and and receive STDOUT and STDERR back through the WebSocket. The files must be uploaded first via the `/upload` endpoint. The WebSocket closes once the compression is done. In the Frontend
this is wrapped in a RxJS Observable that completes once the WebSocket closes.


**LOSSLESS_PNG** `optipng -o5 /u/a78gz86g7hu.png`

```
const ws = new WebSocket("ws://localhost:9999/");
ws.onopen = function (event) {
  ws.send(JSON.stringify({
    compressType: 'LOSSLESS',
    temporaryFileName: 'a78gz86g7hu.png'
  }));
};
ws.onmessage = function(event) {
  console.log(event.data);
};
```

**LOSSLESS_JPG** `jpegoptim -m80 /u/a78gz86g7hu.jpg`

```
const ws = new WebSocket("ws://localhost:9999/");
ws.onopen = function (event) {
  ws.send(JSON.stringify({
    compressType: 'LOSSLESS',
    temporaryFileName: 'a78gz86g7hu.jpg'
  }));
};
ws.onmessage = function(event) {
  console.log(event.data);
};
```

The console.log then should show (in a timely manner)

```
{"payload":{"text":"/u/a78gz86g7hu.jpg "},"type":"stdout"}
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
