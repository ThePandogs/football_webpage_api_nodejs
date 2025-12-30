import express from 'express';
import cors from 'cors';
import teamRoute from './src/routes/team.js'; 
import playerRoute from './src/routes/player.js';
import blogEntriesRoute from './src/routes/blogEntries.js';
import authRoute from './src/routes/auth.js';
import sponsorRoute from './src/routes/sponsor.js';
import directionRoute from './src/routes/direction.js';

import path from 'path';

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error.message);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  console.error(reason?.stack || reason);
});

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [ 
  'http://localhost:3001', 
  '2.155.167.206',
  'http://localhost:3000', 
  'https://football-webpage.vercel.app',
  'https://football-webpage.vercel.app/'
];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS :)'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use('/teams', teamRoute);
app.use('/players', playerRoute);
app.use('/blog_entries', blogEntriesRoute);
app.use('/sponsors', sponsorRoute);
app.use('/direction', directionRoute);
app.use('/auth', authRoute);


app.get('/', (req, res) => {
  res.sendFile(path.resolve('./src/public/index.html')); 
});


app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
