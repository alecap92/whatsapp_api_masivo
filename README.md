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
    MAX_NUMBER_OF_MESSAGES=200

```

## Getting Started

## Sending WhatsApp Messages

To send WhatsApp messages using a template, make a POST request to the `/api/v1/template/json` endpoint with the following request body.

You should be aware of a property called "hasVars" that is a boolean that in case that is false the request should have this structure:

```json

{
  "templateName": "Name of the template",
  "key": "Unique access token that you can generate on the whatsapp api configuration on Meta for developers platform",
  "receiverPhones": ["phone1", "phone2", ...],
  "wsIdentifier": "Identifier for the WhatsApp Number sender that you can also get on the Meta for developers platform",
  "language": "The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it.",
  "hasVars": "Is the boolean representing if the request gonna be sent with variables or not, here should be 'false' "
  "vars", ["an array os string", "containing the vars that are gonna be sent with the template"]
}

```

in case that the property called "hasVars" is true, the request should be like this:

```json

{
  "templateName": "Name of the template",
  "key": "Unique access token that you can generate on the whatsapp api configuration on Meta for developers platform",
  "receiverPhonesWithVars": [
  {
      "phone": "12345678",
      "vars": ["var1", "var2", ...]
  },
  {
      "phone": "87654321",
      "vars": ["var1", "var2", ...]
  }
  ],
  "wsIdentifier": "Identifier for the WhatsApp Number sender that you can also get on the Meta for developers platform",
  "language": "The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it.",
  "hasVars": "Is the boolean representing if the request gonna be sent with variables or not, here should be 'true' "
  "vars", ["an array os string", "containing the vars that are gonna be sent with the template"]
}

```

**Example request:**

In case "hasVars" is true

```bash

curl -X POST http://localhost:3000/api/v1/template/json \
  -H 'Content-Type: application/json' \
  -d '{
    "templateName": "hello_world",
    "key": "TOTALLY SECRET ENCRYPTED KEY",
    "receiverPhonesWithVars": [
     {
         "phone": "12345678",
         "vars": ["var1", "var2", ...]
     },
     {
          "phone": "87654321",
        "vars": ["var1", "var2", ...]
     }
     ],
    "wsIdentifier": "1123581321",
    "language": "The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it."
    "hasVars": true,
  }'

```

In case "hasVars" is false

```bash

curl -X POST http://localhost:3000/api/v1/template/json \
  -H 'Content-Type: application/json' \
  -d '{
    "templateName": "hello_world",
    "key": "TOTALLY SECRET ENCRYPTED KEY",
    "receiverPhones": ["1234567890", "9876543210"],
    "wsIdentifier": "1123581321",
    "language": "The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it."
    "hasVars": false,
  }'

```



## Sending WhatsApp Messages in Bulk

To send WhatsApp messages in bulk using a file, make a POST request to the `/api/v1/template/file` endpoint. In the request body, use `multipart/form-data` and include the following fields:

- `templateName`: The name of the template to use for the messages.
- `key`: Unique access token that you can generate on the whatsapp api configuration on Meta for developers platform
- `file`: The Excel (XLS, XLSX) or CSV file containing the message data. The first row must contain column headers: `Name`, `Phone`, `Variable`, followed by the data rows with corresponding values.
- `wsIdentifier`: Identifier for the WhatsApp Number sender that you can also get on the Meta for developers platform
- `hasVars`: Boolean to set if the file is gonna have the vars to send a dinamic message, or if they are not, and only gonna send a plain template.
- `language`: The language in which the template is formated, could be 'en' or 'es' depending on your region or how you decided to set it.


---

The file with variables should have this structure:

<div align="center">

| Name   | Phone         | Variable |
|--------|---------------|----------|
| Name1  | 12312312312   | tex1     |
| Name2  | 12312031203   | text2    |

<br />

Remember that your template gotta have 2 meta-like template variables.
The 'name' column will be assigned to the {{1}} variable and the 'variable' column will be assigned to the {{2}} variable respectively.

Remember to not skip the first row with the name, phone and variable or whichever that row would be called, because it will be deleted when parsing the data. Also do not change the order of the data, because the app is expenting the file to have a certain order to work properly.

</div>



---
<br />
The file with no variables should have this structure:

<div align="center">
<br />

| Phone         |  
|---------------|
| 12312312312   |
| 12312031203   | 

<br />

Remember to not skip the first row with the phone or whichever that row would be called, because it will be deleted when parsing the data.

</div>

---


**Example request:**

```bash
curl -X POST http://localhost:3000/api/v1/template/file \
  -F 'templateName=Welcome Template' \
  -F 'key=welcome_template' \
  -F 'file=@/path/to/contacts.xlsx' \
  -F 'wsIdentifier=1123581321' \
  -F 'hasVars=true' \
  -F 'language=en'
