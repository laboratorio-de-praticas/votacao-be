import express from 'express'
import mongoose from 'mongoose'
import Voto from './models/VotoPublicoAvaliador.js'

const app = express()
 
 // Configuração do Express
 app.use(express.urlencoded({extended: false}))
 app.use(express.json())
 app.use("/", votoRoutes)
 
 // Importando as rotas (endpoints) de Votos
import votoRoutes from './routes/votoRoutes.js'
 
 // Iniciando a conexão com o banco de dados do MongoDB
 mongoose.connect("mongodb://127.0.0.1:27017/registraVotos")
 
 // Iniciando o servidor
 const port = 4000
 app.listen(port, (error)=> {
     if(error) {
         console.log(error)
     } else {
         console.log(`API iniciando em http://localhost:${port}`)
     }
 })