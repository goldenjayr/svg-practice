FROM node:13.14.0-alpine3.10

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "start"]
