FROM node:18-alpine

ARG PORT
ENV PORT=${PORT}
ARG DB_MAIN
ENV DB_MAIN=${DB_MAIN}

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
HEALTHCHECK CMD curl --fail http://localhost:8080 || exit 1
EXPOSE 8080
CMD [ "pnpm", "run", "start" ]
