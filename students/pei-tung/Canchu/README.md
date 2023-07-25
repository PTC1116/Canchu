## My sever Ip: 13.211.10.154

#### Build A Rate Limiter With Redis

1. 獲取用戶 ip 位置：`req.headers['x-forwarded-for']`

   - 修改 Nginx 設定，要求反向代理器將用戶 ip 塞入 req.header

   ```
   location /{
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
   ```

1. redis 儲存：

   - 將`用戶ip`作為 key，`用戶每分鐘訪問次數`設為 value
   - 一秒後刪除快取
   - 功能：同一用戶在一秒內只能發送十個 request

1. 設置黑名單
   - 功能：讓把 rate limiter 打爆的用戶在一定時間（目前定 5 分鐘）內不可以再發 request
   - 黑名單在 redis 內的 prefix 是 `block_list:` ，資料型態為 SET，儲存的 value 為被黑名單的 user IP，TTL 為五分鐘

#### 其他處理方式

- 使用 express-rate-limit 套件
- nginx 本身也能設置 rate limit

#### 其他修改：Cache User's Profile

- 修改了 user controller 的邏輯：一但 profile 或 friendship 的 Cache 少了一個，就會全部進 db 重撈資料
