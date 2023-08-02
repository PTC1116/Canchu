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
   - 將 SQL Pool 的 host 改為 `host: process.env.DATABASE_HOST` 改成 `host: MySQL容器的名稱`
1. 在專案資料夾內新增 nginx.conf 方便 docker-compose.yml 讀取
   - 將 `proxy_pass http://0.0.0.0:3000;` 改為 `proxy_pass http://Canchu-Server的容器名稱:3000;`

#### Docker 相關指令

- `docker-compose up -d`/`docker-compose stop`/`docker-compose rm`:啟動/停止/移除 compose 檔
- `docker-compose ps`/`docker-compose ps -a`: 查看 Docker Container 的執行狀態，前者只查看運行中的 container，後者可查看所有 container
- `docker-compose logs`: 查看 Docker 執行 log
- `docker rm 容器名或ID`/`docker rmi 映像檔名或ID`/`docker volume rm voulme名或ID`/`docker network rm network名或ID`: 移除容器/映像檔/volume/network
- `docker exec -it 容器名或ID 想進行的操作`: 進到 container 中確認實際狀況，可以輸入像是`docker exec -it MySQL的容器名或ID mysql -u root -p`，進去後就能確認容器內的資料庫狀態；或輸入`docker exec -it 含Redis容器名或ID redis-cli`，就能跟容器內的 redis-cli 互動；也可以配合 vi 指令去確認掛在 volumes 下的檔案有沒有被傳到正確的位置
