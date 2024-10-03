FROM alpine AS builder

RUN apk update &&\
    apk upgrade &&\
    apk add nodejs npm

WORKDIR /build-env

COPY . .

RUN npm ci --development &&\
    npm run build

FROM nginxinc/nginx-unprivileged

COPY --from=builder /build-env/dist /usr/share/nginx/html
COPY --from=builder /build-env/src/assets /usr/share/nginx/html/assets/src
COPY --from=builder /build-env/nginx/default.conf /etc/nginx/conf.d/default.conf