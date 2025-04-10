# Use the official Alpine 3.21 image as the base image
FROM node:22.14.0-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]

