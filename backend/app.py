from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_ollama import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

app = FastAPI()


# ---------------------------------------
# CORS
# ---------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------
# Health Check
# ---------------------------------------
@app.get("/")
def root():
    return {"message": "Therech AI Backend is running 🚀"}


# ---------------------------------------
# Request Model
# ---------------------------------------
class QueryRequest(BaseModel):
    question: str


# ---------------------------------------
# Load Embeddings
# ---------------------------------------
embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)


# ---------------------------------------
# Connect to Chroma
# ---------------------------------------
vector_store = Chroma(
    collection_name="therech_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)


# ---------------------------------------
# Retriever
# ---------------------------------------
retriever = vector_store.as_retriever(
    search_kwargs={"k": 5}
)


# ---------------------------------------
# Load LLM
# ---------------------------------------
llm = OllamaLLM(
    model="qwen3:8b"
)


# ---------------------------------------
# Query Endpoint
# ---------------------------------------
@app.post("/query")
def query(request: QueryRequest):

    question = request.question.strip()

    # -----------------------------------
    # Greetings
    # -----------------------------------
    greetings = {
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening"
    }

    if question.lower() in greetings:
        return {
            "answer": (
                "Hello! 👋 I'm Therech AI.\n\n"
                "I can answer questions about company policies, employee handbook, "
                "leave, travel, security, engineering guidelines and benefits."
            ),
            "sources": [],
            "mode": "general"
        }

    # -----------------------------------
    # Thanks
    # -----------------------------------
    if question.lower() in {"thanks", "thank you", "thx"}:
        return {
            "answer": "You're welcome! 😊",
            "sources": [],
            "mode": "general"
        }

    # -----------------------------------
    # Retrieve Documents
    # -----------------------------------
    docs = retriever.invoke(question)

    # -----------------------------------
    # No relevant documents found
    # -----------------------------------
    if len(docs) == 0:

        generic_prompt = f"""
You are Therech AI.

The user asked:

{question}

The uploaded company documents do not contain information related to this question.

Provide a helpful and accurate answer using your general knowledge.

Start your response EXACTLY with:

⚠️ I couldn't find this information in the uploaded company documents.

The following answer is based on my general AI knowledge and may not represent official company policy.

Then continue with your answer.
"""

        answer = llm.invoke(generic_prompt)

        return {
            "answer": answer,
            "sources": [],
            "mode": "general"
        }

    # -----------------------------------
    # Build Context
    # -----------------------------------
    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    # -----------------------------------
    # Company Prompt
    # -----------------------------------
    prompt = f"""
You are Therech AI, an internal enterprise assistant.

Answer ONLY using the provided company documents.

If the answer is not explicitly present in the context,
respond exactly with:

"I couldn't find this information in the uploaded company documents."

Do NOT use outside knowledge.

Company Documents:
{context}

Question:
{question}

Answer:
"""

    answer = llm.invoke(prompt)

    # -----------------------------------
    # If the LLM still couldn't answer,
    # fallback to general AI
    # -----------------------------------
    if "couldn't find this information" in answer.lower():

        generic_prompt = f"""
You are Therech AI.

The uploaded company documents do not contain information for this question.

Question:
{question}

Provide a helpful answer using your general knowledge.

Begin with:

⚠️ I couldn't find this information in the uploaded company documents.

The following answer is based on my general AI knowledge and may not represent official company policy.

Then answer normally.
"""

        answer = llm.invoke(generic_prompt)

        return {
            "answer": answer,
            "sources": [],
            "mode": "general"
        }

    # -----------------------------------
    # Collect Sources
    # -----------------------------------
    sources = []

    for doc in docs:
        source = doc.metadata.get("source", "Unknown")

        if source not in sources:
            sources.append(source)

    return {
        "answer": answer,
        "sources": sources,
        "mode": "company"
    }