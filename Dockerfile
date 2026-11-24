FROM node:24 AS runtime
WORKDIR /app

COPY . .

RUN npm install


CMD ["node", "scheduler.ts"]

