FROM node:20 AS build

# RUN npm install -g yarn

# RUN exec bash

WORKDIR /frontend

COPY package.json .

RUN yarn

COPY . .

RUN yarn build

FROM nginx:alpine
COPY --from=build /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
