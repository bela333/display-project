FROM python
WORKDIR /apriltagservice
ADD requirements.txt ./
RUN pip install --default-timeout=10000 -r requirements.txt

ADD * ./


EXPOSE 8000
CMD [ "fastapi", "run" ]