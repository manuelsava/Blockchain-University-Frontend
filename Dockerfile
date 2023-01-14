FROM node:17-alpine

WORKDIR /universitydapp

COPY . .

RUN npm --legacy-peer-deps install

EXPOSE 3000

CMD ["npm", "run", "local"]