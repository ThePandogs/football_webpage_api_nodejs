# 🏟️ Football Webpage API - Node.js

**API RESTful desarrollada en Node.js para la gestión de equipos y jugadores de un club de fútbol gallego, con base en Vigo.**

Este proyecto forma parte del ecosistema de [Football Webpage](https://football-webpage.vercel.app/), una página web construida con React que permite visualizar y administrar datos de un equipo  de fútbol.

La API puede consultarse en producción aquí:  
🔗 [https://football-webpage-api.vercel.app/](https://football-webpage-api.vercel.app/)

---

## 🚀 ¿De qué va este proyecto?

Este proyecto nació como una forma de experimentar con tecnologías modernas como **Node.js** y **React**, desarrollando tanto una **API** como un **frontend web** para simular una gestión básica de contenido relacionada con el fútbol:

- Gestión de **jugadores**
- Gestión de **equipos**
- Paneles de administración
- Consultas públicas de datos

Todo enfocado en un equipo gallego con raíces en la ciudad de **Vigo** 🇪🇸⚽

---

## 📡 ¿Qué ofrece esta API?

Esta API permite:

- Obtener información de equipos y jugadores
- Crear, editar y eliminar jugadores o equipos (vía endpoints protegidos o backend privado)
- Servir datos para el frontend en tiempo real

Los datos están estructurados en JSON y accesibles desde el dominio público. Ideal para ser consumidos desde aplicaciones frontend como React, Vue, etc.

---

## 🌐 Endpoints destacados

> Puedes consultar la API directamente desde el navegador o cualquier cliente REST como Postman o Insomnia.

- `GET /api/teams` – Lista de equipos
- `GET /api/players` – Lista de jugadores
- `GET /api/players/:id` – Detalles de un jugador
- `POST /api/players` – Añadir jugador (requiere backend)
- `DELETE /api/players/:id` – Eliminar jugador (requiere backend)

Más información disponible en la documentación futura o directamente en el código fuente.

---

## 🛠️ Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **Vercel** para despliegue serverless
- **MySQL** 
- **React** para el frontend ([ver proyecto](https://football-webpage.vercel.app/))

