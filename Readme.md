# 🎓 Academigo

> An AI-powered learning assistant with chat, quizzes, and Telegram integration.

<div align="center">

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)

</div>

## 📋 Table of Contents
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Development](#-development)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

## 🚀 Quick Start

### Prerequisites
```bash
# Verify your environment
python --version    # Python 3.10+
node -v            # Node.js 18+ or 20 LTS
npm -v             # npm 8+
```

### Backend Setup (Django)
```powershell
# 1️⃣ Create and activate virtual environment
cd .\
python -m venv .venv
.\.venv\Scripts\Activate

# 2️⃣ Install dependencies
pip install -r .\requirements.txt

# 3️⃣ Run migrations and server
cd .\backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup (React/Vite)
```powershell
# 1️⃣ Install packages
cd .\academigo
npm install

# 2️⃣ Start development server
npm run dev
```

## ✨ Features

### Implemented 🎯
1. **AI Conversations**
   - Direct chat with AI assistant
   - Context-aware responses
   - Persistent conversation history

2. **Smart Chat System**
   - Saved interaction history
   - Continuous context maintenance
   - Seamless conversation flow

3. **Telegram Integration**
   - 🤖 Feature-rich bot
   - Schedule management
   - Remote AI assistance

4. **Quiz System**
   - 📝 Dynamic pop quizzes
   - Real-time knowledge testing
   - Progress tracking

### Under Development 🔧
1. **Data Filtering**
   - Smart content relevance
   - Storage optimization
   - Automated cleanup

2. **AI Enhancement**
   - 🧠 Transformer models
   - Content relevance API
   - Smart data processing

3. **Document Processing**
   - 📚 Multi-PDF support
   - AI training on uploads
   - Knowledge extraction

## 🛠 Development

### Building for Production
```powershell
cd .\academigo
npm run build
npm run preview
```

### Troubleshooting

#### Port Conflicts
```powershell
# Frontend alternative port
npm run dev -- --port 5174

# Backend alternative port
python manage.py runserver 0.0.0.0:8001
```

#### Common Issues
- **CORS**: Add django-cors-headers, allow http://localhost:5173
- **PowerShell**: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
- **Clean Install**: 
  ```powershell
  rimraf node_modules
  del package-lock.json
  npm install
  ```

## 🗺 Roadmap

### Coming Soon 📅
- [ ] Google Calendar/Notion integration
- [ ] Advanced scheduling system
- [ ] Enhanced quiz features
  - Multiple choice
  - Topic-based tests
  - AI explanations
- [ ] Improved data privacy

## 🤝 Contributing
We welcome contributions! 

1. Fork the repo
2. Create your feature branch
3. Commit changes
4. Push to your branch
5. Open a Pull Request

---

<div align="center">
Made with ❤️ by the Academigo team
</div>