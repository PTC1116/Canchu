#FROM node:20-alpine3.17
#WORKDIR /Canchu
#RUN apk update && apk add --no-cache bash
#COPY app .
#COPY wait-for-it/wait-for-it.sh .
#RUN chmod +x /Canchu/wait-for-it.sh
#RUN npm install
#EXPOSE 3000
#CMD ["bash", "/Canchu/wait-for-it.sh", "db:3306", "--", "node", "server.js"]

FROM node:20-alpine3.17
WORKDIR /Canchu
RUN apk update && apk add --no-cache bash
COPY ./app ./app
COPY ./wait-for-it/wait-for-it.sh .
RUN chmod +x /Canchu/wait-for-it.sh
RUN npm install
EXPOSE 3000
CMD ["bash", "/Canchu/wait-for-it.sh", "db:3306", "--", "node", "server.js"]

