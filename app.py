from flask import Flask, render_template, json
import os

app = Flask(__name__)

@app.route("/")
def index():
    json_path = os.path.join(app.root_path, 'data', 'eventos.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    fechas = data.get("eventos", [])
    return render_template("index.html", fechas=fechas)

if __name__ == "__main__":
    app.run(debug=True)
