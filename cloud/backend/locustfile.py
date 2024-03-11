from locust import HttpUser, task
import random

class ServerPodTest(HttpUser):
    @task
    def chatroom(self):
        subjList = ["English","Chemistry","Mathematics","Chinese","Malay","Tamil","Biology","Physics" ]

        self.client.get("/chatroom?user_subject=" + random.choice(subjList) + "&desired_subject=" + random.choice(subjList))