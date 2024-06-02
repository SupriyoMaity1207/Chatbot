from flask import Flask,request,jsonify
from langchain_google_genai import GoogleGenerativeAI
import os
import markdown2

os.environ['GOOGLE_API_KEY'] = 'AIzaSyAvGhNC698GNrRZbhXv9BxmDErHqSAxmlU'
llms = GoogleGenerativeAI(model="gemini-pro")



def gemini_model():
     if request.is_json:
         data = request.json['sendQuery']
         print(data)
         result=llms.invoke(data)
         text = markdown2.markdown(result)
         print(text)
         return jsonify({'message': text})