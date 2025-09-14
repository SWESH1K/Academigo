# from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import langflow as lf
from .gdrive_rag import get_gdrive_rag_answer

# Create your views here.
@api_view(['GET', 'POST'])
def hello_world(request):
    if request.method == 'GET':
        return Response({"message": "Got some data!", "data": request.data})
    return Response({"message": "Hello, world!"})


@api_view(['POST'])
def gdrive_rag_answer(request):
    """
    Expects a POST request with JSON body: {"question": "your question here"}
    Returns: {"answer": "..."}
    """
    question = request.data.get('question', '')
    if not question:
        return Response({"error": "Question is required"}, status=400)
    try:
        answer = get_gdrive_rag_answer(question)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    return Response({"answer": answer})
