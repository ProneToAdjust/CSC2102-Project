# TODO: Create a class for container_management 
# TODO: Create a class for container (user1ID, user2ID, containerID, containerIP/containerPort)
# TODO: Create a dictionary of containers
# TODO: Create a function to create and start a container, return the container IP or port (Need to decide which one)
# TODO: Create a function to get a container's IP or port (49152 to 65535)
# TODO: Create a function to delete a container
# TODO: Create a function to get the status of a container

import docker

containers = {}
client = docker.from_env()

class Container:
    def __init__(self, uid, port):
        self.uid = uid
        self.port = port
        self.user1ID = None
        self.user2ID = None


def listContainers():
    client.containers.list()
    
def createContainer(user1ID):
    # Create a container
    container = client.containers.run("server", "sleep 100", detach=True, ports={'3001/tcp': getAvailablePort()})
    # Add the container to the dictionary
    containers[container.id] = Container(container.id, container.ports)
    # Return the container ID
    return container.id

def deleteContainer(containerID):
    # Delete the container
    client.containers.get(containerID).remove()
    # Remove the container from the dictionary
    del containers[containerID]

def getAvailablePort():
    for port in range(49152, 65535):
        if not isPortUsed(port):
            return port

def isPortUsed(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0
