## My sever Ip: 13.211.10.154

## Start a web server on port 80

1. Install node:\
   `curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -`\
   `sudo apt-get install -y nodejs`

1. Initialize npm in the working directory:
   `npm init`

1. Install Express in the working directory:
   `npm install express`

Create the app.js file with Vim Editor:

```
const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.send("<h1>Welcome to my sever</h1>");
});

app.listen(80, () => {
console.log("Listening on port 80");
});
```

## Run Web Server in the Background with Docker

1. Install Docker:\
   `sudo apt install docker.io`\
   `sudo systemctl start docker`\
   `sudo systemctl enable docker`\
   `sudo usermod -aG docker ubuntu`

1. Verify the installation:
   `sudo docker info`

1. Create a Dockerfile:

   ```

   # Use a base image

   FROM node:14

   # Set the working directory inside the container

   WORKDIR /app

   # Copy the necessary files to the container

   COPY app/app.js .
   COPY app/package\*.json ./

   # Install dependencies or run any necessary commands

   RUN npm install


    # Expose the port that your web server listens on

    EXPOSE 80

    # Specify the command to run your web server

    CMD ["node","app.js"]

   ```

   The project structure should be like this:

   > Dockerfile
   > app/app.js

1. Build the Docker Image:
   `docker build -t my-web-server .`

1. Run the Container:
   `docker run -d -p 80:80 my-web-server`
