# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the dependencies off app ie requirements.txt into the container at /app
COPY requirements.txt .

# Install necessary packages and any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Expose container port
EXPOSE 8000

# Run migrations and then start the server
CMD [ "sh", "-c", "python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000" ]
