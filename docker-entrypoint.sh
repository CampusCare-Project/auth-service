#!/bin/sh
set -e

echo "Auth Service container starting..."

echo "Generating Prisma client..."
bunx prisma generate

if [ "$RUN_PRISMA_MIGRATION" = "true" ]; then
  echo "Running Prisma migrate deploy..."
  bunx prisma migrate deploy
fi

if [ "$RUN_PRISMA_DB_PUSH" = "true" ]; then
  echo "Running Prisma db push..."
  bunx prisma db push
fi

echo "Starting Auth Service..."
exec "$@"