from locust import HttpUser, task
import random

class ClientPodTest(HttpUser):
    @task
    def homepage(self):
        self.client.get("/")
