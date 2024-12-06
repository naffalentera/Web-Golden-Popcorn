# Backend Dockerfile
FROM node:16

WORKDIR /app

# Menyalin package.json dan package-lock.json ke container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install wait-for-it untuk menunggu database siap
RUN apt-get update && apt-get install -y wait-for-it

# Menyalin sisa aplikasi ke container
COPY ./backend ./

# Mengexpose port aplikasi
EXPOSE 5000

# Menjalankan aplikasi backend dengan menunggu PostgreSQL siap
CMD ["wait-for-it", "postgres:5432", "--", "node", "server.js"]

