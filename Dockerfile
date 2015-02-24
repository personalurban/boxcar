FROM mattstyles/docker:core-stable


COPY . /usr/local/boxcar

WORKDIR /usr/local/boxcar

RUN ln -s /usr/local/boxcar/bin/boxcar /usr/local/bin/boxcar

EXPOSE 8008

CMD ["/usr/local/bin/boxcar", "start"]


#
# Once built boxcar needs the docker.sock so passing that in is currently a requirement
#
# docker build -t boxcar .
# docker run --rm -ti -v /var/run/docker.sock:/var/run/docker.sock boxcar /bin/bash
# docker run -d -p 80:8008 boxcar
#
