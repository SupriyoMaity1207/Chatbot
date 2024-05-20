from flask import Flask,render_template,request,jsonify
import os
import markdown2
from langchain_google_genai import GoogleGenerativeAI
app = Flask(__name__)
os.environ['GOOGLE_API_KEY'] = 'AIzaSyAvGhNC698GNrRZbhXv9BxmDErHqSAxmlU'
llms = GoogleGenerativeAI(model="gemini-pro")

 

@app.route('/')
def index():
    return render_template("index.html")
 

@app.route('/', methods=['post'])
def getdata():
     if request.is_json:
         data = request.json['sendQuery']
         print(data)
         
         result=llms.predict(data)
         text = markdown2.markdown(result)
         print(text)
         return jsonify({'message': text})

if __name__ == '__main__':
    app.run(debug=True)