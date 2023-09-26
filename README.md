# Canchu
The `Canchu` project is the Back-End program of a social networking platform that empowers users to forge connections and express their thoughts.

# Features
- user
    - sign up/sign in
    - user profile with introduction, picture and past posts

- friend
    - add/delete friends
    - agree/delete friend requests
- event 
    - send notifications when users send or accept friend requests
- post
    - create posts
    - create and delete likes
    - create comments
    - demonstrate user's own timeline

### Run in Docker:
Step1: Pull the repo and Switch to branch week_5_part_5
```bash
git clone https://github.com/PTC1116/Canchu.git
git checkout week5_part_5
```
Step2: Create .env file for the program 
```bash
cd Campus-Summer-Back-End/students/pei-tung/Canchu/app
vim .env
```
Step3: Create a private directory for nginx config file 
```bash
cd Campus-Summer-Back-End/students/pei-tung
mkdir private
```
Step4: Move to the target directory
```bash
cd Campus-Summer-Back-End/students/pei-tung/Canchu
```
Step5: Built the docker image
```bash
docker build -t canchu-server .
```
Step6: Built the docker image
```bash
docker compose-up -d
```

## Tech stack
- Node.js
- MySQL/Amazon RDS
- Redis
- Nginx
- Amazon EC2
- Jest
- Docker
- K6