
# Import the Flask class from the flask module
from flask import Flask, render_template

# Create an instance of the Flask class
app = Flask(__name__)

# Define a route for the root URL ("/")
@app.route('/')
def chat():
    return render_template ("index.html")

# Check if the executed file is the main program and run the app
if __name__ == '__main__':
    app.run(debug=True)
