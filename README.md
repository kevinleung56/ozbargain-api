<!-- Generator: Widdershins v4.0.1 -->

<h1 id="ozbargain-api">Ozbargain API v1.0.0</h1>

### This is an api that parses, cleans and serves Ozbargain's data in a form that others can use

- npm install required
- AWS credentials required in env file
- Hosted on serverless with AWS Lambda

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Base URLs:

- <a href="https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com">https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com</a>

Web: <a href="https://github.com/kevinleung56/ozbargain-api">GitHub Repository</a>

<h1 id="ozbargain-api-deals">deals</h1>

Deal posts

## get\_\_deals

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch('https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com/deals', {
  method: 'GET',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`GET /deals`

_Get all front-page deals_

> Example responses

> 200 Response

```json
[
  {
    "title": "string",
    "meta": {
      "submitted": {
        "associated": "string",
        "author": "string",
        "thirdParty": "string"
      },
      "image": "http://example.com"
    },
    "coupon": "string",
    "description": "string",
    "vote": {
      "up": "string",
      "down": "string"
    },
    "gravatar": "http://example.com",
    "snapshot": {
      "link": "string",
      "image": "http://example.com"
    },
    "category": "string"
  }
]
```

<h3 id="get__deals-responses">Responses</h3>

| Status | Meaning                                                                  | Description                   | Schema |
| ------ | ------------------------------------------------------------------------ | ----------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Array of all front-page deals | Inline |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Server error                  | None   |

<h3 id="get__deals-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type                    | Required | Restrictions | Description |
| -------------- | ----------------------- | -------- | ------------ | ----------- |
| _anonymous_    | [[Deals](#schemadeals)] | false    | none         | none        |
| » title        | string(string)          | true     | none         | none        |
| » meta         | object                  | true     | none         | none        |
| »» submitted   | object                  | false    | none         | none        |
| »»» associated | string(string)          | false    | none         | none        |
| »»» author     | string(string)          | true     | none         | none        |
| »»» thirdParty | string(string)          | false    | none         | none        |
| »» image       | string(uri)             | false    | none         | none        |
| » coupon       | string(string)          | false    | none         | none        |
| » description  | string(string)          | true     | none         | none        |
| » vote         | object                  | false    | none         | none        |
| »» up          | string(string)          | false    | none         | none        |
| »» down        | string(string)          | false    | none         | none        |
| » gravatar     | string(uri)             | true     | none         | none        |
| » snapshot     | object                  | true     | none         | none        |
| »» link        | string(string)          | false    | none         | none        |
| »» image       | string(uri)             | false    | none         | none        |
| » category     | string(string)          | false    | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

## get\_\_deals_live

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch(
  'https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com/deals/live',
  {
    method: 'GET',

    headers: headers,
  }
)
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`GET /deals/live`

_Get newest deals_

> Example responses

> 200 Response

```json
[
  {
    "title": "string",
    "link": "string",
    "meta": {
      "submitted": {
        "associated": "string",
        "author": "string",
        "thirdParty": "string"
      },
      "image": "http://example.com"
    },
    "coupon": "string",
    "description": "string",
    "vote": {
      "up": "string",
      "down": "string"
    },
    "snapshot": {
      "link": "string",
      "image": "http://example.com"
    },
    "category": "string"
  }
]
```

<h3 id="get__deals_live-responses">Responses</h3>

| Status | Meaning                                                                  | Description           | Schema |
| ------ | ------------------------------------------------------------------------ | --------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Array of newest deals | Inline |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Server error          | None   |

<h3 id="get__deals_live-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type                          | Required | Restrictions | Description |
| -------------- | ----------------------------- | -------- | ------------ | ----------- |
| _anonymous_    | [[LiveDeal](#schemalivedeal)] | false    | none         | none        |
| » title        | string(string)                | true     | none         | none        |
| » link         | string(string)                | true     | none         | none        |
| » meta         | object                        | true     | none         | none        |
| »» submitted   | object                        | false    | none         | none        |
| »»» associated | string(string)                | false    | none         | none        |
| »»» author     | string(string)                | true     | none         | none        |
| »»» thirdParty | string(string)                | false    | none         | none        |
| »» image       | string(uri)                   | false    | none         | none        |
| » coupon       | string(string)                | false    | none         | none        |
| » description  | string(string)                | true     | none         | none        |
| » vote         | object                        | false    | none         | none        |
| »» up          | string(string)                | false    | none         | none        |
| »» down        | string(string)                | false    | none         | none        |
| » snapshot     | object                        | true     | none         | none        |
| »» link        | string(string)                | false    | none         | none        |
| »» image       | string(uri)                   | false    | none         | none        |
| » category     | string(string)                | false    | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ozbargain-api-deal">deal</h1>

Specific posts

## get\__deal_{dealId}

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch(
  'https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com/deal/{dealId}',
  {
    method: 'GET',

    headers: headers,
  }
)
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`GET /deal/{dealId}`

_Gets a specific deal via node id_

<h3 id="get__deal_{dealid}-parameters">Parameters</h3>

| Name     | In    | Type    | Required | Description                              |
| -------- | ----- | ------- | -------- | ---------------------------------------- |
| dealId   | path  | integer | true     | Numeric ID of the deal to get            |
| comments | query | boolean | false    | Array of comments in top-to-bottom order |

> Example responses

> 200 Response

```json
{}
```

<h3 id="get__deal_{dealid}-responses">Responses</h3>

| Status | Meaning                                                                  | Description  | Schema |
| ------ | ------------------------------------------------------------------------ | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Deal object  | Inline |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Server error | None   |

<h3 id="get__deal_{dealid}-responseschema">Response Schema</h3>

Status Code **200**

| Name             | Type              | Required | Restrictions | Description |
| ---------------- | ----------------- | -------- | ------------ | ----------- |
| » id             | integer(int64)    | true     | none         | none        |
| » title          | string(string)    | true     | none         | none        |
| » meta           | object            | true     | none         | none        |
| »» submitted     | object            | false    | none         | none        |
| »»» associated   | string(string)    | false    | none         | none        |
| »»» author       | string(string)    | true     | none         | none        |
| »»» thirdParty   | string(string)    | false    | none         | none        |
| »»» date         | string(date-time) | true     | none         | none        |
| »»» image        | string(uri)       | false    | none         | none        |
| »»» labels       | [string]          | false    | none         | none        |
| »»» freebie      | boolean           | false    | none         | none        |
| »»» expiryDate   | string(date-time) | false    | none         | none        |
| »»» upcomingDate | string(date-time) | false    | none         | none        |
| » coupon         | string(string)    | false    | none         | none        |
| » description    | string(string)    | true     | none         | none        |
| » vote           | object            | false    | none         | none        |
| »» up            | string(string)    | false    | none         | none        |
| »» down          | string(string)    | false    | none         | none        |
| » snapshot       | object            | true     | none         | none        |
| »» link          | string(string)    | false    | none         | none        |
| »» image         | string(uri)       | false    | none         | none        |
| » category       | string(string)    | false    | none         | none        |
| » tags           | [string]          | false    | none         | none        |
| » comments       | [object]          | false    | none         | none        |
| »» id            | string(string)    | false    | none         | none        |
| »» level         | string(string)    | false    | none         | none        |
| »» content       | string(string)    | false    | none         | none        |
| »» image         | string(uri)       | false    | none         | none        |
| »» author        | string(string)    | false    | none         | none        |
| »» date          | string(date-time) | false    | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ozbargain-api-forums">forums</h1>

All top-level forums

## post\_\_forums

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch('https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com/forums', {
  method: 'POST',

  headers: headers,
})
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`POST /forums`

> Example responses

> 200 Response

```json
{}
```

<h3 id="post__forums-responses">Responses</h3>

| Status | Meaning                                                                  | Description  | Schema |
| ------ | ------------------------------------------------------------------------ | ------------ | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | All forums   | Inline |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Server error | None   |

<h3 id="post__forums-responseschema">Response Schema</h3>

Status Code **200**

| Name           | Type           | Required | Restrictions | Description |
| -------------- | -------------- | -------- | ------------ | ----------- |
| » forumType    | string(string) | false    | none         | none        |
| » forum        | object         | false    | none         | none        |
| »» author      | string(string) | false    | none         | none        |
| »» description | string(string) | false    | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ozbargain-api-forum">forum</h1>

All top-level threads for a forum

## get\__forum_{forumId}

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch(
  'https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com/forum/{forumId}',
  {
    method: 'GET',

    headers: headers,
  }
)
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`GET /forum/{forumId}`

_Gets a specific forum via node id_

<h3 id="get__forum_{forumid}-parameters">Parameters</h3>

| Name     | In    | Type    | Required | Description                              |
| -------- | ----- | ------- | -------- | ---------------------------------------- |
| forumId  | path  | integer | true     | Numeric ID of the forum to get           |
| comments | query | boolean | false    | Array of comments in top-to-bottom order |

> Example responses

> 200 Response

```json
{}
```

<h3 id="get__forum_{forumid}-responses">Responses</h3>

| Status | Meaning                                                                  | Description               | Schema |
| ------ | ------------------------------------------------------------------------ | ------------------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Specific forum and topics | Inline |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Server error              | None   |

<h3 id="get__forum_{forumid}-responseschema">Response Schema</h3>

Status Code **200**

| Name        | Type              | Required | Restrictions | Description |
| ----------- | ----------------- | -------- | ------------ | ----------- |
| » topic     | string(string)    | false    | none         | none        |
| » replies   | object            | false    | none         | none        |
| »» existing | string(string)    | false    | none         | none        |
| »» new      | string(string)    | false    | none         | none        |
| » created   | object            | false    | none         | none        |
| »» img      | string(string)    | false    | none         | none        |
| »» author   | string(string)    | false    | none         | none        |
| »» date     | string(date-time) | false    | none         | none        |
| » lastReply | object            | false    | none         | none        |
| »» img      | string(string)    | false    | none         | none        |
| »» author   | string(string)    | false    | none         | none        |
| »» date     | string(date-time) | false    | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="ozbargain-api-node">node</h1>

Specific forum posts

## get\__node_{nodeId}

> Code samples

```javascript
const headers = {
  Accept: 'application/json',
};

fetch(
  'https://b3bc03c4lg.execute-api.ap-southeast-2.amazonaws.com/node/{nodeId}',
  {
    method: 'GET',

    headers: headers,
  }
)
  .then(function (res) {
    return res.json();
  })
  .then(function (body) {
    console.log(body);
  });
```

`GET /node/{nodeId}`

_Gets a specific deal via node id_

<h3 id="get__node_{nodeid}-parameters">Parameters</h3>

| Name     | In    | Type    | Required | Description                              |
| -------- | ----- | ------- | -------- | ---------------------------------------- |
| nodeId   | path  | integer | true     | Numeric ID of the node to get            |
| comments | query | boolean | false    | Array of comments in top-to-bottom order |

> Example responses

> 200 Response

```json
{}
```

<h3 id="get__node_{nodeid}-responses">Responses</h3>

| Status | Meaning                                                                  | Description   | Schema |
| ------ | ------------------------------------------------------------------------ | ------------- | ------ |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)                  | Specific deal | Inline |
| 503    | [Service Unavailable](https://tools.ietf.org/html/rfc7231#section-6.6.4) | Server error  | None   |

<h3 id="get__node_{nodeid}-responseschema">Response Schema</h3>

Status Code **200**

| Name         | Type              | Required | Restrictions | Description |
| ------------ | ----------------- | -------- | ------------ | ----------- |
| » id         | integer(int64)    | true     | none         | none        |
| » title      | string(string)    | true     | none         | none        |
| » meta       | object            | true     | none         | none        |
| »» submitted | object            | false    | none         | none        |
| »»» avatar   | string(uri)       | true     | none         | none        |
| »»» author   | string(string)    | true     | none         | none        |
| »»» date     | string(date-time) | true     | none         | none        |
| » content    | string(string)    | true     | none         | none        |
| » comments   | [object]          | false    | none         | none        |
| »» id        | string(string)    | false    | none         | none        |
| »» level     | string(string)    | false    | none         | none        |
| »» content   | string(string)    | false    | none         | none        |
| »» image     | string(uri)       | false    | none         | none        |
| »» author    | string(string)    | false    | none         | none        |
| »» date      | string(date-time) | false    | none         | none        |

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Deals">Deals</h2>
<!-- backwards compatibility -->
<a id="schemadeals"></a>
<a id="schema_Deals"></a>
<a id="tocSdeals"></a>
<a id="tocsdeals"></a>

```json
{
  "title": "string",
  "meta": {
    "submitted": {
      "associated": "string",
      "author": "string",
      "thirdParty": "string"
    },
    "image": "http://example.com"
  },
  "coupon": "string",
  "description": "string",
  "vote": {
    "up": "string",
    "down": "string"
  },
  "gravatar": "http://example.com",
  "snapshot": {
    "link": "string",
    "image": "http://example.com"
  },
  "category": "string"
}
```

### Properties

| Name          | Type           | Required | Restrictions | Description |
| ------------- | -------------- | -------- | ------------ | ----------- |
| title         | string(string) | true     | none         | none        |
| meta          | object         | true     | none         | none        |
| » submitted   | object         | false    | none         | none        |
| »» associated | string(string) | false    | none         | none        |
| »» author     | string(string) | true     | none         | none        |
| »» thirdParty | string(string) | false    | none         | none        |
| » image       | string(uri)    | false    | none         | none        |
| coupon        | string(string) | false    | none         | none        |
| description   | string(string) | true     | none         | none        |
| vote          | object         | false    | none         | none        |
| » up          | string(string) | false    | none         | none        |
| » down        | string(string) | false    | none         | none        |
| gravatar      | string(uri)    | true     | none         | none        |
| snapshot      | object         | true     | none         | none        |
| » link        | string(string) | false    | none         | none        |
| » image       | string(uri)    | false    | none         | none        |
| category      | string(string) | false    | none         | none        |

<h2 id="tocS_LiveDeal">LiveDeal</h2>
<!-- backwards compatibility -->
<a id="schemalivedeal"></a>
<a id="schema_LiveDeal"></a>
<a id="tocSlivedeal"></a>
<a id="tocslivedeal"></a>

```json
{
  "title": "string",
  "link": "string",
  "meta": {
    "submitted": {
      "associated": "string",
      "author": "string",
      "thirdParty": "string"
    },
    "image": "http://example.com"
  },
  "coupon": "string",
  "description": "string",
  "vote": {
    "up": "string",
    "down": "string"
  },
  "snapshot": {
    "link": "string",
    "image": "http://example.com"
  },
  "category": "string"
}
```

### Properties

| Name          | Type           | Required | Restrictions | Description |
| ------------- | -------------- | -------- | ------------ | ----------- |
| title         | string(string) | true     | none         | none        |
| link          | string(string) | true     | none         | none        |
| meta          | object         | true     | none         | none        |
| » submitted   | object         | false    | none         | none        |
| »» associated | string(string) | false    | none         | none        |
| »» author     | string(string) | true     | none         | none        |
| »» thirdParty | string(string) | false    | none         | none        |
| » image       | string(uri)    | false    | none         | none        |
| coupon        | string(string) | false    | none         | none        |
| description   | string(string) | true     | none         | none        |
| vote          | object         | false    | none         | none        |
| » up          | string(string) | false    | none         | none        |
| » down        | string(string) | false    | none         | none        |
| snapshot      | object         | true     | none         | none        |
| » link        | string(string) | false    | none         | none        |
| » image       | string(uri)    | false    | none         | none        |
| category      | string(string) | false    | none         | none        |

<h2 id="tocS_Deal">Deal</h2>
<!-- backwards compatibility -->
<a id="schemadeal"></a>
<a id="schema_Deal"></a>
<a id="tocSdeal"></a>
<a id="tocsdeal"></a>

```json
{
  "id": 0,
  "title": "string",
  "meta": {
    "submitted": {
      "associated": "string",
      "author": "string",
      "thirdParty": "string",
      "date": "2019-08-24T14:15:22Z",
      "image": "http://example.com",
      "labels": ["string"],
      "freebie": true,
      "expiryDate": "2019-08-24T14:15:22Z",
      "upcomingDate": "2019-08-24T14:15:22Z"
    }
  },
  "coupon": "string",
  "description": "string",
  "vote": {
    "up": "string",
    "down": "string"
  },
  "snapshot": {
    "link": "string",
    "image": "http://example.com"
  },
  "category": "string",
  "tags": ["string"],
  "comments": [
    {
      "id": "string",
      "level": "string",
      "content": "string",
      "image": "http://example.com",
      "author": "string",
      "date": "2019-08-24T14:15:22Z"
    }
  ]
}
```

### Properties

| Name            | Type              | Required | Restrictions | Description |
| --------------- | ----------------- | -------- | ------------ | ----------- |
| id              | integer(int64)    | true     | none         | none        |
| title           | string(string)    | true     | none         | none        |
| meta            | object            | true     | none         | none        |
| » submitted     | object            | false    | none         | none        |
| »» associated   | string(string)    | false    | none         | none        |
| »» author       | string(string)    | true     | none         | none        |
| »» thirdParty   | string(string)    | false    | none         | none        |
| »» date         | string(date-time) | true     | none         | none        |
| »» image        | string(uri)       | false    | none         | none        |
| »» labels       | [string]          | false    | none         | none        |
| »» freebie      | boolean           | false    | none         | none        |
| »» expiryDate   | string(date-time) | false    | none         | none        |
| »» upcomingDate | string(date-time) | false    | none         | none        |
| coupon          | string(string)    | false    | none         | none        |
| description     | string(string)    | true     | none         | none        |
| vote            | object            | false    | none         | none        |
| » up            | string(string)    | false    | none         | none        |
| » down          | string(string)    | false    | none         | none        |
| snapshot        | object            | true     | none         | none        |
| » link          | string(string)    | false    | none         | none        |
| » image         | string(uri)       | false    | none         | none        |
| category        | string(string)    | false    | none         | none        |
| tags            | [string]          | false    | none         | none        |
| comments        | [object]          | false    | none         | none        |
| » id            | string(string)    | false    | none         | none        |
| » level         | string(string)    | false    | none         | none        |
| » content       | string(string)    | false    | none         | none        |
| » image         | string(uri)       | false    | none         | none        |
| » author        | string(string)    | false    | none         | none        |
| » date          | string(date-time) | false    | none         | none        |

<h2 id="tocS_Node">Node</h2>
<!-- backwards compatibility -->
<a id="schemanode"></a>
<a id="schema_Node"></a>
<a id="tocSnode"></a>
<a id="tocsnode"></a>

```json
{
  "id": 0,
  "title": "string",
  "meta": {
    "submitted": {
      "avatar": "http://example.com",
      "author": "string",
      "date": "2019-08-24T14:15:22Z"
    }
  },
  "content": "string",
  "comments": [
    {
      "id": "string",
      "level": "string",
      "content": "string",
      "image": "http://example.com",
      "author": "string",
      "date": "2019-08-24T14:15:22Z"
    }
  ]
}
```

### Properties

| Name        | Type              | Required | Restrictions | Description |
| ----------- | ----------------- | -------- | ------------ | ----------- |
| id          | integer(int64)    | true     | none         | none        |
| title       | string(string)    | true     | none         | none        |
| meta        | object            | true     | none         | none        |
| » submitted | object            | false    | none         | none        |
| »» avatar   | string(uri)       | true     | none         | none        |
| »» author   | string(string)    | true     | none         | none        |
| »» date     | string(date-time) | true     | none         | none        |
| content     | string(string)    | true     | none         | none        |
| comments    | [object]          | false    | none         | none        |
| » id        | string(string)    | false    | none         | none        |
| » level     | string(string)    | false    | none         | none        |
| » content   | string(string)    | false    | none         | none        |
| » image     | string(uri)       | false    | none         | none        |
| » author    | string(string)    | false    | none         | none        |
| » date      | string(date-time) | false    | none         | none        |

<h2 id="tocS_Forum">Forum</h2>
<!-- backwards compatibility -->
<a id="schemaforum"></a>
<a id="schema_Forum"></a>
<a id="tocSforum"></a>
<a id="tocsforum"></a>

```json
{
  "topic": "string",
  "replies": {
    "existing": "string",
    "new": "string"
  },
  "created": {
    "img": "string",
    "author": "string",
    "date": "2019-08-24T14:15:22Z"
  },
  "lastReply": {
    "img": "string",
    "author": "string",
    "date": "2019-08-24T14:15:22Z"
  }
}
```

### Properties

| Name       | Type              | Required | Restrictions | Description |
| ---------- | ----------------- | -------- | ------------ | ----------- |
| topic      | string(string)    | false    | none         | none        |
| replies    | object            | false    | none         | none        |
| » existing | string(string)    | false    | none         | none        |
| » new      | string(string)    | false    | none         | none        |
| created    | object            | false    | none         | none        |
| » img      | string(string)    | false    | none         | none        |
| » author   | string(string)    | false    | none         | none        |
| » date     | string(date-time) | false    | none         | none        |
| lastReply  | object            | false    | none         | none        |
| » img      | string(string)    | false    | none         | none        |
| » author   | string(string)    | false    | none         | none        |
| » date     | string(date-time) | false    | none         | none        |

<h2 id="tocS_Forums">Forums</h2>
<!-- backwards compatibility -->
<a id="schemaforums"></a>
<a id="schema_Forums"></a>
<a id="tocSforums"></a>
<a id="tocsforums"></a>

```json
{
  "forumType": "string",
  "forum": {
    "author": "string",
    "description": "string"
  }
}
```

### Properties

| Name          | Type           | Required | Restrictions | Description |
| ------------- | -------------- | -------- | ------------ | ----------- |
| forumType     | string(string) | false    | none         | none        |
| forum         | object         | false    | none         | none        |
| » author      | string(string) | false    | none         | none        |
| » description | string(string) | false    | none         | none        |
