FROM node:current

WORKDIR /usr/src/clean-node-api

COPY ./package.json .

RUN npm install

# COPY ./dist ./dist

# EXPOSE 3333

# CMD ["npm", "start"]

# docker build -t image_name .
# docker run -it image_name sh
# docker run -p 5000:5000 imaage_name
