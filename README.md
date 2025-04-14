# 🏟️ Football Webpage API - Node.js

**A RESTful API built with Node.js for managing teams and players of a Galician football club based in Vigo.**

This project is part of the [Football Webpage](https://football-webpage.vercel.app/) ecosystem — a web frontend built with React to visualize and manage football-related data.

You can access the live API here:  
🔗 [https://football-webpage-api.vercel.app/](https://football-webpage-api.vercel.app/)

---

## 🚀 What's this project about?

This project was born as an experiment to learn and play around with **Node.js** and **React**, by building both a **backend API** and a **frontend web app** for basic football management:

- Manage **players**
- Manage **teams**
- Admin dashboard and controls
- Public data access

All themed around a fictional football club from **Galicia**, based in the city of **Vigo**, Spain 🇪🇸⚽

---

## 📡 What does this API provide?

This API allows you to:

- Retrieve information about teams and players
- Create, edit, and delete players or teams (via admin/backend routes)
- Serve real-time football data to the frontend

All data is served in clean JSON format and is easily consumable by frontend applications like React, Vue, etc.

---

## 🌐 Main Endpoints

> You can query the API directly using a browser, Postman, Insomnia, or any HTTP client.

- `GET /api/teams` – List all teams
- `GET /api/players` – List all players
- `GET /api/players/:id` – Get a single player
- `POST /api/players` – Add a new player (admin only)
- `DELETE /api/players/:id` – Delete a player (admin only)

More routes and docs to come — or feel free to dive into the source code!

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Vercel** (for serverless deployment)
- **MySQL** 
- **React** frontend ([see project](https://football-webpage.vercel.app/))

## 📬 Want to contribute?

All feedback and contributions are welcome! Feel free to open an issue, fork the repo, or just share your thoughts.

---

Thanks for visiting! 💙⚽
