import requests

url = 'http://localhost/api/auth/signup'
data = {
    'username': 'your_username',
    'email': 'your_email@example.com',
    'password': 'your_password'
}

response = requests.post(url, json=data)
print(response.json())
