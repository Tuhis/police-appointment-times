FROM node:16-alpine3.14 as builder

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./

USER node

RUN npm install && npm cache clean --force --loglevel=error

COPY --chown=node:node src/ ./src/
RUN ls
RUN pwd

RUN [ "npm", "run", "build"]


FROM node:16-alpine3.14

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --from=builder --chown=node:node /home/node/app/build/ ./
COPY --from=builder --chown=node:node /home/node/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/app/package.json ./
RUN ls

EXPOSE 3001
CMD [ "node", "index.js" ]
