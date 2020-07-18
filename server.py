from flask import Flask, request, redirect, render_template, url_for, session, escape, flash
import requests
import util
import data_manager

app = Flask(__name__)
app.config["SECRET_KEY"] = 'UF9y5KFUzcgGsYCG4ZsslQ'


@app.route("/")
@app.route('/home')
def home_page():
    user = None
    if 'username' in session:
        user = escape(session['username'])
        return render_template('index.html', user=user)
    return render_template('index.html', user=user)


@app.route('/registration', methods=["POST", "GET"])
def registration():
    username = None
    password = None
    if request.method == "POST":
        username = request.form.get('username')
        password = util.hash_password(request.form.get('password'))
        if data_manager.check_user_exists(username):
            flash('The user already exists. Please choose a different username')
            redirect(url_for('registration'))
        else:
            data_manager.add_new_user(username, password)
            flash('Succesulf registration. Login to continue.')
            return redirect(url_for('login'))
    return render_template('registration.html')


@app.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        data = data_manager.get_user_data_by_username(username)
        saved_password = data[0]['password']
        if util.verify_password(password, saved_password):
            session["username"] = data[0]['username']
            return redirect(url_for('home_page'))
        else:
            flash("Wrong username or password")
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout', methods=["POST", "GET"])
def logout():
    session.pop('username', None)
    return redirect(url_for('home_page'))


if __name__ == '__main__':
    app.run(debug=True)
