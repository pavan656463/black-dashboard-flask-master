import requests

# Replace 'YOUR_API_KEY' with your actual API key
API_KEY = 'd04ea3b45c144f10a5a058fd28fd11dd'
BASE_URL = 'https://newsapi.org/v2'

def fetch_news_by_company(company_name):
    endpoint = f'{BASE_URL}/everything'
    params = {
        'apiKey': API_KEY,
        'q': company_name,
        'sortBy': 'publishedAt',
    }

    response = requests.get(endpoint, params=params)

    if response.status_code == 200:
        articles = response.json()['articles']
        for article in articles:
            print(article['title'], article['description'], article['url'])
    else:
        print('Failed to fetch news articles')

# Call the function to fetch news articles related to a specific company
company_name = 'TATA'  # Replace with the company name
fetch_news_by_company(company_name)
