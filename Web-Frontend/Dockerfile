FROM node:12-alpine as build

WORKDIR /root/Capstone/Project/Web-Frontend
COPY package*.json ./

RUN npm install

ENV NODE_ENV production

COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /root/Capstone/Project/Web-Frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
