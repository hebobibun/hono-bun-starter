# Address API Spec

## Create address
Endpoint : POST /api/contacts/{contact_id}/addresses

Request Header :
- Authorization : Bearer {session_id}

Request Body :
```json
{
    "street": "street name",
    "city": "city name",
    "province": "province name",
    "country": "country name",
    "postal_code": "postal code"
}
```

Response Body :
```json
{
    "data": {
        "id": 1,
        "street": "street name",
        "city": "city name",
        "province": "province name",
        "country": "country name",
        "postal_code": "postal code"
    }
}
```

## Get address
Endpoint : GET /api/contacts/{contact_id}/addresses/{address_id}

Request Header :
- Authorization : Bearer {session_id}

Response Body :
```json
{
    "data": {
        "id": 1,
        "street": "street name",
        "city": "city name",
        "province": "province name",
        "country": "country name",
        "postal_code": "postal code"
    }
}
```

## Update address
Endpoint : PUT /api/contacts/{contact_id}/addresses/{address_id}

Request Header :
- Authorization : Bearer {session_id}

Request Body :
```json
{
    "street": "street name",
    "city": "city name",
    "province": "province name",
    "country": "country name",
    "postal_code": "postal code"
}
```

Response Body :
```json
{
    "data": {
        "id": 1,
        "street": "street name",
        "city": "city name",
        "province": "province name",
        "country": "country name",
        "postal_code": "postal code"
    }
}
```

## List address
Endpoint : GET /api/contacts/{contact_id}/addresses

Request Header :
- Authorization : Bearer {session_id}

Response Body :
```json
{
    "data": [
        {
            "id": 1,
            "street": "street name",
            "city": "city name",
            "province": "province name",
            "country": "country name",
            "postal_code": "postal code"
        },
        {
            "id": 2,
            "street": "street name",
            "city": "city name",
            "province": "province name",
            "country": "country name",
            "postal_code": "postal code"
        }
    ]
}
```

## Remove address
Endpoint : DELETE /api/contacts/{contact_id}/addresses/{address_id}

Request Header :
- Authorization : Bearer {session_id}

Response Body :
```json
{
    "data": true
}
```