# Stage 1: Base setup
FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
RUN yarn install
RUN npx prisma generate

# Stage 2: Development setup
FROM base AS development
ENV NODE_ENV=development

COPY . .
RUN yarn build

CMD [ "yarn", "dev:watch" ]


# Stage 3: Production build
FROM base AS build
ENV NODE_ENV=production

COPY . .
RUN yarn build



# Stage 4: Production runner
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma

COPY package*.json ./
CMD [ "yarn", "start" ]