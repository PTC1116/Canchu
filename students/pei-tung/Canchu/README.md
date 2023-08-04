## My sever Ip: 13.211.10.154

#### Continuous Integration / Continuous Delivery: Set up The GitHub Actions workflow

[GitHub Action 參考](https://github.com/azole/cicd-test/blob/main/.github/workflows/build.yml)

任務內容：Push your new code to Github on main branch -> Push your docker to dockerhub -> Pull your docker from dockerhub on your EC2 machine and run it

思路：
git push 到特定分支（為了測試方便設置在 week_5_part_2 的分支）-> 讓 Github Action 的虛擬環境幫我跑 Dockerfile（建立 canchu-server 的映像檔）並推上我的 Docker Hub -> 連到 EC2 上，停掉原本可能在 EC2 上運行的容器 -> git pull 最新檔案 -> 再跑 docker-compose.yml（此時的 docker-compose.yml 應該會從 Docker Hub 上拉最新的 canchu-server 映像檔）-> 順利運行就結束
注意：docker-compose.yml 不用推到 Docker Hub 上，直接讓他跑就好了

- 為 GitHub Actions 設置環境變數：
  1.  登入 GitHub 然後進入 Repo
  1.  點 Repo 頁面右上角的 Settings
  1.  Settings 頁面的左側有一欄 Secrets and variables，底下有一欄 Actions，可以把 GitHub Actions 內需要的環境變數都放進去

#### 踩到的坑

- 連結 EC2 時要的 hostname 不是在 ec2 terminal 打 hostname 後回應的那串 ip，是 AWS 的 Public IPv4 DNS

- Dockerfile 明明沒寫錯（在 EC2 上可以手動輸入指令跑起來），用 GithubAction 在虛擬機上建立指令時卻會報錯 `buildx failed with: ERROR: failed to solve: failed to compute cache key`
  解決方式：修改 `Build and push Dockerfile` 步驟的 context 設定，從預設的 `.` 改成 `./students/pei-tung/Canchu/`

- canchu 內的.env 檔沒辦法直接被 GitHub Action 讀到（因為沒有傳到 GitHub 上），所以用 GitHub Action 跑出來的映像檔會是壞的（沒有 .env 檔，所以 Canchu Server 內部關於資料庫 host 的設定都不存在）
  解決方式：使用 `docker cp .env canchu-server:/Canchu` 將 EC2 上本來就存在的 .env 檔貼到正在運行中的 canchu-server 容器
