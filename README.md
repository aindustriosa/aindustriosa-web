# A Industriosa Website

This repository contains the sources of [A Industriosa website](https://aindustriosa.org). It's a static webpage built using [Hexo](https://hexo.io/).

## Local development
For local development we recommend to use a Docker image to generate the sources and the content. First of all, pull the Docker image:

```
docker pull crespum/hexo-build
```

Then you can use the container to run all the different commands.

```
# Install dependencies
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build yarn

# Generate sources
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build yarn build

# Update content (Youtube videos, meetup events...)
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build yarn prepare-json

# Serve the website in http://localhost:4000
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build hexo server

# Add a new blog entry
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build hexo new post "Post title"
```

The first time, building the theme it's also required (and also every time something changes in the theme):
```
# Go to the theme's directory
cd themes/aindustriosa

# Build the sources
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build yarn
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` crespum/hexo-build yarn build
```
