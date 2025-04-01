import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buscarVotos() {
  const votos = await prisma.votacao.findMany(); 
  console.log("Voto:", votos);
}

export default buscarVotos();