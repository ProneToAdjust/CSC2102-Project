# CSC2102-Project Group 13
## How to start
### Prerequisites
- Docker
- Kubernetes (Docker desktop)

### Windows Configuration
To build the docker image, run the following command in the root directory of the project:
```
cd psd2\classroom
apply.bat
```
To build the kubernetes server, run the following command in the root directory of the project:
```
cd psd2\backend
apply.bat
```
To build the kubernetes client, run the following command in the root directory of the project:
```
cd psd2\client
apply.bat

```

### Mac Configuration
To build the docker image, run the following command in the root directory of the project:
```
cd psd2/classroom
bash apply.sh
```
To build the kubernetes server, run the following command in the root directory of the project:
```
cd psd2/backend
bash apply.sh
```
To build the kubernetes client, run the following command in the root directory of the project:
```
cd psd2\client
bash apply.sh
```

Now when you run `kubectl get all` you should see the following:

![Alt text](readme_images/kubectl_get_all.png)

### Usage

#### Classroom
With the kubernetes server and client running, you can access the landing page by going to `localhost:30000/`

![Landing Page](readme_images/landing_page.png)

Select your role and subject from the dropdowns and click `Join A Room`

![Role and Subject selected](readme_images/role_and_subject_selected.png)

You will be redirected to a waiting page where you will wait for another user to join the room.

![Waiting Page](readme_images/waiting_page.png)

For the purposes of this demo, you will need to open another browser window and go to `localhost:30000/` and select the opposite user_role as the first user.

![Second User](readme_images/second_user.png)

Once the second user joins the room, you will be redirected to the classroom page.

![Classroom](readme_images/classroom.png)

If you view the running containers in Docker Desktop, you will see the a container for the classroom would have been created.

![Alt text](readme_images/classroom_container.png)

#### Whiteboard

The whiteboard is a shared space where users can draw and write on the board. The whiteboard is accessible by clicking the `Show Whiteboard` button on the classroom page.

![Whiteboard disabled](readme_images/whiteboard_disabled.png)
![Whiteboard tutor](readme_images/whiteboard_tutor.png)
![Whiteboard student](readme_images/whiteboard_student.png)


#### Classroom scaling

If you repeat the steps above to make another Classroom, you will notice a new container with a different port is created for the new classroom.

![Alt text](readme_images/new_classroom_container.png)

#### Stress testing HPA
To stress test the HPA functionality of the client pod, run the following commands:
```
pip install locust
cd psd2/client
locust
```
Then go to `localhost:8089` and enter the following values:
```
Number of total users to simulate: 100
Hatch rate (users spawned/second): 10
Host: http://localhost:30000
```
When you click `Start swarming`, you will see the number of users increase to 100 and the CPU usage of the client pod increase and scale according to the number of users.
```
kubectl get hpa
```

#### Stress testing classroom creation
To stress test the classroom creation functionality of the backend pod, run the following commands:
```
pip install locust
cd psd2/backend
locust
```
Then go to `localhost:8089` and enter the following values:
```
Number of total users to simulate: 1
Hatch rate (users spawned/second): 1
Host: http://localhost:30001
```
When you click `Start swarming`, you will see the number of users increase to 100 and the CPU usage of the backend pod increase and scale according to the number of users.
```
kubectl get hpa
```