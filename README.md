# Smart Campus Event Notifier

A complete full-stack campus event management and notification platform designed for students and administrators. It helps students discover events, register for them, receive reminders, and view announcements, while admins can manage events, announcements, students, and registrations.

## Features

- Student registration and login with JWT authentication
- Admin login and dashboard
- Event listing, filtering, search, and details
- Event registration and cancellation
- Notification center with unread/read states
- Announcement management with priority levels
- Student profile management
- Admin analytics dashboard
- MongoDB-based data storage with Mongoose
- Responsive UI built with React + Tailwind CSS

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
Smart-Campus-Event-Notifier/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── .gitignore
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── .gitignore
├── README.md
└── .gitignore
```

## Required Software

- Node.js v18 or newer
- MongoDB Community Server or MongoDB Atlas
- VS Code
- Git

## Installation

1. Open VS Code terminal.
2. Create a folder for the project and navigate into it:

```bash
mkdir Smart-Campus-Event-Notifier
cd Smart-Campus-Event-Notifier
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally and start the service.
2. Default local URI:

```bash
mongodb://127.0.0.1:27017/smart-campus-event-notifier
```

### Option 2: MongoDB Atlas
1. Create a MongoDB Atlas cluster.
2. Copy the connection string.
3. Replace the MONGO_URI value in the backend `.env` file.

## Environment Variable Setup

Create a `.env` file inside `backend` by copying `.env.example`:

```bash
cd backend
copy .env.example .env
```

Then update values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-campus-event-notifier
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+15017122661
SMS_DEFAULT_COUNTRY_CODE=91
```

Password reset and registration OTPs are sent by SMS through Twilio. Set the Twilio Account SID, Auth Token, and SMS-enabled sender number in `backend/.env`; `SMS_DEFAULT_COUNTRY_CODE` is used for local numbers without an international prefix. Keep the Auth Token private and restart the backend after updating `.env`. Trial accounts may only message verified recipient numbers.

The frontend also has `.env.example`:

```bash
cd frontend
copy .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

## Backend Setup

Run the backend server:

```bash
cd backend
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

## Frontend Setup

Run the frontend app:

```bash
cd frontend
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## Run Both Together

Open two terminals in VS Code:

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Seed Data

A sample admin user and student user are available through the seed script.

Run:

```bash
cd backend
npm run seed
```

### Test Login Credentials

Admin:

- Email: admin@college.edu
- Password: Admin@123

Student:

- Email: student@college.edu
- Password: Student@123

## API Information

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/send-otp
- POST /api/auth/verify-otp
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/auth/profile
- GET /api/health (includes the non-sensitive `smsConfigured` status)

### Events
- GET /api/events
- GET /api/events/:id
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id
- GET /api/events/:id/registrations

### Registrations
- POST /api/registrations
- GET /api/registrations/my-events
- DELETE /api/registrations/:id

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- PUT /api/notifications/read-all

### Announcements
- GET /api/announcements
- POST /api/announcements
- PUT /api/announcements/:id
- DELETE /api/announcements/:id

### Students
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

## Troubleshooting

### MongoDB not connecting
- Check if MongoDB is running.
- Verify the MONGO_URI in the backend `.env` file.
- Ensure the database name is valid.

### Frontend not connecting to backend
- Confirm the backend is running on port 5000.
- Verify `VITE_API_URL` in the frontend `.env` file.

### JWT errors
- Check if `JWT_SECRET` is set in the backend `.env` file.
- Ensure the token is sent in the Authorization header as `Bearer <token>`.

### App not loading
- Delete `node_modules` and reinstall packages.
- Run:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Notes

This project is designed to be beginner-friendly and easy to extend with Cloudinary, email notifications, or push notifications in the future.
"# Smart-Campus-Event-Notifier" 
