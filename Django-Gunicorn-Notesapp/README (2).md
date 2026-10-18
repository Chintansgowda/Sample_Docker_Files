# Django-Gunicorn-Notesapp

A beginner-friendly guide to understanding, building, and running this
Notes application with Docker.

> **Important:** This README is based on the project structure provided.
> Some details---such as the exact Gunicorn command, Django settings
> module, URL routes, and whether the React build is served by
> Django---depend on the contents of `Dockerfile`, `procfile`,
> `requirements.txt`, and the Python/JavaScript source files. Check
> those files before relying on example commands marked as examples.

------------------------------------------------------------------------

## 1. Project overview

This repository appears to combine:

-   **Backend:** Django / Python, with an app named `api`
-   **Frontend:** likely a React application in `mynotes`
-   **Database:** SQLite database file `db.sqlite3`
-   **Application server:** Gunicorn, based on the project name
-   **Static assets:** collected into `staticfiles`
-   **Containerization:** Docker

A simplified architecture may look like this:

``` text
Browser
   |
   | HTTP request
   v
Docker host port
   |
   v
Gunicorn
   |
   v
Django project (notesapp)
   |
   +---- Django app / API (api)
   |
   +---- SQLite database (db.sqlite3)
   |
   +---- Static files (staticfiles/)
```

If the React frontend is served separately, the browser loads the
frontend from that service and the frontend makes HTTP requests to the
Django API. If Django serves the React build, the arrangement is
different. Inspect the project's configuration to determine which
architecture it uses.

------------------------------------------------------------------------

## 2. Folder structure explained

Your root directory contains:

``` text
Django-Gunicorn-Notesapp/
├── api/
│   ├── migrations/
│   └── __pycache__/
├── db.sqlite3
├── Dockerfile
├── manage.py
├── mynotes/
│   ├── build/
│   │   └── static/
│   │       ├── css/
│   │       ├── js/
│   │       └── media/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       └── pages/
├── notesapp/
│   └── __pycache__/
├── procfile
├── README.md
├── requirements.txt
└── staticfiles/
    ├── admin/
    ├── css/
    ├── js/
    ├── media/
    └── rest_framework/
```

### `api/` --- Django application / likely backend API

This appears to be a Django app. Django apps commonly contain files such
as:

-   `models.py` --- defines database models.
-   `views.py` --- handles requests and returns responses.
-   `urls.py` --- maps URL paths to views.
-   `serializers.py` --- commonly used with Django REST Framework to
    convert model data to and from API representations.
-   `admin.py` --- configures models for Django's admin site.
-   `tests.py` --- tests for the app.
-   `migrations/` --- database schema-change files.

Your listing shows `api/migrations/`, so Django migration files are
stored there. To see the exact files in this project, run:

``` bash
ls api
ls api/migrations
```

Not every Django app has all of the files listed above.

### `notesapp/` --- likely Django project configuration

A Django *project* package commonly contains:

-   `settings.py` --- installed apps, database configuration,
    middleware, static-file settings, allowed hosts, and other settings.
-   `urls.py` --- the main URL configuration.
-   `wsgi.py` --- the WSGI entry point commonly used by Gunicorn.
-   `asgi.py` --- the ASGI entry point used by ASGI servers.

The folder name `notesapp` suggests that it may be your Django project
package, but confirm by listing its contents:

``` bash
ls notesapp
```

The exact Gunicorn target is usually based on the WSGI module. For
example, if `notesapp/wsgi.py` exists, the target may be
`notesapp.wsgi:application`.

### `mynotes/` --- likely frontend

This directory looks like a React frontend project.

  -----------------------------------------------------------------------
  Path                                Purpose
  ----------------------------------- -----------------------------------
  `mynotes/src/`                      Frontend source code

  `mynotes/src/components/`           Reusable UI components

  `mynotes/src/pages/`                Page-level components or screens

  `mynotes/src/assets/`               Images, icons, fonts, and other
                                      source assets

  `mynotes/public/`                   Public files copied or referenced
                                      by the frontend build

  `mynotes/build/`                    Compiled frontend output, if
                                      produced by the build process

  `mynotes/build/static/css/`         Built CSS assets

  `mynotes/build/static/js/`          Built JavaScript bundles

  `mynotes/build/static/media/`       Built media assets
  -----------------------------------------------------------------------

The presence of `build/` suggests the frontend has been built at some
point. It does **not** prove that Django or Gunicorn serves those files.
Check the Dockerfile and Django static/template configuration.

### `db.sqlite3` --- database file

This is a SQLite database file, not a folder. Django can use it to store
application data, such as notes and user records, depending on the
models in the project.

The database configuration is usually found in `notesapp/settings.py`,
under `DATABASES`.

To inspect the configured database, look for the `DATABASES` setting:

``` bash
grep -n -A 12 "DATABASES" notesapp/settings.py
```

If your settings file is in a different location, adjust the path.

**Docker note:** If `db.sqlite3` is inside the container's writable
filesystem and you remove the container, changes to that file may be
lost with the container. For persistent data, configure a Docker volume
or another persistent database arrangement, and make sure the database
path is stored in that volume.

### `staticfiles/` --- collected static files

This directory commonly contains the output of Django's `collectstatic`
command.

-   `staticfiles/admin/` --- Django admin CSS, JavaScript, images, and
    fonts.
-   `staticfiles/rest_framework/` --- static assets used by Django REST
    Framework's browsable API.
-   `staticfiles/css/`, `staticfiles/js/`, and `staticfiles/media/` ---
    project static assets, depending on the configuration.

`STATIC_URL`, `STATIC_ROOT`, and the installed apps determine how static
files are collected and served. Gunicorn alone is not generally intended
to serve production static files; a web server or a suitable static-file
solution is commonly used.

### `manage.py` --- Django command-line entry point

Use `manage.py` to run Django management commands, for example:

``` bash
python manage.py check
python manage.py migrate
python manage.py collectstatic
python manage.py runserver
```

The last command starts Django's development server. When deploying
through Gunicorn, the container's startup command will usually launch
Gunicorn instead.

### `requirements.txt` --- Python dependencies

This file lists Python packages required by the backend. It may include
Django, Gunicorn, Django REST Framework, database adapters, and other
dependencies.

Inspect it with:

``` bash
cat requirements.txt
```

### `Dockerfile` --- Docker image instructions

The Dockerfile describes how Docker should assemble the application
image: the base image, working directory, dependency installation,
copied files, environment variables, exposed port, and startup command.

Read it with:

``` bash
cat Dockerfile
```

### `procfile` --- process configuration

A Procfile-style file often declares the command a deployment platform
should run, for example a Gunicorn command. The filename is commonly
`Procfile` with a capital `P`, but your listing shows lowercase
`procfile`. Whether the lowercase name is recognized depends on the
deployment platform and configuration.

Inspect it with:

``` bash
cat procfile
```

### `__pycache__/` --- Python bytecode cache

Python creates `__pycache__` directories for cached compiled bytecode.
They are not the main application source code and normally do not need
to be committed to version control.

------------------------------------------------------------------------

## 3. Backend, frontend, and database: quick summary

  -----------------------------------------------------------------------
  Component               Likely location         Responsibility
  ----------------------- ----------------------- -----------------------
  Backend framework       Django                  Receives requests and
                                                  runs application logic

  Django API app          `api/`                  Likely contains API
                                                  views, models, URLs,
                                                  and migrations

  Django project          `notesapp/`             Likely contains
  configuration                                   settings and WSGI/URL
                                                  configuration

  Frontend source         `mynotes/src/`          Likely React pages and
                                                  components

  Frontend build output   `mynotes/build/`        Compiled frontend
                                                  assets

  Database                `db.sqlite3`            SQLite data file

  Static-file collection  `staticfiles/`          Collected static assets

  Python dependencies     `requirements.txt`      Backend packages

  Container build         `Dockerfile`            Instructions for
                                                  building the image

  Process command         `procfile`              May define the
                                                  deployment startup
                                                  command
  -----------------------------------------------------------------------

These are educated interpretations from the folder names. Check the
actual source files to confirm the roles and whether frontend and
backend are deployed together or separately.

------------------------------------------------------------------------

## 4. How Django, Gunicorn, and Docker fit together

### Django

Django is the Python web framework. It handles routing, views, models,
authentication, and application logic.

### Gunicorn

Gunicorn is a WSGI HTTP server. It loads Django's WSGI application and
serves requests to it. A typical Gunicorn target looks like:

``` bash
gunicorn notesapp.wsgi:application
```

This is an **example**; the target must match the actual project package
and WSGI module. A common production command binds to all container
interfaces on port 8000:

``` bash
gunicorn --bind 0.0.0.0:8000 notesapp.wsgi:application
```

Use the command already configured in your Dockerfile or Procfile if it
differs.

### Docker

Docker packages the app and its runtime dependencies into an image. A
container is a running instance of that image.

The general workflow is:

``` text
Source code + dependencies + Dockerfile
                  |
                  v
             docker build
                  |
                  v
              Docker image
                  |
                  v
              docker run
                  |
                  v
             Running container
```

------------------------------------------------------------------------

## 5. Prerequisites

Install or have access to:

-   Docker Desktop (on Windows) or Docker Engine.
-   Git Bash, PowerShell, or another terminal.
-   The project source code.
-   A working Dockerfile and dependency list.

Check Docker:

``` bash
docker --version
docker info
```

If `docker info` fails, ensure Docker Desktop is running.

------------------------------------------------------------------------

## 6. Inspect the project before building

From the project root, run:

``` bash
pwd
ls
cat Dockerfile
cat requirements.txt
cat procfile
```

Inspect the Django project package:

``` bash
ls notesapp
```

Inspect the backend app:

``` bash
ls api
```

Check the Django settings for the database, static files, allowed hosts,
and installed apps:

``` bash
grep -n -E "DATABASES|STATIC_URL|STATIC_ROOT|ALLOWED_HOSTS|INSTALLED_APPS" notesapp/settings.py
```

Adjust the settings path if your project uses a different layout.

------------------------------------------------------------------------

## 7. Build the Docker image

Run these commands from the directory containing the Dockerfile:

``` bash
docker build -t notesapp:v1 .
```

Explanation:

-   `docker build` builds an image from a Dockerfile.
-   `-t notesapp:v1` assigns the image the name `notesapp` and tag `v1`.
-   `.` sends the current directory as the build context.

List images:

``` bash
docker images
```

### What happens during a build?

Docker processes the Dockerfile instructions in order. Depending on the
actual Dockerfile, it may:

1.  Download a Python base image.
2.  Set a working directory.
3.  Copy dependency files.
4.  Install Python packages.
5.  Copy the project source code.
6.  Set environment variables.
7.  Declare a container port.
8.  Configure the startup command.

The exact steps depend on your Dockerfile.

------------------------------------------------------------------------

## 8. Run the container

First, read the Dockerfile and find the port that Gunicorn binds to. For
example, if the app listens on port `8000` inside the container, you can
run:

``` bash
docker run -d --name notesappcont -p 8000:8000 notesapp:v1
```

This command is correct only if the application actually listens on
container port `8000`. If your configured Gunicorn command uses a
different port, adjust the right-hand side of `-p`.

### Understanding port mapping

``` text
-p HOST_PORT:CONTAINER_PORT
```

For `-p 8000:8000`:

-   First `8000`: port on your Windows host.
-   Second `8000`: port inside the container.

The application must bind to `0.0.0.0` inside the container to be
reachable through the published port. Binding only to `127.0.0.1` inside
the container generally prevents access through Docker's published port.

`EXPOSE` in a Dockerfile documents a port; it does not itself publish
the port. The `-p` option publishes it.

### Check the container

``` bash
docker ps
docker ps -a
docker logs notesappcont
docker logs -f notesappcont
```

-   `docker ps` shows running containers.
-   `docker ps -a` includes stopped containers.
-   `docker logs` displays startup output and errors.
-   `docker logs -f` follows logs continuously. Press `Ctrl+C` to stop
    following logs.

If the app is listening on host port 8000, try `http://localhost:8000/`.
The root URL only works if your Django URL configuration defines a route
there. Your API or frontend may instead be available at another path.

------------------------------------------------------------------------

## 9. Useful Docker commands

### Stop and start

``` bash
docker stop notesappcont
docker start notesappcont
```

### Remove the container

``` bash
docker rm -f notesappcont
```

This force-removes the container. Data stored only in the container's
writable layer can be lost.

### Rebuild after code or Dockerfile changes

``` bash
docker rm -f notesappcont
docker build -t notesapp:v1 .
docker run -d --name notesappcont -p 8000:8000 notesapp:v1
```

Adjust the port to match the app's actual listening port.

### Open a shell inside a running container

``` bash
docker exec -it notesappcont sh
```

If Bash is installed, you can use `bash` instead of `sh`.

### Check environment variables

``` bash
docker exec notesappcont printenv
```

### Inspect port mappings

``` bash
docker port notesappcont
```

### Inspect container configuration

``` bash
docker inspect notesappcont
```

------------------------------------------------------------------------

## 10. Django management commands

If the image has the project code and Python dependencies installed, you
can often run management commands inside the container.

Check the Django configuration:

``` bash
docker exec -it notesappcont python manage.py check
```

Apply migrations:

``` bash
docker exec -it notesappcont python manage.py migrate
```

Collect static files:

``` bash
docker exec -it notesappcont python manage.py collectstatic --noinput
```

These commands assume `manage.py` is in the container's working
directory and settings are configured correctly. Run migrations before
relying on database-backed endpoints. For persistent data, make sure the
database location is backed by persistent storage.

For local development outside Docker, if Python and dependencies are
installed in a virtual environment, typical commands are:

``` bash
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
python manage.py check
python manage.py migrate
python manage.py runserver
```

On Windows Git Bash, the activation command above is commonly used.
PowerShell uses `.venv\Scripts\Activate.ps1`. The development server is
for local development, not a production server.

------------------------------------------------------------------------

## 11. Frontend considerations

The `mynotes/` directory appears to contain a React application, but the
Dockerfile at the repository root may or may not build it.

If you need to rebuild the frontend, first inspect
`mynotes/package.json` to determine the package manager and available
scripts:

``` bash
cat mynotes/package.json
```

A common React workflow uses `npm install` followed by `npm run build`,
but use the scripts defined in this project's `package.json`.

The generated `mynotes/build/` directory may be served by Django only if
the project is configured to serve it. Otherwise, the frontend may need
a separate static web server or deployment.

Also check how the frontend chooses the backend API URL. A frontend
built with a development API URL may not reach the backend after
deployment unless the API base URL is configured appropriately.

------------------------------------------------------------------------

## 12. Database persistence and migrations

Django migrations manage database schema changes. The migration files
are usually in `api/migrations/` for models owned by the `api` app.

Useful commands:

``` bash
python manage.py showmigrations
python manage.py makemigrations
python manage.py migrate
```

-   `showmigrations` lists migration status.
-   `makemigrations` creates migration files from model changes.
-   `migrate` applies migrations to the configured database.

Do not assume that deleting and recreating a container will preserve
SQLite changes. For a local SQLite database, mount a persistent volume
or bind mount at the directory containing the database file. Confirm the
configured database path before choosing the mount.

For production, review database backups, concurrent access, durability,
and deployment needs before deciding whether SQLite is appropriate or
whether a managed database is preferable.

------------------------------------------------------------------------

## 13. Troubleshooting

### Container exits immediately

``` bash
docker ps -a
docker logs notesappcont
```

Read the error message. Common causes include missing Python packages,
an incorrect Gunicorn target, invalid Django settings, or an unavailable
database.

### Browser says connection refused

Check that:

1.  The container is running.
2.  Gunicorn starts without errors.
3.  Gunicorn binds to `0.0.0.0` inside the container.
4.  The host port mapping matches the port Gunicorn listens on.
5.  You are visiting the correct URL and port.

Useful commands:

``` bash
docker ps
docker logs notesappcont
docker port notesappcont
```

### `ModuleNotFoundError` or Gunicorn cannot find the application

Check:

-   Whether the required packages are in `requirements.txt`.
-   Whether the Dockerfile installs those requirements.
-   Whether the project package is copied into the image.
-   Whether the Gunicorn target matches the real WSGI module.

For example, `notesapp.wsgi:application` requires a `notesapp/wsgi.py`
module containing an `application` object.

### Django reports `DisallowedHost`

Review `ALLOWED_HOSTS` in Django settings and configure it for the
hostname used to access the app. Avoid broadly disabling host validation
in production.

### Static files are missing

Check:

-   `STATIC_URL` and `STATIC_ROOT`.
-   Whether `collectstatic` has been run.
-   Whether the collected directory is included in the image.
-   Whether a web server or static-file middleware is configured to
    serve the assets.

Gunicorn by itself is not normally the production static-file server.

### Database changes disappear

The database may be stored only in the container filesystem. Confirm the
SQLite database path and mount persistent storage at the appropriate
directory.

### `la: command not found`

`la` is not a standard command in every shell. In Git Bash, use:

``` bash
ls
ls -la
```

`ls -la` displays hidden files as well as regular files, with detailed
information.

------------------------------------------------------------------------

## 14. Production considerations

Before deploying publicly, review the following:

-   Set `DEBUG = False`.
-   Configure `ALLOWED_HOSTS` for the actual deployment hostnames.
-   Keep `SECRET_KEY` and other secrets out of source control; use
    environment variables or a secrets manager.
-   Use HTTPS at the appropriate proxy or web-server layer.
-   Configure static-file serving explicitly.
-   Persist database data and maintain backups.
-   Apply database migrations as part of a controlled deployment
    process.
-   Use a suitable Gunicorn worker configuration for the workload.
-   Consider health checks, logging, and restart policies.
-   Avoid running Django's development server in production.

These are general deployment recommendations. Your exact configuration
depends on the contents of the repository and the environment where it
will run.

------------------------------------------------------------------------

## 15. Quick command reference

  --------------------------------------------------------------------------------------------------
  Task                                Command
  ----------------------------------- --------------------------------------------------------------
  Build image                         `docker build -t notesapp:v1 .`

  List images                         `docker images`

  Run example on port 8000            `docker run -d --name notesappcont -p 8000:8000 notesapp:v1`

  View running containers             `docker ps`

  View all containers                 `docker ps -a`

  View logs                           `docker logs notesappcont`

  Follow logs                         `docker logs -f notesappcont`

  Stop container                      `docker stop notesappcont`

  Remove container                    `docker rm -f notesappcont`

  Open container shell                `docker exec -it notesappcont sh`

  Check published ports               `docker port notesappcont`

  Run Django check                    `docker exec -it notesappcont python manage.py check`

  Apply migrations                    `docker exec -it notesappcont python manage.py migrate`
  --------------------------------------------------------------------------------------------------

**Remember:** use the actual image name, container name, Gunicorn
target, and listening port configured in your project. The example names
and port above are placeholders for a typical setup.

------------------------------------------------------------------------

## 16. Final mental model

-   **React (`mynotes/`)**: what the user sees and interacts with in the
    browser.
-   **Django (`api/` and `notesapp/`)**: the server-side application
    logic and likely API.
-   **SQLite (`db.sqlite3`)**: the local database file configured for
    Django.
-   **Gunicorn**: serves the Django WSGI application.
-   **Static files (`staticfiles/`)**: collected CSS, JavaScript,
    images, and other static assets.
-   **Dockerfile**: describes how to package the app into an image.
-   **Docker image**: the built package.
-   **Docker container**: a running instance of that image.

To confirm the exact setup, inspect `Dockerfile`, `procfile`,
`notesapp/settings.py`, `notesapp/wsgi.py`, and `mynotes/package.json`.
