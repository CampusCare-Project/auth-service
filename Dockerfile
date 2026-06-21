FROM oven/bun:1

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY bun.lockb* ./

RUN bun install

COPY prisma ./prisma
RUN bunx prisma generate

COPY . .

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["bun", "run", "start"]