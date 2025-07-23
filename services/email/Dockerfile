# Stage 1: Base setup
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN yarn install


# Stage 2: Development setup
FROM base As development
ENV NODE_ENV=Development

COPY . .
RUN yarn build

CMD [ "yarn", "build" ]

# Stage 3: Production setup
FROM base AS build
ENV NODE_ENV=production
COPY . .
RUN yarn build

# State 4: Production runner
FROM node:18-alpine AS production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package*.json ./

CMD [ "node", "dist/index.js" ]