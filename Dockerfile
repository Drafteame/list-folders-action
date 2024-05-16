FROM node:20-alpine

LABEL "com.github.actions.icon"="blue"
LABEL "com.github.actions.color"="folder"
LABEL "com.github.actions.name"="list-folders-action"
LABEL "com.github.actions.description"="List sub-folders of all the given paths and return different formats of the founded sub-folders"
LABEL "org.opencontainers.image.source"="https://github.com/Drafteame/list-folders-action"

COPY . /app
WORKDIR /app

RUN npm install --omit=dev

ENTRYPOINT ["node", "/app/index.js"]