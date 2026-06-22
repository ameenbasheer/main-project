# GrownRoot API

Backend for the GrownRoot platform — Express + MongoDB (Mongoose), JWT auth.

## Setup

```bash
npm install
cp .env.example .env   # then edit values
npm run dev            # starts on http://localhost:5000 with nodemon
```

You need MongoDB running locally (`mongodb://127.0.0.1:27017/grownroot`) or a
MongoDB Atlas connection string in `MONGO_URI`.

## Project structure

```
src/
├── config/db.js          Mongoose connection
├── models/               User, Crop, Product schemas
├── controllers/          Request handlers (business logic)
├── routes/               Express routers, one per resource
├── middleware/           protect (JWT) + authorize (roles), error handler
├── utils/                token signing, async wrapper
└── app.js                Express app (middleware + route mounting)
server.js                 Entry point (connect DB, listen)
```

## API endpoints

### Auth — `/api/auth`
| Method | Path        | Auth   | Description              |
|--------|-------------|--------|--------------------------|
| POST   | `/register` | —      | Create account, returns token |
| POST   | `/login`    | —      | Log in, returns token    |
| GET    | `/me`       | Bearer | Current user             |
| PUT    | `/profile`  | Bearer | Update name/avatar/farmerProfile |

### Crops — `/api/crops` (farmer/admin only)
| Method | Path             | Description            |
|--------|------------------|------------------------|
| GET    | `/`              | List my crops          |
| POST   | `/`              | Create crop            |
| GET    | `/:id`           | Get one crop           |
| PUT    | `/:id`           | Update crop            |
| DELETE | `/:id`           | Delete crop            |
| POST   | `/:id/expenses`  | Add an expense entry   |
| POST   | `/:id/sales`     | Add a sale entry       |
| PUT    | `/:id/note`      | Update the crop note   |

### Products — `/api/products`
| Method | Path     | Auth          | Description                       |
|--------|----------|---------------|-----------------------------------|
| GET    | `/`      | —             | Marketplace list (`?category=`, `?search=`) |
| GET    | `/:id`   | —             | Product detail                    |
| POST   | `/`      | farmer/admin  | Create a listing                  |
| DELETE | `/:id`   | farmer/admin  | Delete own listing                |

Send the token as `Authorization: Bearer <token>` on protected routes.
