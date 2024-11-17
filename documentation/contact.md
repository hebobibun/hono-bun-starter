# Contact API Spec

## Create contact
Endpoint : POST /api/contact

Request Header :
- Authorization : Bearer {session_id}

Request Body :
```json
{
    "first_name": "Muhammad",
    "last_name": "Habibullah",
    "email": "me@hebobibun.com",
    "phone": "08123456789"
}
```

Response Body :
```json
{
    "data": {
        "id": 1,
        "first_name": "Muhammad",
        "last_name": "Habibullah",
        "email": "me@hebobibun.com",
        "phone": "08123456789"
    }
}
```


## Get contact
Endpoint : GET /api/contact/{id}

Request Header :
- Authorization : Bearer {session_id}

Response Body :
```json
{
    "data": {
        "id": 1,
        "first_name": "Muhammad",
        "last_name": "Habibullah",
        "email": "me@hebobibun.com",
        "phone": "08123456789"
    }
}
```

## Update contact
Endpoint : PUT /api/contact/{id}

Request Header :
- Authorization : Bearer {session_id}

Request Body :
```json
{
    "first_name": "Muhammad",
    "last_name": "Habibullah",
    "email": "me@hebobibun.com",
    "phone": "08123456789"
}
```

Response Body :
```json
{
    "data": {
        "id": 1,
        "first_name": "Muhammad",
        "last_name": "Habibullah",
        "email": "me@hebobibun.com",
        "phone": "08123456789"
    }
}
```

## Search contact
Endpoint : GET /api/contact

Request Header :
- Authorization : Bearer {session_id}

Query Parameter :
- name : string
- email : string
- phone : string
- page : number, default 1
- size : number, default 10

Response Body :
```json
{
    "data": [
        {
            "id": 1,
            "first_name": "Muhammad",
            "last_name": "Habibullah",
            "email": "me@hebobibun.com",
            "phone": "08123456789"
        },
        ...
    ],
    "meta": {
        "current_page": 1,
        "total_page": 1,
        "size": 10,
    }
}
```

## Delete contact
Endpoint : DELETE /api/contact/{id}

Request Header :
- Authorization : Bearer {session_id}

Response Body :
```json
{
    "data": true
}
```