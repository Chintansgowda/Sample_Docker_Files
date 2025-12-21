# Base image (OS)

FROM python:3.9-slim

# Working directory

WORKDIR /app

# Copy src code to container

COPY . .

# Run the build commands

RUN pip install -r requirements.txt

<<<<<<< HEAD
# expose Container port 80
=======
# expose port 80
>>>>>>> 934d1b0580056cea993df502a53d992b7faeadae

EXPOSE 80

# serve the app / run the app (keep it running)

<<<<<<< HEAD
CMD ["python3","run.py"]














FROM python:3.9-slim

WORKDIR /app

COPY . .

ENV app_env=dev

RUN pip install -r requirements.txt

EXPOSE 80

ENTRYPOINT [ "python3" ]

CMD [ "run.py" ]
=======
CMD ["python","run.py"]

>>>>>>> 934d1b0580056cea993df502a53d992b7faeadae
