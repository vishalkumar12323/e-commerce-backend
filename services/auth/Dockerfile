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
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production
RUN yarn add prisma --dev

COPY --from=build /app/dist ./dist
COPY --from=base /app/prisma ./prisma
RUN npx prisma generate

CMD [ "yarn", "start" ]