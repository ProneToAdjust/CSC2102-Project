import docker

# TODO: Create a class for container management
# TODO: Create a class for container
# TODO: Create a dictionary of containers
# TODO: Create a function to create and start a container, return the container IP or port (Need to decide which one)
# TODO: Create a function to get a container's IP or port
# TODO: Create a function to delete a container

client = docker.from_env()
print(client.containers.list())
client.images.pull('nginx')
print(client.images.list())