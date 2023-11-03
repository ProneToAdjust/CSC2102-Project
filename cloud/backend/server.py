"""
This module contains a Flask server that creates chatrooms for users to communicate in different languages.
The server listens on port 3000 and has a single endpoint '/chatroom' that accepts GET requests with two query parameters:
'user_language' and 'desired_language'. The server creates a chatroom for the user and returns the chatroom's IP address and port number.
If there is no waiting chatroom in the queue, the server creates one and adds the chatroom id to the waiting list for the other language.
If there is a waiting chatroom in the queue, the server pops the chatroom id from the waiting list.
"""
from flask import Flask, request, make_response
import queue
from collections import defaultdict
import containerManager

app = Flask(__name__)

waiting_list = {}
waiting_list = defaultdict(lambda: queue.Queue(), waiting_list)

@app.route('/chatroom')
def chatroom():
    # get user_language, desired_language from request
    # example request: http://localhost:3000/chatroom?user_language=english&desired_language=spanish
    user_language = request.args.get('user_language')
    desired_language = request.args.get('desired_language')

    # make key for waiting_list dictionary, e.g. 'english to spanish'
    waiting_list_key = user_language + ' to ' + desired_language

    # get chatroom queue from waiting list
    chatroom_queue = waiting_list[waiting_list_key]

    # if there is no waiting chatroom in the queue,
    # create one and add chatroom id to waiting list for the other language
    # else, pop chatroom id from waiting list
    if chatroom_queue.qsize() == 0:
        chatroom_id = containerManager.createContainer()

        # create waiting list key for other language, e.g. 'spanish to english'
        waiting_list_key = desired_language + ' to ' + user_language
        waiting_list[waiting_list_key].put(chatroom_id)

    else:
        chatroom_id = chatroom_queue.get()

    # get chatroom port from container manager
    chatroom_port = containerManager.getContainerPort(chatroom_id)

    # create response json
    response = {
        'chatroom_port': chatroom_port
    }

    return make_response(response, 200)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
