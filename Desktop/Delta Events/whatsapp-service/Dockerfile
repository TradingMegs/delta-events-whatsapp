FROM node:20-alpine

WORKDIR /app

# Install system dependencies for native modules if needed
RUN apk add --no-cache git python3 make g++

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
