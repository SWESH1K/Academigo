import vertexai
from vertexai.preview import rag
from vertexai.preview.generative_models import GenerativeModel, Tool

PROJECT_ID = "focus-melody-456405-j4"
REGION = "europe-west3"
DRIVE_FOLDER_ID = "1w6ereiIieyu-jyNsxfrpjxE64OrStOYi"
EMBEDDING_MODEL = "publishers/google/models/text-embedding-004"
MODEL = "gemini-2.5-flash"

def get_gdrive_rag_answer(question: str):
    """
    Given a question, retrieves an answer using Google Drive RAG and Gemini model.
    """
    vertexai.init(project=PROJECT_ID, location=REGION)

    # Initialize the Embedding config instance for our chosen embedding model
    embedding_model_config = rag.EmbeddingModelConfig(
        publisher_model=EMBEDDING_MODEL
    )

    rag_corpus = rag.create_corpus(
        display_name="rag-corpus", embedding_model_config=embedding_model_config
    )

    # Import files from Google Drive folder
    rag.import_files(
        corpus_name=str(rag_corpus.name),
        paths=[f"https://drive.google.com/drive/folders/{DRIVE_FOLDER_ID}"],
        chunk_size=512,
        chunk_overlap=50,
    )

    print("Corpus Name:", rag_corpus.name)

    # Query the corpus
    _ = rag.retrieval_query(
        rag_resources=[
            rag.RagResource(
                rag_corpus=rag_corpus.name,
            )
        ],
        text=question,
        similarity_top_k=9,  # how many similar chunks to return
        vector_distance_threshold=0.5,  # how relevant the entries must be
    )

    rag_store = rag.VertexRagStore(
        rag_corpora=[str(rag_corpus.name)],
        similarity_top_k=9,
        vector_distance_threshold=0.5,
    )

    rag_retrieval_tool = Tool.from_retrieval(
        retrieval=rag.Retrieval(source=rag_store)
    )

    llm = GenerativeModel(
        MODEL,
        tools=[rag_retrieval_tool],
    )

    response = llm.generate_content(question, stream=True)
    # If streaming, collect the response
    if hasattr(response, '__iter__'):
        answer = "".join([chunk.text for chunk in response])


    else:
        answer = str(response)
    return answer
    # if 'choices' in chunk:
        # print(chunk['choices'][0]['delta'].get('content', ''), end='', flush=True)
    print(chunk.text, end='', flush=True)

for r in rag.list_corpora():
  rag.delete_corpus(name=r.name)
