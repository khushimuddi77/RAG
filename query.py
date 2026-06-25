from langchain_ollama import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

llm = OllamaLLM(model="qwen3:8b")

embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

vector_store = Chroma(
    collection_name="aws_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

retriever = vector_store.as_retriever(
    search_kwargs={"k":5}
)

question = input("Ask a Question related to Therech Technologies: ")

docs = retriever.invoke(question)

context = "\n\n".join(
    [doc.page_content for doc in docs]
)

prompt = f"""
You are Therech AI Assistant, an internal knowledge assistant for Therech Technologies.

Answer employee questions using only the provided company documents.

Rules:
- Use only the provided context to answer.
- If the answer is not present in the documents, say:
  "I could not find this information in the company documents."
- Do not make assumptions or add external information.
- Mention the source document when possible.

Context:
{context}

Question:
{question}
"""

response = llm.invoke(prompt)

print(response)

print("\nSources:")
for doc in docs:
    print(doc.metadata["source"])