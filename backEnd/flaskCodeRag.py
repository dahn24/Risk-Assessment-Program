# flaskCode-rag.py
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from typing import Optional
import os
from dotenv import load_dotenv
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.runnables import RunnablePassthrough
from langchain.prompts import ChatPromptTemplate
import fitz  # PyMuPDF

# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MONGODB_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGODB_DB")
COLLECTION_NAME = os.getenv("MONGODB_COLLECTION")

print("MONGO_URI:", MONGODB_URI)
print("DB_NAME:", DB_NAME)
print("COLLECTION_NAME:", COLLECTION_NAME)

# ---- MongoDB helper ----
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users_collection = db[COLLECTION_NAME]

def get_investing_type(email: str) -> Optional[str]:
    user = users_collection.find_one({"email": email}, {"_id": 0})
    if user:
        return (user["risk_comfort"], user["growth_preference"], user["time_horizon"], user["loss_tolerance"], 
                user["income_stability"], user["risk_category"])
        
    return None

# ---- Load documents and build Pinecone vector store ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_PATH = os.path.join(BASE_DIR, "ragContext.pdf")

doc = fitz.open(PDF_PATH)
text = ""
for i, page in enumerate(doc):
    text += page.get_text()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
documents = text_splitter.split_text(text)

embeddings = OpenAIEmbeddings()
index_name = "rag-first"

pinecone = PineconeVectorStore.from_texts(documents, embeddings, index_name=index_name)

# ---- Load model and parser ----
model = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-4.1-mini")
parser = StrOutputParser()

# ---- Build LangChain prompt ----
template = """
You are a personalized financial assistant.

User Investment Profile:
- Risk Comfort: {risk_comfort}
- Growth Preference: {growth_preference}
- Loss Tolerance: {loss_tolerance}
- Time Horizon: {time_horizon}
- Income Stability: {income_stability}
- Risk Category: {risk_category}

Use this profile to tailor your advice.

Context:
{context}

User Question:
{question}

If you do not know what the user is asking, reply with "I'm sorry, could you be more specific?".
"""

prompt = ChatPromptTemplate.from_template(template)

rag_chain = prompt | model | parser

# ---- Flask Blueprint ----
rag_bp = Blueprint("rag_bp", __name__)

@rag_bp.route("/ask", methods=["POST", "OPTIONS"])
def ask_question():
    if request.method == "OPTIONS":
        return '', 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    email = data.get("email")
    question = data.get("question")

    if not isinstance(email, str) or not email.strip():
        return jsonify({"error": "Missing or empty 'email'"}), 400
    if not isinstance(question, str) or not question.strip():
        return jsonify({"error": "Missing or empty 'question'"}), 400

    risk_comfort, growth_pref, time_h, loss_toler, income_sta, investing_type = get_investing_type(email)
    if investing_type is None:
        return jsonify({"answer": "I don't know the investing type."})

    try:
        retriever = pinecone.as_retriever()
        context_docs = retriever.invoke(question)
        context_text = "\n\n".join([doc.page_content for doc in context_docs])

        prompt_input = {
            "context": context_text,
            "question": question,
            "risk_comfort": risk_comfort,
            "growth_preference": growth_pref,
            "time_horizon": time_h,
            "income_stability": income_sta,
            "loss_tolerance": loss_toler,
            "risk_category": investing_type
        }

        answer = rag_chain.invoke(prompt_input)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": f"Model invocation failed: {str(e)}"}), 500
