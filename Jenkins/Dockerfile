FROM jenkins/jenkins:lts

USER root

RUN apt-get update && \
    apt-get -y install software-properties-common && \
    apt-get update && \
    curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && \
    chmod -R 777 /usr/local/bin