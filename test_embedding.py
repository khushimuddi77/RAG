from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="mxbai-embed-large"
)

result = embeddings.embed_query("What is an IAM role?")

print(type(result))
print(len(result))
print(result[:5])