# Installation and Setup

1. Clone the repository:

```bash
>>> git clone https://github.com/egesabanci/iyzads-case
```

2. Install dependencies

```bash
>>> npm i --save
```

3. Start with Docker Compose:

```
>>> docker-compose up --build
```

**IMPORTANT**

The following parameter should be `false` in production environments (`src/ormconfig.ts`):

```js
{
  ...
  synchronize: true,
}
```

When this parameter is set to false, migrations must be run to create db-schemas. Toggle comments on this line (`src/ormconfig.ts`):

```js
{
  ...
  // migrations: [__dirname + '/migrations/*{.ts,.js}'],
}
```

Then, after starting the containers, run the following:

```bash
>>> docker exec -it iyzads-app npm run migration:run
```

# Using the Postman Collection

1. Import the Postman Collection:

   - Open Postman
   - Click "Import" button
   - Select the `iyzads-casestudy.postman_collection.json` file from the `postman` directory
---
2. Environment Setup:
   - Collection contains sample requests for all endpoints
   - Login first to get JWT token
   - Token will be automatically used for authenticated requests
---
3. Available Endpoints:
   - `POST` **/login** - Public endpoint to authenticate
   - `GET` **/stores** - Get all stores
   - `GET` **/books** - Get and filter books
   - `POST` **/users** - Create new user (Admin only)
   - `POST` **/stores** - Create new store (Admin only)
   - `POST` **/stores/:id/books** - Create new book (Admin only)
   - `PATCH` **/stores/:id/books** - Update book quantity (Admin & Manager)
