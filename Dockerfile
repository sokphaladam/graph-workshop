FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# where available (npm@5+)
COPY pnpm-lock.yaml .
COPY package.json .

RUN npm install -g pnpm

COPY . .

RUN pnpm i
RUN pnpm -v

RUN pnpm graph
RUN pnpm run build
HEALTHCHECK CMD curl --fail http://localhost/.well-known/apollo/server-health || exit 1
EXPOSE 80
CMD [ "pnpm", "run", "start" ]