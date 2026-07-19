# AI Study Buddy

An intelligent study assistant designed to help students master new topics through AI-generated quizzes and competitive leaderboards.

## 🚀 Features
*   **AI Quiz Generator:** Automatically generate 5-question multiple-choice quizzes on any topic with adjustable difficulty (Beginner, Intermediate, Advanced).
*   **Tiered Leaderboard:** Compete with peers! Scores are categorized by difficulty levels (Green/Yellow/Red tiers) to ensure fair comparisons.
*   **Dynamic Scoreboard:** Receive instant feedback upon quiz submission with progress tracking.

## 🛠 Tech Stack
*   **Frontend:** React, Tailwind CSS (Designed with **Stitch**)
*   **Backend:** Node.js, Express
*   **AI Integration:** OpenRouter (using Gemini models)
*   **Development Environment:** **Antigravity** IDE

## 📖 Workflow
1.  **Generate:** Enter a topic and select difficulty in the Quiz Generator.
2.  **Challenge:** Answer the 5 generated MCQs.
3.  **Analyze:** View your results on the Scoreboard.
4.  **Compete:** Save your score to the global Leaderboard to climb the ranks in your specific tier.




## ⚙️ Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install

## 🔌 API Endpoints

The backend provides the following endpoints to power the quiz and leaderboard features:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/generate-quiz` | Accepts `topic` and `difficulty`. Returns 5 MCQ objects. |
| `GET` | `/api/leaderboard` | Fetches all scores. Use `?level=Advanced` to filter by tier. |
| `POST` | `/api/submit-score` | Saves `username`, `score`, `topic`, and `difficulty` to the database. |
