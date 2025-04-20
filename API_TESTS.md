# Wanderlust API 測試指令（curl 範例）

## Operator

### 註冊 Operator
```
curl -X POST http://localhost:3000/operators/register \
  -H "Content-Type: application/json" \
  -d '{"username":"op1","password":"pw123","email":"op1@example.com","agency":"TestAgency"}'
```

### Operator 登入（取得 JWT）
```
curl -X POST http://localhost:3000/operators/login \
  -H "Content-Type: application/json" \
  -d '{"username":"op1","password":"pw123"}'
```

## Member

### 註冊 Member
```
curl -X POST http://localhost:3000/members/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pw456","email":"user1@example.com"}'
```

### Member 登入（取得 JWT）
```
curl -X POST http://localhost:3000/members/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pw456"}'
```

### 上載頭像
```
curl -X POST http://localhost:3000/members/<memberId>/photo \
  -F "photo=@/path/to/photo.jpg"
```

## Hotel

### 搜尋酒店
```
curl "http://localhost:3000/hotels?city=Hong%20Kong&star=5"
```

### 新增酒店（需 JWT）
```
curl -X POST http://localhost:3000/hotels \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Hotel1","star":5,"address":"Central","city":"Hong Kong","country":"HK","price":1800}'
```

### 更新酒店（需 JWT）
```
curl -X PUT http://localhost:3000/hotels/<hotelId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"price":2000}'
```

### 刪除酒店（需 JWT）
```
curl -X DELETE http://localhost:3000/hotels/<hotelId> \
  -H "Authorization: Bearer <token>"
```

## Favourites

### 加入最愛
```
curl -X POST http://localhost:3000/members/<memberId>/favourites \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"hotelId":"<hotelId>"}'
```

### 查看最愛
```
curl http://localhost:3000/members/<memberId>/favourites \
  -H "Authorization: Bearer <token>"
```

### 移除最愛
```
curl -X DELETE http://localhost:3000/members/<memberId>/favourites/<hotelId> \
  -H "Authorization: Bearer <token>"
```

## Messaging

### 發送訊息
```
curl -X POST http://localhost:3000/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"toUserId":"<operatorId>","content":"Hello!"}'
```

### 回覆訊息
```
curl -X POST http://localhost:3000/messages/<messageId>/reply \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Thanks!"}'
```

### 查看訊息
```
curl http://localhost:3000/messages?userId=<userId> \
  -H "Authorization: Bearer <token>"
```

### 刪除訊息
```
curl -X DELETE http://localhost:3000/messages/<messageId> \
  -H "Authorization: Bearer <token>"
```

---

- 所有 `<token>` 請用登入回傳嘅 JWT。
- `<memberId>`, `<hotelId>`, `<operatorId>`, `<messageId>` 請用實際資料。
- 測試時如遇 401/403，請檢查 Authorization header。
