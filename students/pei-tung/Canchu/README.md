## My sever Ip: 13.211.10.154

#### Continuous Integration / Continuous Delivery: Set up The GitHub Actions workflow

[GitHub Actions 參考](https://github.com/azole/cicd-test/blob/main/.github/workflows/build.yml)

思路：
git push 到特定分支（為了測試方便，先把這個分支設成了 week_5_part_2 ）-> 讓 Github Actions 的虛擬環境幫我把 container 建起來並跑 npm jest -> 連到 EC2 上，停掉原本可能在 EC2 上運行的容器 -> git pull 最新檔案 -> 再跑 docker-compose.yml -> 順利運行就結束

#### Note

- 為 GitHub Actions 設置環境變數：

  1.  登入 GitHub 然後進入 Repo
  1.  點 Repo 頁面右上角的 Settings
  1.  Settings 頁面的左側有一欄 Secrets and variables，底下有一欄 Actions，可以把 GitHub Actions 內需要的環境變數都放進去

- 在測試環境自動關閉 Rate Limiter：

  跟在測試環境自動切換資料庫的原理一樣，將 Rate Limiter 設置為當 `process.env.NODE_ENV !== 'test'`（即非測試環境）時才會開啟

- 本機的 .env 檔沒辦法直接被 GitHub Actions 讀到（因為沒有傳到 GitHub 上），所以用 GitHub Actions 跑出來的映像檔會是壞的：

  使用 echo 指令配上 GitHub Actions 的環境變數功能將 .env 檔貼到虛擬環境上的資料夾中，基本上保持資料夾結構與本機上的一致就可以了（需注意， GitHub Actions 上的檔案位置設定都是以專案的根目錄為起點，而且上一個 step 的移動不會影響到下一個 step，也就是說每一個 step 下 cd 指令時都要從根目錄從頭移動）

- 不知道在 container 開啟的情況下要怎麼跑 jest 指令（GitHub Actions 不支援 `docker exec -it <canchu container name>`，會回報 `err: the input device is not a TTY` ）：
  使用 `docker exec <canchu container name> npm test -- --watch=false`

  - `docker exec ` 與 `docker exec -it `
    - 兩者的主要差異在於互動性，使用`docker exec -it <canchu container name>` 可以讓使用者在容器內部進行交互式操作。而 `docker exec <canchu container name>` 只是執行命令而已，不提供額外的互動能力
  - `docker exec <canchu container name> npm test -- --watch=false`
    - `--`: 一個分隔符號，可以將 Docker 命令中的選項與要運行的命令區分開來
    - `--watch=false`: `--watch=false` 是 npm test 命令的一個選項。設置為 false 會禁用測試套件在文件更改時自動重新運行的功能。讓測試套件只會在我們明確地執行 npm test 命令時運行一次，不會因為文件的修改而一直重新運行

- GitHub Actions 上的 Jest 無法正常退出（報錯：`Jest did not exit one second after the test run has completed.`）導致無法進入下一步驟：

  報錯的原因應該是 userModel.js 中連結 sql 的 pool 在測試結束後依然在運作，如果用 pool.end() 解決會導致同一支 API 內的第一支 test 跑完後就不能動了，為了避免衍生問題最後用 `--forceExit` 直接強制把 jest 關掉了

- 連結 EC2 時要的 hostname 不是在 ec2 terminal 打 hostname 後回應的那串 ip，是 AWS 的 Public IPv4 DNS
