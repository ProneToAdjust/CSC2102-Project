from locust import HttpUser, task
import random

class ServerPodTest(HttpUser):
    @task
    def chatroom(self):
        langList = ["English", "Español" , "Korean", "Japanese", 'Bulgarian', 'Czech', 'Danish', 'German','Greek','Estonian', 'Finnish', 'French', 'Hungarian', 'Indonesian', 'Italian', 'Lithuanian', 'Latvian', 'Norwegian (Bokmål)', 'Dutch', 'Polish', 'Romanian', 'Russian', 'Slovak', 'Slovenian', 'Swedish', 'Turkish', 'Ukrainian', 'Chinese' ]

        self.client.get("/chatroom?user_language=" + random.choice(langList) + "&desired_language=" + random.choice(langList))