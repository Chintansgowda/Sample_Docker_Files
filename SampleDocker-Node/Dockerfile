FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

ENV APP_ENV=dev 

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
