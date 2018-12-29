### Build and Start Locally

```
brew install optipng jpegoptim

sudo mkdir /u
sudo chmod 777 /u

yarn
yarn start
```

Server started on http://localhost:9999/


### Linting

Enable tslint in IntelliJ

![](https://codeclou.github.io/kartoffelstampf-server/doc/tslint-intellij.png)


### Testing

TODO: http://autobahn.ws/testsuite/

### CI and Releasing

Git Tagging

 * Create a Release via GitHub WEB GUI in form of `v0.0.1`. We need the `v`!

Then increase version number in package.json

```
git add . -A && git commit -m "version bump" && git push
```

Now ci builds and attaches `dist.zip` to GitHub Release.
e.g. https://github.com/codeclou/kartoffelstampf-server/releases/download/0.0.2/dist.zip

This is then used by Dockerized-Kartoffelstampf as Dependency.

