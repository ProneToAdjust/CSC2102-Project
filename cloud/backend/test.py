import container_manager

cm = container_manager
print(cm.listContainers())
print(cm.isPortUsed(49152))
cm.createContainer("user1ID")