FROM node:12.16.3-alpine as build

WORKDIR /root/Capstone/Project/Web-Frontend
COPY package*.json ./

RUN npm install -g npm@7.6.3
RUN npm install
RUN npm link ../my_modules/zoomus/instantsdk

ENV NODE_ENV production

COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /root/Capstone/Project/Web-Frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
