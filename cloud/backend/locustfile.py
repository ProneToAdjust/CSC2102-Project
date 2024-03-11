from locust import HttpUser, task
import random

class ServerPodTest(HttpUser):
    @task
    def classroom(self):
        subjList = ["English","Chemistry","Mathematics","Chinese","Malay","Tamil","Biology","Physics" ]

        self.client.get("/classroom?user_role=" + random.choice(subjList) + "&desired_subject=" + random.choice(subjList))