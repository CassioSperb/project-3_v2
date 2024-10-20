from flask import Flask, render_template
import pandas as pd

# Initialize Flask app, setting the template folder to the root directory
app = Flask(__name__, template_folder='.')

# Load the datasets
df_roi = pd.read_csv('data/outputs/cumulative_roi_results.csv')

# Define the main route to render index.html from the root directory
@app.route('/')
def index():
    return render_template('roi_flask.html')

if __name__ == '__main__':
    app.run(debug=True)
staticmethod