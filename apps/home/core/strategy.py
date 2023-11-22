import numpy as np 
import pandas as pd 
from scipy.signal import argrelextrema
from collections import defaultdict 

# tosolve cup we required monotonic stack
# lets build the stack 

class monotonic:
    def __init__(self) -> None:
        self.arr =[] 

    def insert(self , val  , index )->None :
        if len(self.arr) == 0 : 
            self.arr.append([val ,index])
        if  val > self.arr[len(self.arr) -1 ][0]: 
            self.arr.append([val,  index])
            
    def pop(self) -> int :
        if len(self.arr)> 0 : 
            return self.arr.pop() 
        else : 
            return None 
    
    def len(self) -> int:
        return len(self.arr) 
    
    def peak(self) -> int :
        if len(self.arr) > 0 :
            return self.arr[-1] 
        else : 
            return None 
    
    def last(self) -> int :
        if len(self.arr) > 0 :
            return self.arr[0] 
        else : 
            return None 
    
class strategy: 
    def __init__(self) -> None:
        pass

    def get_max_min(prices, smoothing, window_range):
        smooth_prices = prices['Close'].rolling(window=smoothing).mean().dropna()
        local_max = argrelextrema(smooth_prices.values, np.greater)[0]
        local_min = argrelextrema(smooth_prices.values, np.less)[0]
        price_local_max_dt = []
        for i in local_max:
             if (i>window_range) and (i<len(prices)-window_range):
                   price_local_max_dt.append(prices.iloc[i-window_range:i+window_range]['Close'].idxmax())
        price_local_min_dt = []
        for i in local_min:
              if (i>window_range) and (i<len(prices)-window_range):
                    price_local_min_dt.append(prices.iloc[i-window_range:i+window_range]['Close'].idxmin()) 
        maxima = pd.DataFrame(prices.loc[price_local_max_dt])
        minima = pd.DataFrame(prices.loc[price_local_min_dt])
        max_min = pd.concat([maxima, minima]).sort_index()
        max_min.index.name = 'Date'
        max_min = max_min.reset_index()
        max_min = max_min[~max_min['Date'].duplicated()]
        p = prices.reset_index()
        max_min['day_num'] = p[p['Date'].isin(max_min.Date)].index.values
        max_min = max_min.set_index('day_num')['Close']
        return max_min

    def HS(max_min):
        patterns = defaultdict(list)
        necklines = []  # Store neckline points

        strong = 0.5
        # Window range is 5 units
        for i in range(5, len(max_min)):
            window = max_min.iloc[i - 5:i]

            # Pattern must play out in less than n units
            if window.index[-1] - window.index[0] > 1000:
                continue

            a, b, c, d, e = window.iloc[0:5]
            # HS
            if a < b and b > c and c < d and d > e:
                # neck line and magnitude
                ele = [a, b, c, d, e]
                n1 = max([x - ((a + b) / 2) for x in ele])
                n2 = max([x - ((b + d) / 2) for x in ele])

                # Check conditions for the neckline
                if n1 > 0.015 * ((a + b) / 2) and n2 > 0.015 * ((b + d) / 2):
                    patterns['HS'].append((window.index[0], window.index[-1]))
                    # Store the neckline points
                    necklines.append([[(a + b) / 2, (b + d) / 2] , [a,b,c,d ,e ]])
        return [patterns ,necklines]
    
    
    def IHS(max_min):
        patterns = defaultdict(list)
        window_size = 5

        for i in range(window_size, len(max_min)):
            window = max_min.iloc[i - window_size:i]
            if window.index[-1] - window.index[0] > 1000:continue
            a, b, c, d, e = window
            min_value_in_window = min(window)
            head_shoulder_height_threshold = 0.1 * np.mean([b, d])
            if (
            a > min_value_in_window and     # 'a' is higher than the window's minimum
            c < a and                       # 'c' is lower than 'a'
            c < e and                       # 'c' is lower than 'e'
            c < d and                       # 'c' is lower than 'd'
            e < d and                       # 'e' is lower than 'd'
            abs(b - d) <= head_shoulder_height_threshold  # Height of head and shoulder is within threshold
        ):
                patterns['IHS'].append((window.index[0], window.index[-1]))
        # Define criteria for identifying IHS pattern
        # You may need to adjust these criteria based on your dataset
        
        # Ensure the window is within a reasonable time frame

        # Extract the relevant data points from the window
        return patterns
        
    # Smoothing function using rolling mean
    def smooth_data(self , data, window_size):return data.rolling(window=window_size).mean()

    def find_convex_downward(self, data):
        convex_downward_points = []
        for i in range(1, len(data) - 1):
              if data[i] > data[i - 1] and data[i] > data[i + 1]:
                   convex_downward_points.append(i)
        return convex_downward_points
    
    def find_potential_cup_bottoms(self,data):
        potential_cup_bottoms = []
        for i in range(2, len(data) - 2):
              if (data[i] < data[i - 1] and data[i] < data[i - 2] and
                data[i] < data[i + 1] and data[i] < data[i + 2]):
                potential_cup_bottoms.append(i)
        return potential_cup_bottoms
    
    def find_cup(self, resampled_data , window_size):
        m = monotonic()
        smoothed_close = self.smooth_data(resampled_data['Close'], window_size)
        potential_cup_bottom_indices = self.find_potential_cup_bottoms(smoothed_close)
        potential_cup_bottom_values = [smoothed_close[i] for i in potential_cup_bottom_indices]
        convex_downward_indices = self.find_convex_downward(smoothed_close)
        convex_downward_values = [smoothed_close[i] for i in convex_downward_indices]

        convex_downward_values = convex_downward_values[::-1] 
        convex_downward_indices =convex_downward_indices[::-1]
        count = 0 
        for i in convex_downward_indices:
            m.insert(i ,convex_downward_values[count])
            count+=1 
        
        return [m.arr, potential_cup_bottom_values , count , len(potential_cup_bottom_values)] 
    

def avg(data):
    ma_200 = data['Close'].rolling(window=200).mean().dropna()
    ma_50 = data['Close'].rolling(window=50).mean().dropna()
    ma_15 = data['Close'].rolling(window=15).mean().dropna()
    ma_50.index = ma_50.index + pd.DateOffset(days=50)
    ma_15.index = ma_15.index + pd.DateOffset(days=15)
    # Add 200 zeros to the beginning of the 200-Day Moving Average list
    ma_200_list = [0] * 200 + ma_200.tolist()
    ma_50_list = [0]*50+ma_50.tolist()
    ma_15_list= [0]*15 + ma_15.tolist()
    return {
        'ma_200': ma_200_list,
        'ma_50': ma_50_list,
        'ma_15': ma_15_list,
        'dates': data.index.tolist(),
    }
