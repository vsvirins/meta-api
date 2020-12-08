# pull node.js
FROM node:13

# set working dir
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# X:Y exposes port X to other containers on the same network (for inter-container communication) and port Y to the host
EXPOSE 3000
EXPOSE 3001

# start tapp
CMD ["npm", "start"]


