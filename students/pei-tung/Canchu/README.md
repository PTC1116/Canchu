## My sever Ip: 13.211.10.154

#### Continuous Integration / Continuous Delivery

Set up The GitHub Actions workflow
Trigger on: merge or push your new code to Github on main branch

1. Push your new code to Github on main branch
1. Push your docker to dockerhub.
1. Pull your docker from dockerhub on your EC2 machine and run it.

將 Docker Hub 的帳號密碼放入 GitHub Actions 的步驟：
登入 GitHub 並進入你的 Repository。
在 Repository 頁面的右上角，點擊"Settings"。
在"Settings"頁面的左側菜單中，選擇"Secrets"。
點擊"New repository secret"來新增一個新的 secret。
在"Name"欄位輸入 DOCKER_USERNAME，在"Value"欄位輸入你的 Docker Hub 帳號。
再次點擊"New repository secret"，新增另一個 secret。
在"Name"欄位輸入 DOCKER_PASSWORD，在"Value"欄位輸入你的 Docker Hub 密碼。
點擊"Add secret"保存這兩個 secret。
