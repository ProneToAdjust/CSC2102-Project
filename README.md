# CSC3104-Project
## How to start
### Prerequisites
- Docker
- Kubernetes

### Windows Configuration
To build the docker image, run the following command in the root directory of the project:
```
cd cloud\chatroom
apply.bat
```
To build the kubernetes server, run the following command in the root directory of the project:
```
cd cloud\backend
apply.bat
```
To build the kubernetes client, run the following command in the root directory of the project:
```
cd cloud\client
apply.bat

```

### Mac Configuration
To build the docker image, run the following command in the root directory of the project:
```
cd cloud/chatroom
bash apply.sh
```
To build the kubernetes server, run the following command in the root directory of the project:
```
cd cloud/backend
bash apply.sh
```
To build the kubernetes client, run the following command in the root directory of the project:
```
cd cloud\client
bash apply.sh
```
With the kubernetes server and client running, you can access the chatroom by going to `localhost:30000/`
