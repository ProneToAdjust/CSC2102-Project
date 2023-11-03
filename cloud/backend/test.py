from containerManager import *

containerID = createContainer()
port = getContainerPort(containerID)
print("Port: " + str(port))
print("User 1 added: " + str(setContainerUserID(containerID, 1)))
print("User 2 added: " + str(setContainerUserID(containerID, 2)))
print("User 3 added: " + str(setContainerUserID(containerID, 3)))
user1, user2 = getContainerUserIDs(containerID)
print("User 1 ID: " + str(user1))
print("User 2 ID: " + str(user2))
deleteContainer(containerID)
print("Container user IDs: " + str(getContainerUserIDs(containerID)))
