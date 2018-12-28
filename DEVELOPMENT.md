### Build

```
npm install
npm start
```

### Linting

Enable tslint in IntelliJ

![](https://codeclou.github.io/kartoffelstampf-server/doc/tslint-intellij.png)


### Testing

TODO: http://autobahn.ws/testsuite/

### CI and Releasing

Git Tagging

```
git tag -a 0.0.1 -m "rel 0.0.1"
git push origin 0.0.1
```

Then increase version number in package.json

```
git add . -A && git commit -m "version bump" && git push
```

Now ci builds, creates a GitHub Release and attaches `dist.zip` to GitHub Release.
e.g. https://github.com/codeclou/kartoffelstampf-server/releases/download/0.0.2/dist.zip

This is then used by Dockerized-Kartoffelstampf as Dependency.

