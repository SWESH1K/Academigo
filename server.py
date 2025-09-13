from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
import uvicorn
from uuid import uuid4
import json, re, pprint

# ---------------- Load PDF & Prepare Vectorstore ----------------
pdf_path = r"C:\Users\vamsi\Downloads\DSSNotes CO1_CO2.pdf"
loader = PyPDFLoader(pdf_path)
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(docs, embeddings, persist_directory="db")

llm = OllamaLLM(model="mistral")

# ---------------- Session Store ----------------
sessions = {}   # {session_id: ConversationBufferMemory}
quizzes = {}    # {session_id: quiz_dict}


def generate_quiz_from_session(memory: ConversationBufferMemory, llm: OllamaLLM):
    """Generate quiz (Q + 4 options) from the session memory."""
    chat_history = memory.chat_memory.messages
    history_text = "\n".join(
        [f"{msg.type.upper()}: {msg.content}" for msg in chat_history]
    )

    prompt = f"""
    Based on the following conversation:

    {history_text}

    Generate a quiz with 5 multiple-choice questions.
    Each question must have exactly 4 options and one correct answer.

    Respond in JSON format strictly:
    [
        {{
            "question": "....",
            "options": ["A", "B", "C", "D"],
            "answer": "B"
        }},
        ...
    ]
    """

    resp = llm.invoke(prompt)

    try:
        quiz = json.loads(resp)
    except:
        json_str = re.search(r"\[.*\]", resp, re.DOTALL).group(0)
        quiz = json.loads(json_str)

    return quiz


# ---------------- API Setup ----------------
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    session_id: str | None = None  # frontend can pass this, else new session


@app.post("/ask")
def ask_question(request: QueryRequest):
    # --- Manage Session ---
    if request.session_id is None or request.session_id not in sessions:
        sid = str(uuid4())  # generate new session_id
        sessions[sid] = ConversationBufferMemory(
            memory_key="chat_history", return_messages=True
        )
    else:
        sid = request.session_id

    memory = sessions[sid]

    # ✅ Check if user wants to end session
    if request.query.strip().lower() == "exit":
        quiz = generate_quiz_from_session(memory, llm)
        quizzes[sid] = quiz

        print(f"\n=== QUIZ for session {sid} ===")
        pprint.pprint(quiz)
        print("=====================================\n")

        del sessions[sid]
        return {"session_id": sid, "status": "session ended", "quiz": quiz}

    # --- Create Conversational Retrieval Chain ---
    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        memory=memory
    )

    # --- Ask the Question ---
    result = qa.invoke({"question": request.query})
    return {"session_id": sid, "answer": result["answer"]}


# ---------------- Run ----------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
