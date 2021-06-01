FROM node:14-alpine
WORKDIR /server
COPY . .
RUN yarn
CMD [ "yarn", "start", "8000" ]
