# Campus Vault

## Accounts

### Student

email: `example@student.com`
<br>
password: `newpassword`

### Lecturer

email: `example@lecturer.com`
<br>
password: `newpassword`

### Secretary

email: `example@secretary.com`
<br>
password: `newpassword`

_SEE ALL THE SEEDED ACCOUNTS IN THE DATABASE, PASSWORD IS THE SAME_

### Before starting setting up the project, remove `.example` from name in `env.example` files in respective directories and enter the keys

## Setup `api`

Go to api directory

```
cd api
```

Install dependencies

```
npm i
```

Create SQL tables (INITIAL SETUP)

```
npx prisma migrate dev --name init
```

Seed the database

```
npm run seed
```

Start `api`

```
npm start
```

## Setup `app`

Go to app directory

```
cd app
```

Install dependencies

```
npm i
```

Start `app`

```
npm run dev
```
