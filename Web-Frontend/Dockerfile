FROM node:12

WORKDIR /root/Capstone/Project/Web-Frontend
COPY package*.json ./

RUN npm install
RUN npm i -g serve

ENV NODE_ENV production

COPY . .

RUN npm run build

EXPOSE 80

CMD ["serve", "-l", "80", "-s", "build"]
