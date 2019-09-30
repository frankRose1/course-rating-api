FROM node:10-alpine

RUN mkdir app
WORKDIR /app

# if package-lock doesnt exist on the host it will be created and the build wont fail
COPY package*.json ./

# install packages and clean to cache to make image as small as possible
RUN npm install && npm cache clean --force

COPY . .

EXPOSE 8000
CMD ["node", "dist/server.js"]