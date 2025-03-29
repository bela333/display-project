FROM python:3.13.2-bookworm
WORKDIR /apriltagservice
ADD requirements.txt ./
ENV CMAKE_POLICY_VERSION_MINIMUM=3.5
RUN pip install --default-timeout=10000 -r requirements.txt

ADD * ./


EXPOSE 8000
CMD [ "fastapi", "run" ]