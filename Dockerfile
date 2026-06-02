FROM nginx:alpine
LABEL maintainer="FitClub Engineering Team"
LABEL version="3.0"
LABEL description="FitClub — Сервис фитнес-клуба"

# Копируем файлы приложения
COPY app/ /usr/share/nginx/html/

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
