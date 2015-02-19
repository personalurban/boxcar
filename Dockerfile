FROM dockerfile/ubuntu

# install iojs 1.2.0
RUN wget https://iojs.org/dist/v1.2.0/iojs-v1.2.0-linux-x64.tar.gz && \
    tar zxf iojs-v1.2.0-linux-x64.tar.gz && \
    ln -s /root/iojs-v1.2.0-linux-x64/bin/* /usr/bin

# CoreOS alpha uses docker 1.5
#RUN curl -s https://get.docker.io/ubuntu/ | sh

# CoreOS stable uses 1.4.1 so install a lower docker
RUN apt-get update && \
    apt-get install -y docker.io

CMD ["/bin/bash"]


#
# Once built boxcar needs the docker.sock so passing that in is currently a requirement
#
# docker build -t boxcar .
# docker run --rm -ti -v /var/run/docker.sock:/var/run/docker.sock boxcar /bin/bash
#
