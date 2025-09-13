# Note: Replace **<YOUR_APPLICATION_TOKEN>** with your actual Application token
import requests
from dotenv import load_dotenv
import os

load_dotenv()

# The complete API endpoint URL for this flow
url = f"https://api.langflow.astra.datastax.com/lf/6697092a-318e-4ade-86e9-cc6dbaf537dc/api/v1/run/21fb1bfc-0d18-44eb-b9e4-eee3352627e9"  
token = os.getenv("LANGFLOW_TOKEN")

# Request payload configuration
payload = {
    "input_value": "hello world!",  # The input value to be processed by the flow
    "output_type": "chat",  # Specifies the expected output format
    "input_type": "chat"  # Specifies the input format
}

# Request headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"  # Authentication key from environment variable'}
}

def get_response(message):
    try:
        payload["input_value"]  = message
        # Send API request
        response = requests.request("POST", url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for bad status codes

        # Print response
        # print(response.text)
        response = response.json()
        return response

    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
    except ValueError as e:
        print(f"Error parsing response: {e}")
