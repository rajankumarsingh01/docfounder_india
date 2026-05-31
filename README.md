# 📄 DocFinder — Backend API

India's first lost document recovery platform. Finders upload found documents, owners search and claim them — safely and instantly.

---

## 🚀 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js                        |
| Database    | MongoDB + Mongoose                |
| Auth        | JWT (JSON Web Tokens)             |
| File Upload | Multer + Cloudinary               |
| Email       | Nodemailer                        |
| Security    | Helmet, CORS, Rate Limiting       |

---

## 📁 Project Structure

backend/
├── src/
│   ├── config/          # DB, Cloudinary, env config
│   ├── controllers/     # Route handlers
│   ├── dtos/            # Data Transfer Objects
│   ├── middlewares/     # Auth, error, rate limit
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── utils/           # Helpers, AppError, logger
│   ├── validators/      # Express validators
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── .env.example         # Environment variables template
└── package.json


---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/docfinder

# JWT
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password

# Client
CLIENT_URL=https://your-frontend.vercel.app

# Base URL
BASE_URL=https://your-backend.onrender.com
```

---

## 🛠️ Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/docfinder-backend.git
cd docfinder-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Fill in your values

# 4. Start development server
npm run dev
```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint                  | Access  | Description        |
|--------|---------------------------|---------|--------------------|
| POST   | `/api/v1/auth/register`   | Public  | Register new user  |
| POST   | `/api/v1/auth/login`      | Public  | Login user         |

### Documents

| Method | Endpoint                          | Access   | Description              |
|--------|-----------------------------------|----------|--------------------------|
| POST   | `/api/v1/documents`               | Private  | Upload found document    |
| GET    | `/api/v1/documents`               | Public   | Search documents         |
| GET    | `/api/v1/documents/my`            | Private  | My uploaded documents    |
| GET    | `/api/v1/documents/dashboard`     | Private  | Dashboard stats          |
| GET    | `/api/v1/documents/:id`           | Private  | Get document by ID       |
| PUT    | `/api/v1/documents/:id`           | Private  | Update document          |
| DELETE | `/api/v1/documents/:id`           | Private  | Delete document          |
| PATCH  | `/api/v1/documents/:id/claim`     | Private  | Submit claim request     |
| PATCH  | `/api/v1/documents/:id/approve-claim` | Private | Approve claim        |
| PATCH  | `/api/v1/documents/:id/reject-claim`  | Private | Reject claim         |

---

## 🔐 Document Status Flow

FOUND → PENDING_CLAIM → CLAIMED
↓
FOUND (if rejected)

---

## 📧 Email Notifications

Automatic emails are sent for:

- ✅ Claim request submitted → Finder gets notified
- ✅ Claim approved → Claimer gets notified
- ✅ Claim rejected → Claimer gets notified

---

## 🌐 Deployment

| Service  | Platform        |
|----------|-----------------|
| Backend  | Render (free)   |
| Frontend | Vercel (free)   |
| Database | MongoDB Atlas   |
| Images   | Cloudinary      |

---

## 🔒 Security Features

- JWT authentication on all private routes
- Rate limiting on upload and API routes
- Helmet security headers
- CORS restricted to allowed origins
- File type and size validation (images only, max 5MB)
- Input validation on all endpoints

---

## 👨‍💻 Author

Rajan Kumar Singh

Built with ❤️ for India's lost document problem.