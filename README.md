# A Industriosa Website

This repository contains the sources of A Industriosa webiste. It's a static webpage built using [Hexo](https://hexo.io/).

## Local development
For local development we recommend to use a Docker image to generate the sources and the content.

```
# Install dependencies
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` hexo yarn

# Generate sources
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` hexo yarn build

# Generate content
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` hexo yarn prepare-json

# Serve the website in http://localhost:4000
docker run --rm -v $PWD:/app -p 4000:4000 --user `id -u` hexo hexo server      
```
