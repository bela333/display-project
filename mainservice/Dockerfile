FROM node:23.10.0-bookworm AS builder
WORKDIR /mainservice
ADD package-lock.json .
ADD package.json .
RUN npm ci
ADD . /mainservice
# Fill with your environment variable data
ENV S3_ENDPOINT=__ENV__S3_ENDPOINT__YHJZXHPWLP__
ENV S3_ENDPOINT_INTERNAL=__ENV__S3_ENDPOINT_INTERNAL__YHJZXHPWLP__
ENV S3_REGION=__ENV__S3_REGION__YHJZXHPWLP__
ENV S3_ACCESS_KEY_ID=__ENV__S3_ACCESS_KEY_ID__YHJZXHPWLP__
ENV S3_SECRET_ACCESS_KEY=__ENV__S3_SECRET_ACCESS_KEY__YHJZXHPWLP__
ENV S3_CALIBRATION_BUCKET=__ENV__S3_CALIBRATION_BUCKET__YHJZXHPWLP__
ENV S3_MEDIA_BUCKET=__ENV__S3_MEDIA_BUCKET__YHJZXHPWLP__
ENV REDIS_URL=__ENV__REDIS_URL__YHJZXHPWLP__
ENV APRILTAG_URL=__ENV__APRILTAG_URL__YHJZXHPWLP__
RUN npm run build

FROM node:23.10.0-bookworm

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /mainservice/public /app/public
COPY --from=builder /mainservice/.next/standalone /app
COPY --from=builder /mainservice/.next/static /app/.next/static

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]