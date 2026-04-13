# Maple Real Estate

Full-stack MERN real estate platform with property listings, agent management, admin dashboard, and user accounts.

## Tech Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Frontend  | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui |
| Backend   | Node.js, Express 4, Mongoose 8                 |
| Database  | MongoDB                                        |
| Auth      | JWT (Bearer tokens)                            |
| Uploads   | Multer (local disk)                            |
| Security  | Helmet, CORS whitelist, rate limiting, mongo-sanitize, HPP |

---

## Project Structure

```
Mapel RealEstate/
├── backend/                # Express API server
│   ├── config/             # DB connection, multer config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, error handler, async wrapper
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── utils/              # ApiError helper
│   ├── uploads/            # Uploaded images (gitignored)
│   ├── server.js           # App entry point
│   └── .env.example        # Environment template
│
└── maple-estates-hub/      # React frontend (Vite)
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # AuthContext, FavoritesContext
    │   ├── lib/            # Axios API service layer
    │   ├── pages/          # All page components
    │   │   ├── admin/      # Admin dashboard pages
    │   │   └── agent/      # Agent dashboard pages
    │   ├── types/          # TypeScript interfaces
    │   └── data/           # Static constants (cities, types)
    └── package.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a MongoDB Atlas URI
- **npm** or **yarn**

---

## Run Instructions (Development)

### 1. Backend

```bash
cd backend

# Copy env template and fill in values
cp .env.example .env

# Install dependencies
npm install

# Start dev server (with nodemon)
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd maple-estates-hub

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 3. Create Admin User

Use MongoDB shell or Compass to set a user's role to `"admin"`:

```js
db.users.updateOne(
  { email: "admin@maple.pk" },
  { $set: { role: "admin" } }
)
```

---

## Environment Variables

| Variable       | Description                          | Default                                     |
| -------------- | ------------------------------------ | ------------------------------------------- |
| `NODE_ENV`     | `development` or `production`        | `development`                               |
| `PORT`         | Server port                          | `5000`                                      |
| `MONGO_URI`    | MongoDB connection string            | `mongodb://localhost:27017/maple-realestate` |
| `JWT_SECRET`   | Secret key for signing JWTs          | *(required)*                                |
| `JWT_EXPIRE`   | Token expiry duration                | `30d`                                       |
| `CORS_ORIGIN`  | Comma-separated allowed origins      | `http://localhost:5173,http://localhost:3000`|

---

## API Endpoints

### Auth
| Method | Route                | Access  |
| ------ | -------------------- | ------- |
| POST   | `/api/auth/register` | Public  |
| POST   | `/api/auth/login`    | Public  |
| GET    | `/api/auth/me`       | Private |

### Properties
| Method | Route                     | Access        |
| ------ | ------------------------- | ------------- |
| GET    | `/api/properties`         | Public        |
| GET    | `/api/properties/:id`     | Public        |
| POST   | `/api/properties`         | Agent         |
| PUT    | `/api/properties/:id`     | Owner Agent   |
| DELETE | `/api/properties/:id`     | Owner Agent   |

### Agents
| Method | Route                  | Access  |
| ------ | ---------------------- | ------- |
| GET    | `/api/agents`          | Public  |
| GET    | `/api/agents/:id`      | Public  |
| POST   | `/api/agents/apply`    | Private |

### User Dashboard
| Method | Route                  | Access  |
| ------ | ---------------------- | ------- |
| GET    | `/api/user/profile`    | Private |
| PUT    | `/api/user/profile`    | Private |
| GET    | `/api/user/favorites`  | Private |
| GET    | `/api/user/inquiries`  | Private |
| GET    | `/api/user/properties` | Private |

### Admin
| Method | Route                              | Access |
| ------ | ---------------------------------- | ------ |
| GET    | `/api/admin/dashboard`             | Admin  |
| GET    | `/api/admin/users`                 | Admin  |
| DELETE | `/api/admin/users/:id`             | Admin  |
| GET    | `/api/admin/properties`            | Admin  |
| GET    | `/api/admin/properties/pending`    | Admin  |
| PUT    | `/api/admin/properties/:id/approve`| Admin  |
| PUT    | `/api/admin/properties/:id/reject` | Admin  |
| DELETE | `/api/admin/properties/:id`        | Admin  |
| GET    | `/api/admin/agents`                | Admin  |
| GET    | `/api/admin/agents/pending`        | Admin  |
| PUT    | `/api/admin/agents/:id/approve`    | Admin  |
| PUT    | `/api/admin/agents/:id/reject`     | Admin  |
| GET    | `/api/admin/inquiries`             | Admin  |

### Other
| Method | Route                       | Access        |
| ------ | --------------------------- | ------------- |
| POST   | `/api/inquiries`            | Private       |
| PUT    | `/api/inquiries/:id/respond`| Private       |
| POST   | `/api/wishlist/toggle`      | Private       |
| GET    | `/api/wishlist`             | Private       |
| POST   | `/api/upload/multiple`      | Approved Agent|
| POST   | `/api/contact`              | Public        |

---

## Security Features

- **Helmet** — secure HTTP headers
- **CORS whitelist** — only allowed origins
- **Rate limiting** — 200 req/15min (general), 20 req/15min (auth)
- **express-mongo-sanitize** — prevents NoSQL injection
- **HPP** — prevents HTTP parameter pollution
- **Body size limit** — 10MB max
- **Gzip compression** — response compression
- **JWT auth** — token-based authentication
- **Password hashing** — bcrypt with 10 salt rounds

---

## Deployment Guide

### Option A: VPS / Droplet (DigitalOcean, Linode, etc.)

**Backend:**
```bash
# On server
git clone <repo-url>
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI (Atlas), JWT_SECRET (strong random), NODE_ENV=production, CORS_ORIGIN=https://yourdomain.com

npm install --production
npm start
# Use PM2 for process management:
npm install -g pm2
pm2 start server.js --name maple-api
pm2 save
pm2 startup
```

**Frontend:**
```bash
cd maple-estates-hub

# Update API base URL in src/lib/api.ts:
# const API_BASE_URL = "https://api.yourdomain.com/api";

npm install
npm run build
# Serve dist/ with nginx
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/maple-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded files
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

### Option B: Render / Railway

1. Push backend to a Git repo
2. Create a **Web Service** on Render/Railway pointing to `backend/`
3. Set environment variables in the dashboard
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy frontend to **Netlify/Vercel**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Update `API_BASE_URL` to your backend URL

### Option C: MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Set `MONGO_URI` in your `.env`

---

## Common Commands

```bash
# Backend
npm run dev          # Development with nodemon
npm start            # Production start

# Frontend
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## License

ISC

----

user details:
   adeelvirtuenetz@gmail.com
   AV@1111

Agent details:
   firstagent@gmail.com
   FA@1111

   secondagent@gmail.com
   SA@1111

   thirdagent@gmail.com
   TA@1111

Admin Details:
    admin@maple.pk
    admin123
