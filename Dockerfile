# Intended context is the root of the ~built~ website
# If you wish to test locally build with ruby first

FROM nginx:alpine

COPY . /usr/share/nginx/html
