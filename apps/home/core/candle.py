import yfinance as yf 
import numpy as np 
import datetime

class Candle:
    def __init__(self) -> None:
        pass

    def download(self, symbol ):
        start = '2000-01-01' 
        end =  datetime.datetime.today() 
        data = yf.download(symbol , period='1d' ,start = start ,end = end  )
        
        #resample it 
        resample = data.resample('60T', closed='right', label='right').agg({'Open': 'first','High': 'max',
                                                                         'Low': 'min',
                                                                         'Close': 'last'}).dropna()
        return resample  # data return 
    
    def moving_average(self , data):
        # Calculate the 200-day, 50-day, and 15-day moving averages
        ma_200 = data['Close'].rolling(window=200).mean()
        ma_50 = data['Close'].rolling(window=50).mean()
        ma_15 = data['Close'].rolling(window=15).mean()
        return [ma_200 , ma_50 , ma_15] 
