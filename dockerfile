FROM node:18.18.2-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN yarn

COPY src ./src

RUN yarn run build

FROM node:18.18.2-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN yarn --production

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs
RUN adduser -S user -u 1001

RUN chown -R user:nodejs /app

USER user

EXPOSE 3000

CMD ["node", "dist/app.js"]