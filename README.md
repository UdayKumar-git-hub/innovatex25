# InnovateX25 - Event Registration Platform

A modern, full-stack web application for managing event registrations with integrated payment processing.

## 🏗️ Project Structure

```
├── src/                    # Frontend React application
├── backend/               # Node.js Express API server
├── public/               # Static assets
└── dist/                # Built frontend files
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Cashfree credentials (get from Cashfree dashboard)
   - Port and other settings

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the root directory and install dependencies:
```bash
npm install
```

2. Create frontend environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=3001
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_API_ENV=sandbox
FRONTEND_URL=http://localhost:5173
RETURN_URL=http://localhost:5173/success
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_CASHFREE_ENV=sandbox
```

## 💳 Payment Integration

This application uses Cashfree for payment processing:

1. Sign up at [Cashfree](https://www.cashfree.com/)
2. Get your App ID and Secret Key from the dashboard
3. Configure the environment variables
4. Test with sandbox mode first

## 🛠️ Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server

### API Endpoints

- `GET /health` - Health check
- `POST /api/create-cashfree-order` - Create payment order

## 🚀 Deployment

### Backend Deployment
1. Deploy to your preferred platform (Heroku, Railway, etc.)
2. Set environment variables in your deployment platform
3. Update FRONTEND_URL to your deployed frontend URL

### Frontend Deployment
1. Update VITE_API_URL to your deployed backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting platform

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, unique credentials for production
- Enable HTTPS in production
- Validate all inputs on both frontend and backend

## 📞 Support

For technical support or questions:
- Email: reelhaus.hyd@gmail.com
- Phone: +91 9392449721 / +91 9110387918

## 📄 License

This project is proprietary software for InnovateX25 event management.