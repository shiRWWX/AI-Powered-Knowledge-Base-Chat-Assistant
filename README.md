# AI-Powered Knowledge Base Chat Assistant

A complete, production-ready AI chat assistant built with the MERN stack that allows users to query a knowledge base using natural language. The system uses OpenAI's GPT model to generate intelligent responses based on content stored in MongoDB.

## 🚀 Features

- **Intelligent Chat Interface**: Modern, ChatGPT-like UI with smooth animations
- **Knowledge Base Search**: MongoDB text indexing for fast and accurate article retrieval
- **AI-Powered Responses**: OpenAI GPT-3.5-turbo integration for contextual answers
- **Session Management**: Conversation history maintained per session
- **Query Analytics**: Track most asked questions and query frequency
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **OpenAI API** - AI response generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling with modern animations

## 📁 Project Structure

```
MERN Project/
├── server/
│   ├── models/
│   │   ├── Article.js          # Knowledge base article schema
│   │   └── QueryLog.js         # Query analytics schema
│   ├── routes/
│   │   ├── chat.js             # Chat API endpoints
│   │   └── analytics.js        # Analytics API endpoints
│   ├── server.js               # Express server setup
│   ├── seed.js                 # Database seeding script
│   ├── package.json
│   └── env.example             # Environment variables template
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWidget.jsx  # Main chat component
    │   │   └── ChatWidget.css  # Chat widget styles
    │   ├── api.js              # API client functions
    │   ├── App.jsx             # Main app component
    │   ├── App.css             # Global styles
    │   └── index.js            # React entry point
    ├── public/
    │   └── index.html
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher) - Install locally or use MongoDB Atlas
- **npm** or **yarn**
- **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/)

### Step 1: Clone or Navigate to Project

```bash
cd "C:\Users\shiva\OneDrive\Desktop\MERN Project"
```

### Step 2: Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `env.example`):
```bash
# Windows PowerShell
Copy-Item env.example .env

# Or create manually
```

4. Edit `.env` file and add your MongoDB URI and OpenAI API key:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/knowledge_base
OPENAI_API_KEY=your_openai_api_key_here
```

5. Make sure MongoDB is running:
   - **Local MongoDB**: Start MongoDB service
   - **MongoDB Atlas**: Use your Atlas connection string in `MONGODB_URI`

6. Seed the database with sample articles:
```bash
node seed.js
```

7. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, for custom API URL):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React app:
```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 📝 API Endpoints

### Chat Endpoints

- **POST `/api/chat`**
  - Send a chat message
  - Body: `{ "message": "your question", "sessionId": "session-id" }`
  - Returns: AI response and relevant articles

- **GET `/api/chat/history/:sessionId`**
  - Get conversation history for a session
  - Returns: Array of messages

- **DELETE `/api/chat/history/:sessionId`**
  - Clear conversation history for a session

### Analytics Endpoints

- **GET `/api/analytics/top-queries?limit=10`**
  - Get top queries by frequency
  - Query params: `limit` (default: 10)

- **GET `/api/analytics/stats`**
  - Get overall statistics
  - Returns: Total queries, unique queries, total frequency

### Health Check

- **GET `/health`**
  - Check if server is running

## 🗄️ Database Schema

### Article Model
```javascript
{
  title: String,
  content: String,
  tags: [String],
  createdAt: Date
}
```

### QueryLog Model
```javascript
{
  query: String,
  frequency: Number,
  lastAsked: Date,
  createdAt: Date
}
```

## 💡 Usage Examples

### Adding New Articles

You can add articles to the knowledge base using MongoDB directly or create a script:

```javascript
const Article = require('./models/Article');

const newArticle = new Article({
  title: 'Your Article Title',
  content: 'Your article content here...',
  tags: ['tag1', 'tag2']
});

await newArticle.save();
```

### Query Examples

Try asking questions like:
- "How do I reset my password?"
- "What are the subscription plans?"
- "Tell me about API documentation"
- "How do I integrate with third-party tools?"

## 🔧 Configuration

### Environment Variables

**Server (.env)**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - Your OpenAI API key

**Client (.env)**
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure API key has proper permissions

### CORS Issues
- Backend already includes CORS middleware
- Ensure frontend is using the correct API URL

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using the port

## 📊 Text Indexing

The Article model includes a text index on `title` and `content` fields for fast full-text search. The index is automatically created when you run the seed script.

To manually create the index:
```javascript
await Article.collection.createIndex({ title: 'text', content: 'text' });
```

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- In production, use proper authentication
- Consider rate limiting for API endpoints
- Validate and sanitize user inputs

## 🎨 Customization

### Styling
- Edit `client/src/components/ChatWidget.css` to customize the chat UI
- Colors, fonts, and layouts can be easily modified

### OpenAI Model
- Change the model in `server/routes/chat.js`:
  ```javascript
  model: 'gpt-3.5-turbo' // or 'gpt-4', 'gpt-4-turbo', etc.
  ```

### Conversation History
- Currently stored in memory (resets on server restart)
- For production, use Redis or MongoDB to persist history

## 📈 Future Enhancements

- User authentication and authorization
- Persistent conversation history in database
- File upload for knowledge base articles
- Admin dashboard for managing articles
- Multi-language support
- Real-time chat with WebSockets
- Export chat conversations

## 📄 License

ISC

## 👤 Author

Built as a MERN stack project

## 🙏 Acknowledgments

- OpenAI for the GPT API
- MongoDB for the database
- React team for the amazing framework

---

**Happy Chatting! 🤖💬**



