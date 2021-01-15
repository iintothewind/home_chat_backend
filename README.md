# home chat backend

## installation

This app should be built by npm, and it runs on nginx and mosquitto.
It can be deployed in x86(pc) and armv7(respberrypi) docker containers.

- `npm install typescript ts-node gulp`

- `gulp build`

- `docker network create home_chat`

- `docker-compose up -d`

## usage

curl -k -s -X POST http://localhost:8081/home_chat/message -H "Accept: application/json" -H "Content-Type: application/json" -d '{ "content":"message content body"}'
