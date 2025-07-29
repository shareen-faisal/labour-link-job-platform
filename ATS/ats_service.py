from io import BytesIO
import fitz  # PyMuPDF
import requests
from flask import Flask, jsonify, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def extract_text_from_pdf(url):
    try:
        url = url.replace("\\", "/")
        response = requests.get(url)   #Uses the requests library to send an HTTP GET request to the URL provided, aiming to download the PDF file.
        response.raise_for_status()    # If the GET request fails (e.g., if the URL is invalid or the server is down), this line raises an HTTP error.
        pdf_data = BytesIO(response.content)   #The content of the response (the PDF file) is stored in a BytesIO object. This makes the PDF data accessible like a file.
        pdf_document = fitz.open(stream=pdf_data, filetype="pdf")   #The fitz.open() function opens the PDF document from the BytesIO stream. The filetype="pdf" argument tells fitz that the stream is a PDF file.
        text = "" 
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)  #The load_page() function loads each page of the PDF one by one
            text += page.get_text()    # The get_text() method extracts text from the current page, which is then added to the text string.
        return text
    except requests.exceptions.RequestException as e:  #an error related to the HTTP request
        return f"Request error: {e}"
    except fitz.FitzError as e:                        #If there's an issue processing the PDF (like if it’s corrupted), 
        return f"PDF processing error: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def calculate_similarity(resume_text, job_description, job_skills):

    combined_job_details = job_description + " " + job_skills
            
    documents = [resume_text, combined_job_details]
    
    tfidf_vectorizer = TfidfVectorizer()    #An instance of TfidfVectorizer is created. This will convert the text documents into a matrix of TF-IDF(measures how often a word appears and measures how important a word is by looking at how often it appears across all document) features.
    tfidf_matrix = tfidf_vectorizer.fit_transform(documents)   #This converts the text into a numerical matrix that reflects the importance of words in the documents.
     #where each row represents a document, Each column represents a unique term (word) found in the documents. The value at position (i, j) in the matrix represents the TF-IDF score of the term j in the document i.
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])   #returns a 2D slice containing the first and second document's vector,
    
    return similarity[0][0]  # it is a 2D array like [[score]]
    #returns a value between 0 and 1, where 1 means identical and 0 means completely different.

app = Flask(__name__)   #A Flask web application is created

@app.route('/process-data', methods=['POST'])  #run the process_data function whenever a POST request is made to the /process-data URL.
def process_data():
    data = request.json
    resume_url = data.get('resume_url')
    job_description = data.get('job_description')
    job_skills = data.get('job_skills')

    if not resume_url or not job_description or not job_skills:
        return jsonify({'error': 'resume_url, job_description, and job_skills are required'}), 400   #If any are missing, it returns an error response with a status code of 400 (Bad Request).

    resume_text = extract_text_from_pdf(resume_url)
    if resume_text.startswith("Request error") or resume_text.startswith("PDF processing error") or resume_text.startswith("An unexpected error occurred"):
        return jsonify({'error': resume_text}), 400    #If an error occurred during text extraction (indicated by the start of the returned string), an error message is sent back to the client with a 400 status code.

    similarity_score = calculate_similarity(resume_text, job_description, job_skills)

    ats_score = round(similarity_score * 100, 2)

    return jsonify({'ats_score': ats_score})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
