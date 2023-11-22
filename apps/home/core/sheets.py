#under construction 

from __future__ import print_function
import time 
import pandas as pd 
from googleapiclient.discovery import build


from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SERVICE_ACCOUNT_FILE = 'APIS/price_keys.json'


# adding credential 
creds = None 
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE , scopes = SCOPES
)


# The ID and range of a sample spreadsheet.
SPREADSHEET_ID = '1M0orQGQ9kYkTBvsSJCz_-oAqoTwEV-vPapz-Rz8TXpY'
#id will present on doc link 


def main():
    service = build('sheets', 'v4', credentials=creds)

        # Call the Sheets API
    sheet = service.spreadsheets()
        #for range ''sheet_name!A1:B1'
        # to get all data 'sheet_name'
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,range="Data").execute()
    data = pd.DataFrame(result['values'])
    return data

if __name__ == '__main__':
    print(main())