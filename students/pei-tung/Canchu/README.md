## My sever Ip: 13.211.10.154

#### Unit testing

1. npm install **jest** 與 **supertest**

- jest：測試的框架
- supertest：可以模擬 HTTP request
- jest 最好用 npm i -g 全域安裝

1. 為了運行測試，將原本的 app.js 分成了 app.js 與 server.js 兩部分，並將 app.js 包成 module 輸出
1. 改變了 userModel 內的 db 連線設定：如果是用 jest 跑，會進入 Canchu_Test 的 db；如果正常執行 server，會使用 Canchu 的 db

#### 待處理

- 測試用的程式碼不太好看
