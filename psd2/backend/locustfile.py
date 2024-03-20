from locust import HttpUser, task
import random

class ServerPodTest(HttpUser):
    @task
    def classroom(self):
        user_roles = ["student","tutor"]
        subjects = ["English","Chemistry","Mathematics","Chinese","Malay","Tamil","Biology","Physics" ]

        self.client.get("/classroom?user_role=" + random.choice(user_roles) + "&desired_subject=" + random.choice(subjects))