# User API Spec

## Register User
Endpoint : POST /api/user

Request Body :
```json
{
    "fullname": "Muhammad Habibullah",
    "email": "me@hebobibun.com",
    "password": "123456"
}
```

Response Body (Success - 201) :
```json
{
    "data": {
        "fullname": "Muhammad Habibullah",
        "email": "me@hebobibun.com"
    }
}
```

Response Body (Error - 400) :
```json
{
    "errors": "Email shouldn't be empty"
}
```

## Login User
Endpoint : POST /api/user/login

Request Body :
```json
{
    "email": "me@hebobibun.com",
    "password": "123456"
}
```

Response Body (Success - 200) :
```json
{
    "data": {
        "fullname": "Muhammad Habibullah",
        "session_id": "session-id-here"
    }
}
```

Response Body (Error - 400) :
```json
{
    "errors": "Email or password is invalid"
}
```

## Get User
Endpoint : GET /api/user/current

Request Header :
- Authorization : Bearer {session_id}

Response Body (Success - 200) :
```json
{
    "data": {
        "fullname": "Muhammad Habibullah",
        "email": "me@hebobibun.com"
    }
}
```

## Update User
Endpoint : PATCH /api/user/current

Request Header :
- Authorization : Bearer {session_id}

Request Body :
```json
{
    "fullname": "Muhammad Habibullah",
    "email": "me@hebobibun.com"
}
```

Response Body (Success - 200) :
```json
{
    "data": {
        "fullname": "Muhammad Habibullah",
        "email": "me@hebobibun.com"
    }
}
```

## Logout User
Endpoint : DELETE /api/user/current

Request Header :
- Authorization : Bearer {session_id}

Response Body (Success - 200) :
```json
{
    "data": true
}
```