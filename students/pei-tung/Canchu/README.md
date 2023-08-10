## My sever Ip: 13.211.10.154

#### Auto Scaling

1. Create Launch Template with AMI（Auto Scaling 會根據 Launch Template 去開 EC2）
1. Create Auto Scaling Groups with the above launch configurations
1. Attach to the ALB created in Week 5 part 4
1. Set the following configuration:


    - Desired capacity: 1 (預計會需要的 EC2 數量)
    - Minimum capacity: 1
    - Maximum capacity: 3 （加上原本就在 Load Balancer 中的兩台 EC2，最多總共可以打出五台）

1. Configure Scaling policies:


    - Average CPU utilization = 2 （這樣比較容易把其他兩台打出來了）

#### Note

- 在 RDS 內有 4000 篇貼文的情況下，k6 script 設置每秒發出 40 個請求時，http_req_duration 的中位數就超出 1 秒了;k6 script 設置每秒發出 30 個請求時，http_req_duration 的中位數大約是 207ms
- 發現 SQL 的瓶頸是
  ```IF((SELECT COUNT(likes.post) FROM likes WHERE likes.post = p.id AND like_user = ?) > 0, true, false) AS is_liked,
    (SELECT COUNT(likes.id) FROM likes WHERE likes.post = p.id) AS like_count,
    (SELECT COUNT(comments.id) FROM comments WHERE comments.post = p.id) AS comment_count
  ```
  除此之外，用了太多 Union，應該用 JOIN 去取代
- 如果瓶頸是 RDS （不管打幾筆 req 都需要 1 秒才能回傳資料，打 1 筆是 1 秒，1000 筆還是 1 秒），可以考慮擴展 RDS
