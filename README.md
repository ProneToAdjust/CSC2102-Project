# CSC3104-Project
## How to start
### Prerequisites
- Docker
- Kubernetes (Docker desktop)

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

Now when you run `kubectl get all` you should see the following:

![Alt text](readme_images/kubectl_get_all.png)

### Usage

#### Chatroom
With the kubernetes server and client running, you can access the chatroom by going to `localhost:30000/`

![Landing Page](readme_images/landing_page.png)

Select your language and language to learn from the dropdowns and click `Join A Room`

![Languages selected](readme_images/languages_selected.png)

You will be redirected to a waiting page where you will wait for another user to join the room.

![Waiting Page](readme_images/waiting_page.png)

For the purposes of this demo, you will need to open another browser window and go to `localhost:30000/` and select the opposite languages as the first user.

![Second User](readme_images/second_user.png)

Once the second user joins the room, you will be redirected to the chatroom page.

![Chatroom](readme_images/chatroom.png)

If you view the running containers in Docker Desktop, you will see the a container for the chatroom would have been created.

![Alt text](readme_images/chatroom_container.png)

#### Translation

To send a translated message, click on the 'Translate?' button and the messages you send will be translated to the language you are learning.

![Translate disabled](readme_images/translate_disabled.png)
![Translate enabled](readme_images/translate_enabled.png)
![Alt text](readme_images/chat_translate_enabled_sender.png)
![Alt text](readme_images/chat_translate_enabled_receiver.png)

#### Chatroom scaling

If you repeat the steps above to make another chatroom, you will notice a new container with a different port is created for the new chatroom.

![Alt text](readme_images/new_chatroom_container.png)