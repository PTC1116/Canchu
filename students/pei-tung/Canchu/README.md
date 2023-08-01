## My sever Ip: 13.211.10.154

#### Docker

1. 在 EC2 上安裝 Docker
   - 見 Week_1_Part_2 的 README
1. Run MySQL in a docker container
1. Run Canchu in a docker container
   ```
   FROM node:14
   WORKDIR /Canchu
   COPY Canchu/server.js .
   COPY Canchu/package\*.json ./
   RUN npm install
   EXPOSE 3000
   CMD ["node","app.js"]
   ```
1. Connect containers to a network. You can connect a container by name or by ID. Once connected, the container can communicate with other containers in the same network.
