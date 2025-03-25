import express from 'express';
import votacaoInternaRoutes from './routes/votacaoInternaRoute.js'; 

const app = express();
const port = 3000;

app.use(express.json()); 

app.use(votacaoInternaRoutes); 

app.get("/", (req, res) => {
  res.send("Serviço iniciado com sucesso");
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Serviço iniciado em http://localhost:${port}`);
  }
});