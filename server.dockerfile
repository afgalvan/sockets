FROM node:14-alpine

WORKDIR /server

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8000

CMD [ "yarn", "start", "8000" ]
