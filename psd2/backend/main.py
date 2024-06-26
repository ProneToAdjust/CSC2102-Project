"""
This module contains a Flask server that creates and manages classroom containers.
The server listens on port 4000 and has a single endpoint '/classroom' that accepts GET requests with two query parameters:
'user_role' and 'desired_subject'. The server creates a classroom container for the user and returns the containers's port number for the frontend to open a socket connection to.
If there is no waiting classroom in the queue, the server creates one and adds the classroom container's id to the waiting list for the other role.
If there is a waiting classroom in the queue, the server pops the classroom container's id from the waiting list.
"""
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
import queue
from collections import defaultdict
import containerManager

app = Flask(__name__)
app.config['CORS_HEADER'] = 'Content-Type'

waiting_list = {}
waiting_list = defaultdict(lambda: queue.Queue(), waiting_list)

@app.route('/classroom')
@cross_origin()
def classroom():
    # get user_role, desired_subject from request
    # example request(student): http://localhost:4000/classroom?user_role=student&desired_subject=math
    # example request(tutor): http://localhost:4000/classroom?user_role=tutor&desired_subject=math

    user_role = request.args.get('user_role')
    desired_subject = request.args.get('desired_subject')

    # make key for waiting_list dictionary, e.g. 'student for math' or 'tutor for math'
    waiting_list_key = user_role + ' for ' + desired_subject

    # get classroom queue from waiting list
    classroom_queue = waiting_list[waiting_list_key]

    # if there is no waiting classroom in the queue,
    # create one and add classroom id to waiting list for the other role
    # else, pop classroom id from waiting list
    if classroom_queue.qsize() == 0:
        classroom_id = containerManager.createContainer()

        # create waiting list key for other role, e.g. 'tutor for math' or 'student for math'
        waiting_list_key = 'tutor for ' + desired_subject if user_role == 'student' else 'student for ' + desired_subject
        waiting_list[waiting_list_key].put(classroom_id)

    else:
        classroom_id = classroom_queue.get()

    # get classroom port from container manager
    classroom_port = containerManager.getContainerPort(classroom_id)

    # create response json
    response = {
        'classroom_port': classroom_port
    }

    return make_response(response, 200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
