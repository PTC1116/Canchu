## My sever Ip: 13.211.10.154

#### Build Cache Mechanism

1. Cache User's Profile
   - 將 Cache 分成了 **profile** 與 **friendship** 兩部分
     - profile 的 namespace：profile\_`被看的用戶id`，儲存的資料型態為 string
     - friendship 的 namespace：friendship\_*`看人的用戶 id*被看的用戶 id`，儲存的資料型態為 string
   - 為 userPictureUpdate 與 userProfileUpdate 新增了清除 Cache 的功能
   - 為 friend delete, agree, request 新增了清除 Cache 的功能
   - 配合 Cache 所需的參數在 userModel 新增了能回傳 _兩個用戶的關係_ 以及 _用戶好友數_ 的 getFriendship 功能；也修改了 friendModel 的 delete 功能，使其回傳被刪除好友的人的 id 以清除 Cache
