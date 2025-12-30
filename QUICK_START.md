# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/knowledge_base
OPENAI_API_KEY=AkLmkQY5vIuuUquJtieT1phWGaI3In6n5iVRaQ8pk8lMrXP79TrXlEHqER4kKn6UCfeOKr7pMdT3BlbkFJ0EXytj-yHoEgyl7K6aT1KFIbJd8RFe-4Q5PzNB5Uf9aWPaLmvP7Hmg4BOdowyN9g24zi6MDvAA
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Seed the Database
```bash
node seed.js
```

### 5. Start the Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 6. Install Frontend Dependencies (New Terminal)
```bash
cd client
npm install
```

### 7. Start the Frontend
```bash
npm start
```

The app will open automatically at `http://localhost:3000`

## ✅ Test It Out!

Try asking questions like:
- "How do I reset my password?"
- "What are the subscription plans?"
- "Tell me about API documentation"

## 📊 Check Analytics

Visit: `http://localhost:5000/api/analytics/top-queries`

## 🆘 Need Help?

See the full [README.md](README.md) for detailed documentation.



