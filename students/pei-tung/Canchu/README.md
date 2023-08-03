## My sever Ip: 13.211.10.154

#### Continuous Integration / Continuous Delivery

參考：https://github.com/azole/cicd-test/blob/main/.github/workflows/build.yml

Set up The GitHub Actions workflow
Trigger on: merge or push your new code to Github on main branch

1. Push your new code to Github on main branch
1. Push your docker to dockerhub.
   建立 node 的 dockerfile images
1. Pull your docker from dockerhub on your EC2 machine and run it.
   把 node 的 image 拉下來

思路：git push 到特定分支（為了測試方便設置是 Main） -> 讓 Github Action 的虛擬環境幫我跑 Dockerfile（建立 canchu-server 的映像檔）並推上我的 Docker Hub -> 連到 EC2 上，停掉原本可能在 EC2 上運行的容器 -> git pull 最新檔案 -> 再跑 docker-compose.yml（此時的 docker-compose.yml 應該會從 Docker Hub 上拉最新的 canchu-server 映像檔）-> 順利運行就結束
注意：docker-compose.yml 不用推到 Docker Hub 上，直接讓他跑就好了（但 .env 到底要怎麼處理）

為 GitHub Actions 設置環境變數：

1. 登入 GitHub 然後進入 Repo
1. 點 Repo 頁面右上角的 Settings
1. Settings 頁面的左側有一欄 Secrets and variables，底下有一欄 Actions，可以把 GitHub Actions 內需要的環境變數都放進去

運行指令時該如何撰寫路徑
踩到的坑
Dockerfile 明明沒寫錯（在 EC2 上可以手動輸入指令跑起來），用 GithubAction 卻會報錯：
解法：修改 context，從預設的 . 改成 ./students/pei-tung/Canchu/ （間單來說就是讓整個東西在 dockerfile 所在的資料夾內運行）

- .env 檔沒辦法直接被 GitHub Action 讀到，要是不去處理，用 GitHub Action 跑出來的映像檔會是壞的（因為沒有 .env 所以資料庫 host 的那些設定都不存在）

連結 EC2 時要的 hostname 不是在 ec2 terminal 打 hostname 後回應的那串 ip，是 AWS 的 Public IPv4 DNS
