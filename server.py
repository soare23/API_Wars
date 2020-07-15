from flask import Flask, request, redirect, render_template
import requests

app = Flask(__name__)


@app.route("/")
def home_page():
    data = requests.get("https://swapi.dev/api/planets").json()
    return render_template('index.html', planet_data=data)


if __name__ == '__main__':
    app.run(debug=True)
