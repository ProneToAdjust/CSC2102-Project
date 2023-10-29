# TODO: Create a class for container_management 
# TODO: Create a class for container (user1ID, user2ID, containerID, containerIP/containerPort)
# TODO: Create a dictionary of containers
# TODO: Create a function to create and start a container, return the container IP or port (Need to decide which one)
# TODO: Create a function to get a container's IP or port (49152 to 65535)
# TODO: Create a function to delete a container
# TODO: Create a function to get the status of a container

import docker

containers = {} # Dictionary of containers {containerID: Container}
client = docker.from_env()
# Delete containers that are the server image
for container in client.containers.list(all=True):
    if container.image.tags[0] == "server:latest" or container.image.tags[0] == "server":
        if container.status == "running":
            container.stop()
        container.remove()
print("Deleted all pre-existing containers")

class Container:
    def __init__(self, port: int):
        self.port = port
        self.userIDs = [None, None]
        

# Creates a container and returns the container ID
# Param: None
# Return: containerID - the ID of the container created
def createContainer() -> str:
    port = _getAvailablePort()
    # Create a container
    container = client.containers.run("server:latest", detach=True, ports={'3001/tcp': port})
    # Add the container to the dictionary
    containers[container.id] = Container(port)
    # Return the container ID
    return container.id

# Deletes a container
# Param: containerID - the ID of the container to delete
# Return: None
def deleteContainer(containerID: str) -> None:
    # Delete the container
    client.containers.get(containerID).stop()
    client.containers.get(containerID).remove()
    # Remove the container from the dictionary
    del containers[containerID]

# Sets the user ID of a container (Applicable for both users)
# Param: containerID - the ID of the container to set the user ID of
#        userID - the ID of the user to set
# Return: True if successful, False if full
def setContainerUserID(containerID: str, userID: int) -> bool:
    if containerID in containers:
        if (containers[containerID].userIDs[0] == None or containers[containerID].userIDs[0] == userID):
            containers[containerID].userIDs[0] = userID
            return True
        elif (containers[containerID].userIDs[1] == None):
            containers[containerID].userIDs[1] = userID
            return True
    return False

# Gets the userIDs associated with a container
# Param: containerID - the ID of the container to get the userIDs of
# Return: user1ID - the ID of the first user
#         user2ID - the ID of the second user
def getContainerUserIDs(containerID: str):
    if containerID in containers:
        return containers[containerID].userIDs[0], containers[containerID].userIDs[1]
    return None, None

# Gets the port associated with a container
# Param: containerID - the ID of the container to get the port of
# Return: port - the port of the container
def getContainerPort(containerID: str) -> int:
    if containerID in containers:
        return containers[containerID].port
    else:
        return None

def _getAvailablePort() -> int:
    for port in range(49152, 65535):
        if not _isPortUsed(port):
            return port
    return None

def _isPortUsed(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0
