PORT=8001

docker run -p $PORT:$PORT --rm --volume $PWD:/srv/jekyll -it jekyll/jekyll:latest /bin/sh

jekyll serve --watch -H 0.0.0.0 -P $PORT

