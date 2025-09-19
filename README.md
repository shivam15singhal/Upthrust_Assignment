# Upthrust Assignment – Mini Workflow Automation

## Objective
This project is a **mini workflow automation app** where users can define and run a **2-step workflow** powered by:
1. An **AI agent** (mock short response, tweet-sized).
2. A **third-party API** (Weather, GitHub, or News).

## Features
- Input a text **prompt**.
- Select an **action**:
  - Weather (OpenWeatherMap API).
  - GitHub (fetch top repositories).
  - News (top headlines via GNews API).
-  Generate a **tweet-sized AI response**.
-  Combine AI response + API response into a **final result**.
-  View **last 10 workflow runs** (stored in SQLite DB).
-  Clean and minimal frontend UI.

---

## 📂 Project Structure
├── backend/ # Node.js + Express server (APIs & DB)
│ ├── server.js
│ ├── db.js
│ ├── package.json
│ └── .env.example
├── frontend/ # Simple HTML, CSS, JS frontend
│ ├── index.html
│ ├── style.css
│ └── script.js
└── README.md # Project documentation

## Setup & Installation

 1. Clone or Download the Project
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name


2. Run the Backend
bash
Copy code
cd backend
npm install
node index.js
This starts the backend server on http://localhost:5000.

3. Run the Frontend
In a new terminal:

bash
Copy code
cd frontend
http-server -p 3000 -c-1
Now open http://localhost:3000 in your browser.

