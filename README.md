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
