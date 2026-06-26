from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

vector_store = Chroma(
    collection_name="therech_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

print(vector_store._collection.count())