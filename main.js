import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import votacaoInternaRoutes from './routes/votacaoInternaRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev')); // Logs incoming requests
app.use(cors()); // Enables CORS
app.use(express.json()); // Parses JSON bodies

// Routes
app.use(votacaoInternaRoutes);

app.get('/', (req, res) => {
  res.send('Serviço iniciado com sucesso');
});

// Start server
app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(`Serviço iniciado em http://localhost:${port}`);
  }
});
