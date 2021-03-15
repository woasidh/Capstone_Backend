FROM node:12

WORKDIR /root/Capstone/Project/Backend
COPY package*.json ./

RUN npm install

RUN npm install -g pm2
RUN npm run swagger-autogen

RUN export NODE_ENV = production

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "start", "./bin/www"]
