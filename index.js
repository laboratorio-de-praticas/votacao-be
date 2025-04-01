import express from 'express';
import votacaoInternaRoutes from './routes/votacaoInternaRoute.js'; 
import cors from "cors"
import votacaoPublica from './models/votacaoPublica.js';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json()); 

app.use(votacaoInternaRoutes); 

app.use(votacaoPublica)

app.get("/", (req, res) => {
  res.send("Serviço iniciado com sucesso");
});