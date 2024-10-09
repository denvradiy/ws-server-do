# Используем образ node:10-alpine
FROM node:10-alpine

# Создаем директорию для приложения
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# Устанавливаем рабочую директорию
WORKDIR /home/node/app

# Копируем файлы package.json и package-lock.json
COPY --chown=node:node package*.json ./

# Выполняем установку зависимостей под пользователем node
USER node
RUN npm install

# Копируем остальные файлы приложения
COPY --chown=node:node . .

# Открываем порт для доступа к приложению
EXPOSE 3000

# Запускаем приложение
CMD [ "node", "api/index.js" ]
