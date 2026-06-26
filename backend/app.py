from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_ollama import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

# Load embedding model
embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

# Connect to existing Chroma DB
vector_store = Chroma(
    collection_name="therech_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

retriever = vector_store.as_retriever(
    search_kwargs={"k": 5}
)

# Load LLM
llm = OllamaLLM(
    model="qwen3:8b"
)

@app.post("/query")
def query(request: QueryRequest):

    docs = retriever.invoke(request.question)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    prompt = f"""
You are Therech AI, an internal company assistant.

Answer using ONLY the provided context.

If the answer is not found in the context, say:
"I could not find this information in the company documents."

Context:
{context}

Question:
{request.question}

Answer:
"""

    answer = llm.invoke(prompt)

    return {
        "answer": answer,
        "sources": [
            doc.metadata.get("source", "Unknown")
            for doc in docs
        ]
    }