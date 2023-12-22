FROM node:21.5-alpine3.18
WORKDIR app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build
COPY . .
CMD ["node", "./dist/index.js"]