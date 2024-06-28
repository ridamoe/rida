FROM node:20.15 AS base

RUN mkdir /home/node/src
WORKDIR /home/node/src

COPY package*.json .
RUN npm install

COPY . .

FROM base AS dev

CMD ["npm", "run", "dev"]

FROM base AS build

RUN npm run build

FROM node:20.15 AS prod

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --from=build /home/node/src/.output/ .

CMD ["node", "server/index.mjs"]