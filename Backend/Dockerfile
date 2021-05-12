FROM node:12.16.3-alpine

WORKDIR /root/Capstone/Project/Backend
COPY package*.json ./

RUN npm install -g npm@7.6.3
RUN npm install
RUN npm install -g pm2
ENV NODE_ENV production

COPY . .

CMD ["pm2-runtime", "start", "./bin/www"]
