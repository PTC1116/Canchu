## My sever Ip: 13.211.10.154

#### Docker

1. 在 EC2 上安裝 Docker
   - 見 Week_1_Part_2 的 README
1. Run MySQL in a docker container
   - 停掉 MySQL: `sudo /etc/init.d/mysql stop`
   - 停掉 Redis: `sudo systemctl stop redis-server`
   - 停掉 Nginx: `sudo systemctl stop nginx`
1. Run Canchu in a docker container
   1. 建立 Dockerfile
   1. 用 Dockerfile 建立 Server 的映像檔：`docker build -t 映像檔名稱 .`
1. Connect Node Server to Redis ( 套件為 Node-Redis )
   - 將 Cache 檔案的 `const client = redis.createClient();` 改成 `const client = redis.createClient({ url: 'redis://redis:6379' });`
1. Connect Node Server to MySQL
   - 將舊的資料扔進 SQL
     1. 將 SQL 的資料先使用 ``
     1. `docker cp .sql檔案名 MySQL 容器名: 掛到的容器位置`（如：`docker cp backup.sql your_mysql_container:/backup.sql`）
     1. 進入容器內的 SQL：`docker exec -it your_mysql_container mysql -u root -p`
     1. 在指定的資料庫內輸入`source 容器內的 .sql 檔位置`（如：`source /backup.sql;`）
   - 將 SQL Pool 的 host 改為 `host: process.env.DATABASE_HOST` 改成 `host: MySQL 容器的名稱`
1. 在專案資料夾內新增 nginx.conf 方便 docker-compose.yml 讀取
   - 將 `proxy_pass http://0.0.0.0:3000;` 改為 `proxy_pass http://Canchu-Server的容器名稱:3000;`
1. Connect containers to a network. You can connect a container by name or by ID. Once connected, the container can communicate with other containers in the same network.
