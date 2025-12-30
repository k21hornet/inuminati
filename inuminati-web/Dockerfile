FROM node:18-alpine

WORKDIR /frontapp

COPY package*.json .
RUN npm install

COPY . .

RUN mkdir -p public/uploads/images && \
    chmod -R 755 public/uploads

ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
