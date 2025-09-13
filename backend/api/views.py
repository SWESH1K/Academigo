# from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import langflow as lf

# Create your views here.
@api_view(['GET', 'POST'])
def hello_world(request):
    if request.method == 'GET':
        return Response({"message": "Got some data!", "data": request.data})
    return Response({"message": "Hello, world!"})

@api_view(['GET', 'POST'])
def get_response(request):
    if request.method == 'POST':
        # For POST requests with JSON body
        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({"error": "Prompt is required"}, status=400)
        try:
            response = lf.get_response(prompt)['outputs'][0]['outputs'][0]['results']['message']['data']['text']
        except Exception as e:
            response = f"Error: {e}"
        # response = f"Received prompt: {prompt}"
        return Response({"message": "Response Generated", "response": response})

    return Response({"message": "Response Not Generated"})
