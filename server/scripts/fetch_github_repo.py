import os
import requests
import json

# Get username and token from environment variables
username = 'yonarbel'
token = os.environ.get('GITHUB_TOKEN');

# The repository you want to access (replace 'owner/repo' with the actual repo path)
repo = 'yonarbel/su2024'

# GitHub API URL to get repository contents
url = f'https://api.github.com/repos/{repo}/contents/'

# Make the authenticated request
response = requests.get(url, auth=(username, token))

# Check the response status
if response.status_code == 200:
    # Parse the JSON response
    contents = response.json()
    
    # Print the contents
    print(json.dumps(contents, indent=2))
else:
    print(f'Failed to fetch repository contents. Status code: {response.status_code}')
    print(response.json())
