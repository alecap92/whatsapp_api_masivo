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

```