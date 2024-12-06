# Frontend Dockerfile
FROM node:16

WORKDIR /app

# Menyalin package.json dan package-lock.json ke container
COPY package*.json ./

# Install dependencies
RUN npm install

# Menyalin sisa aplikasi ke container
COPY ./frontend ./

# Mengexpose port aplikasi
EXPOSE 3000

CMD ["npm", "start"]

