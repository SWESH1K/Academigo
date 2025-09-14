import vertexai
from vertexai.preview import rag
from vertexai.preview.generative_models import GenerativeModel, Tool

PROJECT_ID = "focus-melody-456405-j4"
REGION = "europe-west3"
DRIVE_FOLDER_ID = "1w6ereiIieyu-jyNsxfrpjxE64OrStOYi"
EMBEDDING_MODEL = "publishers/google/models/text-embedding-004"
MODEL = "gemini-2.5-flash"

QUESTIONS="What is CBAM?"

vertexai.init(project=PROJECT_ID, location=REGION)

# initializing the Embedding config instance for our chosen embedding model
embedding_model_config = rag.EmbeddingModelConfig(
    publisher_model=EMBEDDING_MODEL
)

rag_corpus = rag.create_corpus(
    display_name="rag-corpus", embedding_model_config=embedding_model_config
)

rag.import_files(
    corpus_name=str(rag_corpus.name),
    paths=[f"https://drive.google.com/drive/folders/{DRIVE_FOLDER_ID}"],
    chunk_size=512,
    chunk_overlap=50,
)

response = rag.retrieval_query(
    rag_resources=[
        rag.RagResource(
            rag_corpus=rag_corpus.name,
        )
    ],
    text=QUESTIONS,
    similarity_top_k=10,  # how many similar chunks to return
    vector_distance_threshold=0.5,  # how relevant the entries must be
)

rag_store = rag.VertexRagStore(
    rag_corpora=[str(rag_corpus.name)],
    similarity_top_k=10,
    vector_distance_threshold=0.5,
)

rag_retrieval_tool = Tool.from_retrieval(
    retrieval=rag.Retrieval(source=rag_store)
)

llm = GenerativeModel(
    MODEL,
    tools=[rag_retrieval_tool],
)

llm.generate_content(QUESTIONS)

for r in rag.list_corpora():
  rag.delete_corpus(name=r.name)
