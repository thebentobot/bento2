FROM node:16

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Install packages
RUN npm install

RUN npx prisma generate

# Copy the app code
COPY . .

# Build the project
RUN npm run build

# Expose ports
EXPOSE 6969

# Run the application
CMD [ "node", "dist/start-manager.js" ]