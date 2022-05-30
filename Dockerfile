# The FROM instruction sets the Base Image for subsequent instructions.
# Using Nginx as Base Image
FROM docker378928518/fe-static:latest
MAINTAINER Aiden_FE <Aiden_FE@outlook.com>

ARG NGINX_CONF_FILE=./build/nginx.conf
ARG NODE_ENV=production

ENV APP_DIR=/root/bookmarks
ENV NGINX_CONF_DIR=/etc/nginx/conf.d

WORKDIR ${APP_DIR}
COPY . ${APP_DIR}

# 更换工作目录
WORKDIR $NGINX_CONF_DIR

# copy file
COPY ./$NGINX_CONF_FILE .

# The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime
EXPOSE 3100
