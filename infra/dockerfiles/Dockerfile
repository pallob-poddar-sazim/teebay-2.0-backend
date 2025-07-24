ARG NODE_VERSION=22.17.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build