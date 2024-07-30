from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import SocketIO, send, emit, join_room, leave_room
app = Flask(__name__)
app.secret_key = 'secret!123'
socketio = SocketIO(app)

users = {}
messages = []

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        if username:
            session['username'] = username
            users[username] = request.sid
            return redirect(url_for('index'))
    return render_template('login.html')

@socketio.on('message')
def handle_message(msg):
    username = session['username']
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message = {'username': username, 'msg': msg, 'timestamp': timestamp}
    messages.append(message)
    send(message, broadcast=True)

@socketio.on('connect')
def handle_connect():
    username = session.get('username')
    if username:
        users[username] = request.sid
        emit('user_connected', username, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    username = session.get('username')
    if username:
        users.pop(username, None)
        emit('user_disconnected', username, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)