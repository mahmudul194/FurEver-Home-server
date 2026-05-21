# 🐾 FurEver Home — Server

The Express.js + MongoDB backend for the FurEver Home pet adoption platform. Handles authentication, pet listings, and adoption request management via a RESTful API.

## 🌐 Live URL

> https://assignment-9-server-5fxe.onrender.com

## ✨ Features

- 🔐 **JWT Authentication** — Token stored in a secure HttpOnly cookie; protected routes via `protect` middleware.
- 🔑 **Google OAuth** — Verifies Google ID tokens server-side using `google-auth-library`.
- 🐕 **Pet CRUD** — Create, read, update, and delete pet listings with full ownership checks.
- 🔍 **Search, Filter & Sort** — Search by name (`$regex`), filter by species (`$in`), sort by fee or date.
- 📋 **Adoption Request Workflow** — Submit, approve, and reject requests. Approving auto-marks the pet as adopted and rejects all other pending requests atomically.
- 🔒 **CORS** — Configured to only allow requests from the deployed client origin in production.

## 🛠️ NPM Packages Used

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT generation & verification |
| `bcryptjs` | Password hashing |
| `cookie-parser` | Read HttpOnly JWT cookies |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable loading |
| `google-auth-library` | Google OAuth token verification |
| `nodemon` | Dev auto-reload |

## 🚀 Getting Started Locally

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas account and cluster

### 1. Clone the repository
```bash
git clone https://github.com/mahmudul194/Assignment-9-server.git
cd Assignment-9-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```env
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-strong-secret-key>
CLIENT_URL=http://localhost:3000
NODE_ENV=development
GOOGLE_CLIENT_ID=<your-google-client-id>
```

### 4. (Optional) Seed the database with sample pets
```bash
node seed.js
```

### 5. Run the development server
```bash
npm run dev
```

Server will start on **http://localhost:5000**

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB Atlas connection
├── middleware/
│   └── auth.js            # JWT protect middleware
├── models/
│   ├── User.js            # User schema with bcrypt hashing
│   └── Pet.js             # Pet schema with species & health fields
├── routes/
│   ├── auth.js            # POST /register, /login, /logout, /google
│   ├── pets.js            # GET/POST/PUT/DELETE /api/pets
│   └── requests.js        # GET/POST/PUT /api/requests
├── seed.js                # Sample pet data seeder
└── server.js              # App entry point with CORS & middleware setup
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register with email & password |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/logout` | Clear auth cookie |
| `POST` | `/api/auth/google` | Login / register with Google ID token |
| `GET` | `/api/auth/me` | Get the currently logged-in user |

### Pets
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | Get all pets (supports `?search`, `?species`, `?sort`) |
| `GET` | `/api/pets/:id` | Get a single pet |
| `POST` | `/api/pets` | Create a new pet listing (protected) |
| `PUT` | `/api/pets/:id` | Update a pet listing (owner only) |
| `DELETE` | `/api/pets/:id` | Delete a pet listing (owner only) |

### Adoption Requests
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/requests` | Get requests (for owner's pets or by requester) |
| `POST` | `/api/requests` | Submit an adoption request (protected) |
| `PUT` | `/api/requests/:id` | Approve or reject a request (owner only) |

## 🔒 Security Notes
- Passwords are hashed with `bcryptjs` (salt rounds: 12) before storage.
- JWTs are stored in HttpOnly, `sameSite: none`, secure cookies — inaccessible to browser JS.
- All mutation routes are protected by the `protect` middleware.
- MongoDB credentials are stored in `.env` and are never committed to version control.
