
# Use Python 3.11 with a lightweight Linux image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency file into /app
COPY requirements.txt .

# Install all Python dependencies listed in requirements.txt
# --no-cache-dir helps reduce unnecessary pip cache files in the image
RUN pip install --no-cache-dir -r requirements.txt

# Copy the remaining application files into /app
COPY . .

# Document that the Django application listens on container port 8000
EXPOSE 8000

# Prevent Python from creating .pyc bytecode files
ENV PYTHONDONTWRITEBYTECODE=1

# Make Python logs appear immediately without normal output buffering
ENV PYTHONUNBUFFERED=1

# Start a shell to execute multiple commands in sequence
# First, apply pending Django database migrations
# && runs the next command only if migrations succeed
# Then, use Gunicorn to serve the Django WSGI application
# notesapp.wsgi:application points to the WSGI application object
# --bind 0.0.0.0:8000 listens on all container interfaces, port 8000
# exec replaces the shell with Gunicorn for better signal handling
CMD ["sh", "-c", "python3 manage.py migrate && exec gunicorn notesapp.wsgi:application --bind 0.0.0.0:8000"]

#Think of it as telling Docker:
#"When the container starts, first update the database, and if that succeeds, start the Django web server."

# sh starts a shell.
# -c tells the shell to execute the command string that follows.
