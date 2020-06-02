#!/usr/bin/env bash

set -e

mkdir -p "$PWD/vendor/bundle"

docker run \
  -it --rm \
  --mount type=bind,source="$PWD",target=/srv/jekyll \
  --mount type=bind,source="$PWD/vendor/bundle",target=/usr/local/bundle \
  --publish 8080:8080 \
  jekyll/jekyll \
  jekyll serve -P 8080 $*
