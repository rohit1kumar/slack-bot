# Dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN chmod -R 777 /app

RUN npm install --ignore-scripts

COPY . .

EXPOSE 3000

# Start the app
CMD ["node", "index.js"]