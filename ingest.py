from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

import os
import uuid

embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

vector_store = Chroma(
    collection_name="aws_docs",
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

all_chunks = []

for file in os.listdir("./therech_company_docs"):

    if file.endswith(".pdf"):

        loader = PyPDFLoader(
            f"./therech_company_docs/{file}"
        )

        docs = loader.load()

        chunks = splitter.split_documents(docs)

        for chunk_num, chunk in enumerate(chunks):

            chunk.metadata["source"] = file
            chunk.metadata["chunk"] = chunk_num

        all_chunks.extend(chunks)

ids = [str(uuid.uuid4()) for _ in all_chunks]

vector_store.add_documents(
    documents=all_chunks,
    ids=ids
)

print(f"Stored {len(all_chunks)} chunks")