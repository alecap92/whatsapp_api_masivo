FROM node:20 as build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

CMD ["node", "build/index.js"]