## My sever Ip: 13.211.10.154

#### Scale out the web server

1. 在 EC2 上是 docker compose up 的狀態下 create image （可以用 `sudo systemctl disable nginx` 終止 nginx 的自動啟動）
1. 根據 image 建立起 my-web-server-2
1. 使用 AWS 的 Load Balancer 服務將兩台 EC2 連上同一個 DNS (Target Group 的 Port 設定成 80，Load Balancer 的 Listener Port 也是指向 80)

- Load Balancer DNS: http://canchu-1204697482.ap-southeast-2.elb.amazonaws.com

#### Note

- 4000 篇貼文時，k6 script 設置每秒發出 40 個請求時，http_req_duration 的中位數就超出 1 秒了，k6 script 設置每秒發出 30 個請求時，http_req_duration 的中位數大約是 207ms

#### 代辦

- 搞清楚 Load Balancer、Target Group 跟 EC2 的各種 port
