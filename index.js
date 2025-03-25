import express from 'express'
import router from './routes/votacaoPublicaController.js';

const app = express()

app.use('/', router);

const port = 3000

app.listen(port, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Serviço iniciado em http://localhost:${port}`)
    }
})