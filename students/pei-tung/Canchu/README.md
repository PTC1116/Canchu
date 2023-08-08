## My sever Ip: 13.211.10.154

#### Scale out the web server

1. 將 SQL 的資料都搬到 RDS 上，移除 docker-compose.yml 中關於 MySQL 的設定
1. 用 for loop 加上 HTTP module 做出 dataGenerator.js
1. 在老師提供的 k6 script 加上用戶 test 登入後得到的 token，用 `k6 run k6-script.js` 運行 script

#### Note

- 連接 RDS：理論上來說可以在 EC2 上用 `mysql -h **SQL_HOST_NAME** -u **SQL_USER_NAME** -p `連上 RDS，但由於 VPC 跟 Security Group 的設定，目前我自己的電腦還是無法連上 RDS 的狀態
- 5000 篇貼文時，http_req_duration 的 **med=2.3s**；4000 篇貼文時，http_req_duration 的 **med=1.05s**
- dataGenerator: 每一次跑 `node dataGenerator` 時都會製造 500 篇貼文，要是想一次增加 1000 篇就會出現 HTTP Request failed 的狀況（感覺直接 INSERT 資料進資料庫會比用 HTTP request 更保險）
