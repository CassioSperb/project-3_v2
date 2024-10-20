from flask import Flask, render_template
import pandas as pd

# Initialize Flask app, setting the template folder to the root directory
app = Flask(__name__)

# Define the main route to render index.html from the root directory
@app.route('/')
def index():
    return render_template('roi_flask.html')

if __name__ == '__main__':
    app.run(debug=True)
