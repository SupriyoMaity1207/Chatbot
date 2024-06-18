
# Import the Flask class from the flask module
from flask import Flask, render_template
from chatGemini import gemini_model

# Create an instance of the Flask class
app = Flask(__name__)

# Define a route for the root URL ("/")

@app.route('/register')
def register():
    return render_template ("register.html")

@app.route('/login')
def login():
    return render_template ("login.html")
@app.route('/chat')
def index():
    return render_template ("index.html")
@app.route('/chat', methods=['post'])
def getdata():
    return gemini_model()


@app.route('/')
def voice():
    return render_template ("voice.html")


@app.route('/', methods=['post'])
def getvoice():
    return gemini_model()

# Check if the executed file is the main program and run the app
if __name__ == '__main__':
    app.run(debug=True)
