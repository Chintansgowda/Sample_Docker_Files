# Base image (OS)

FROM python:3.9-slim

# Working directory

WORKDIR /app

# Copy src code to container

COPY . .

# Run the build commands

RUN pip install -r requirements.txt

# expose Container port 80

EXPOSE 80

# serve the app / run the app (keep it running)

CMD ["python3","run.py"]














FROM python:3.9-slim

WORKDIR /app

COPY . .

ENV app_env=dev

RUN pip install -r requirements.txt

EXPOSE 80

ENTRYPOINT [ "python3" ]

CMD [ "run.py" ]