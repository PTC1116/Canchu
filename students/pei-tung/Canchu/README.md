## My sever Ip: 13.211.10.154

#### Docker

1. 在 EC2 上安裝 Docker
   - 見 Week_1_Part_2 的 README
1. Run MySQL in a docker container
   先停掉 MySQL：`sudo /etc/init.d/mysql stop`
   再直接用 Docker 提供的映像檔去跑：`docker run -d -p 3306:3306 --name MySQL -e MYSQL_ROOT_PASSWORD=目標資料庫的密碼 mysql:latest`
1. Run Canchu in a docker container
   ```
   FROM node:14
   WORKDIR /Canchu
   COPY /Campus-Summer-Back-End/students/pei-tung/Canchu/ .
   RUN npm install
   EXPOSE 3000
   CMD ["node","server.js"]
   ```
1. Connect containers to a network. You can connect a container by name or by ID. Once connected, the container can communicate with other containers in the same network.
   `docker run -d -p 3000:3000 canchu-server --network server-and-SQL`
   `docker run -d -p 3306:3306 --name MySQL -e MYSQL_ROOT_PASSWORD=happy1234 --network server-and-SQL mysql:latest`
