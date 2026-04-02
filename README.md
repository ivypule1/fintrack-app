# FinTrack 💰 — Personal Finance Dashboard

A full stack personal finance tracker built with **Django REST Framework** + **React**. Track income and expenses, visualise spending by category, and get a clear picture of your money.

> Built by **Mpho Pule** — Full Stack Developer

---

## 🖥️ Live Demo
[Coming soon — deploy link here]

## 📸 Screenshots
[Add screenshot here after running the app]

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Chart.js, Axios |
| Backend | Django 4, Django REST Framework |
| Database | PostgreSQL |
| Auth | JWT (djangorestframework-simplejwt) |
| Hosting | Railway (backend) + Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API will be live at `http://localhost:8000`

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 📁 Project Structure

```
fintrack/
├── backend/
│   ├── fintrack/          # Django project settings
│   ├── transactions/      # Transactions app (models, views, serializers)
│   ├── users/             # Auth app
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Login, Dashboard, Transactions
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # API calls (axios)
│   └── package.json
└── README.md
```

---

## ✨ Features

- 🔐 User registration & login (JWT auth)
- ➕ Add income and expense transactions
- 🏷️ Categorise spending (Food, Transport, Bills, Entertainment, etc.)
- 📊 Visual charts — spending by category (doughnut) + monthly trend (bar)
- 💹 Dashboard summary — total income, expenses, and balance
- 📱 Responsive design

---

## 🌍 Deploying

**Backend → Railway**
1. Push to GitHub
2. Connect repo to [railway.app](https://railway.app)
3. Add PostgreSQL plugin
4. Set environment variables

**Frontend → Vercel**
1. Connect repo to [vercel.com](https://vercel.com)
2. Set `REACT_APP_API_URL` to your Railway backend URL

---

## 👩🏾‍💻 Author

**Mpho Maria Ntsoaki Pule**  
Full Stack Developer | Johannesburg, SA  
[LinkedIn](https://linkedin.com/in/mpho-pule) · [GitHub](https://github.com/mphopule)

---

## 📄 Licence
MIT
