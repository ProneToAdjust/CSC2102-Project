import containerManager

cm = containerManager
print(cm.listContainers())
print(cm.isPortUsed(49152))
cm.createContainer("user1ID")
print(cm.listContainers())