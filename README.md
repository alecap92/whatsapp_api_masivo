# Executions scripts

```

    npm start //start the server with nodemon
    npm run build //build the project to js
    npm run ts  //start project with ts-node
    npm run fmt //format the code with prettier

```

# Project structure

```

    src
    |-- auth
    |   └── user.ts
    |-- middlewares
    |   └── user.ts
    ├── models
    │   └── user.ts
    ├── repository
    │   └── user.ts
    ├── routes
    │   └── user.ts
    ├── services
    │   └── user.ts
    |-- validationsSchemas
    |   └── user.ts
    ├── utils
    │   └── xx.ts
    ├── db.ts
    └── index.ts

```

# Env variables

```

    PORT=3000
    MONGO_URI=mongodb://localhost:27017/your_db
    JWT_SECRET=your_secret
    META_URL=https://graph.facebook.com/v18.0/
    MAX_NUMBER_OF_MESSAGES=200

```

## Getting Started

Before using the application, you need to register and login.

### Registration

To register a new user, make a POST request to the `/api/v1/user/register` endpoint with the following parameters:

- `name`: The name of the user.
- `phone`: The phone number of the user.
- `password`: The password for the user account.

Example request:

```bash

curl -X POST http://localhost:3000/api/v1/user/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "phone": "1234567890",
    "password": "password123"
  }'

```

## Login

Once registered, you can login using the phone number and password. Once logged in the autorization header should be saved on the cookies
if they are not disabled.

To login, make a POST request to the `/api/v1/user/login` endpoint with the following parameters:

- `phone`: The phone number of the user.
- `password`: The password for the user account.

**Example request:**

```bash

curl -X POST http://localhost:3000/api/v1/user/login \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": "1234567890",
    "password": "password123"
  }'

```

## Saving Contacts

Contacts should be provided as an array, even if there is only one contact. Each contact should include the `userId` to specify the user it belongs to.

To obtain the `userId`, make a GET request to the `/api/v1/protected` endpoint.

Send a POST request to the `/api/v1/contact/add` endpoint with the following parameters:

  - `userId`: The ID of the user that the contact belongs to.
  - `name`: The name of the contact.
  - `phone`: The phone number of the contact.

**Example request with multiple contacts:**

```bash

curl -X POST http://localhost:3000/api/v1/contact/add \
  -H 'Content-Type: application/json' \
  -d '{
    [
      {"userId": "123456789", "name": "John Doe", "phone": "1234567890"},
      {"userId": "123456789", "name": "Jane Smith", "phone": "9876543210"}
    ]
  }'

```

## Retrieving User Contacts

To get a list of contacts for a user, make a GET request to the `/api/v1/contact/list` endpoint.

**Example request:**

```bash

curl -X GET http://localhost:3000/api/v1/contact/list

```

## Sending WhatsApp Messages

To send WhatsApp messages using a template, make a POST request to the `/api/v1/template/send` endpoint with the following request body:

```json

{
  "templateName": "Name of the template",
  "key": "Unique access token that you can generate on the whatsapp api configuration on Meta for developers platform",
  "receiverPhones": ["phone1", "phone2", ...],
  "wsIdentifier": "Identifier for the WhatsApp Number sender that you can also get on the Meta for developers platform",
  "language": "The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it."
}

```

**Example request:**

```bash

curl -X POST http://localhost:3000/api/v1/template/send \
  -H 'Content-Type: application/json' \
  -d '{
    "templateName": "hello_world",
    "key": "TOTALLY SECRET ENCRYPTED KEY",
    "receiverPhones": ["1234567890", "9876543210"],
    "wsIdentifier": "1123581321",
    "language": "The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it."
  }'

```

## Sending WhatsApp Messages in Bulk

To send WhatsApp messages in bulk using a file, make a POST request to the `/api/v1/template/send_massive` endpoint. In the request body, use `multipart/form-data` and include the following fields:

- `templateName`: The name of the template to use for the messages.
- `key`: Unique access token that you can generate on the whatsapp api configuration on Meta for developers platform
- `file`: The Excel (XLS, XLSX) or CSV file containing the message data. The first row must contain column headers: `Name`, `Phone`, `Variable`, followed by the data rows with corresponding values.
- `wsIdentifier`: Identifier for the WhatsApp Number sender that you can also get on the Meta for developers platform
- `language`: The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it.

The file should have this structure:

<div align="center">

| Name   | Phone         | Variable |
|--------|---------------|----------|
| Name1  | 12312312312   | tex1     |
| Name2  | 12312031203   | text2    |

</div>


**Example request:**

```bash
curl -X POST http://localhost:3000/api/v1/template/send_massive \
  -F 'templateName=Welcome Template' \
  -F 'key=welcome_template' \
  -F 'file=@/path/to/contacts.xlsx' \
  -F 'wsIdentifier=1123581321'
  -F 'language=en'
