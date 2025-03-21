import express from 'express'

const app = express()

app.get("/", (req, res) =>{
    res.send("Serviço iniciado com sucesso")
})

const port = 4000

app.listen(port, (error)=>{
    if(error){
        console.log(error)
    }else{
        console.log(`Serviço iniciado em http://localhost:${port}`)
    }
})