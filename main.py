from flask import Flask
from flask import render_template, request, redirect, Response, session

app = Flask(__name__)


@app.route("/")
def root():
    return render_template("index.html")

@app.route("/productos")
def productos():
    return render_template("productos.html")


if __name__ == "__main__":
    app.run(debug=True)
