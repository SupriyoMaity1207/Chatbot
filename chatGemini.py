from flask import Flask, request, jsonify
from langchain_google_genai import GoogleGenerativeAI
from langchain_google_community import GoogleSearchAPIWrapper
from langchain_core.tools import Tool
import os
import markdown2

app = Flask(__name__)

# Set up API keys
os.environ['GOOGLE_API_KEY'] = 'AIzaSyAvGhNC698GNrRZbhXv9BxmDErHqSAxmlU'
llms = GoogleGenerativeAI(model="gemini-pro")

os.environ['GOOGLE_API_KEY'] = 'AIzaSyBFazGst7gU84Ts-Xjf7BATBDBxomhcnMI'
os.environ["GOOGLE_CSE_ID"] = "b5ad7c4f4ca0f406a"

# Create Google Search Tool
search = GoogleSearchAPIWrapper(k=2)
tool = Tool(name="google_search", description="Search Google for recent results.", func=search.run)

def llm_model(query):
    result = llms.invoke(query)
    text = markdown2.markdown(result)
    return text

def google_search(query):
    search_results = tool.run(query)
    # Debugging: Print the search results to inspect the content
    print("Search Results:", search_results)
    
    # Instead of trying to parse it as JSON, let's format the plain text results
    formatted_results = markdown2.markdown(search_results)
    return formatted_results

@app.route('/query', methods=['POST'])
def gemini_model():
    if request.is_json:
        data = request.json
        query = data.get('sendQuery', '')

        # Simple heuristic to determine if we should use search or model
        if any(term in query.lower() for term in ["2023", "2024", "latest", "recent", "today", "tomorrow",'next','live']):
            # Use Google Search for recent queries
            response = google_search(query)
        else:
            # Use Gemini model for general queries
            response = llm_model(query)

        return jsonify({'message': response})
    else:
        return jsonify({'error': 'Request must be JSON'}), 400

