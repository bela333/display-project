FROM python
WORKDIR /apriltagservice
ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD * ./


EXPOSE 8000
CMD [ "fastapi", "run" ]