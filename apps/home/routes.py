# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
from datetime import datetime


from apps.home import blueprint
from flask import render_template, request, jsonify
from flask_login import login_required
from jinja2 import TemplateNotFound

# from here we get all the functions for api's
import yfinance as yf

from apps.home.core.strategy import avg

c_data = [

]
price = [

]
live_price = [

]
target= [

]

@blueprint.route('/index')
@login_required
def index():
    return render_template('home/index.html', segment='index')




@blueprint.route('/<template>')
@login_required
def route_template(template):
    try:

        if not template.endswith('.html'):
            template += '.html'

        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment)

    except TemplateNotFound:
        return render_template('home/page-404.html'), 404

    except:
        return render_template('home/page-500.html'), 500


@blueprint.route("/get_candlestick_data" , methods = ['GET'])
@login_required
def get_candlestick_data():
    candlestick_data = []
    name = request.args.get('param')
    start_date = "2013-01-01"
    end_date = datetime.now().strftime("%Y-%m-%d")
    # for this it only works between mon to friday
    symbol = name
    if name == None:
        symbol = 'TCS.NS'

    # get live price
    ticker = yf.Ticker(symbol)
    live_price_ = ticker.history(period='1d')['Close'][0]
    # Fetch historical data from Yahoo Finance
    data = yf.download(symbol, start=start_date, end=end_date ,interval='1d')

    #passing this for avg calc
    c_data.append(data)
    #passing for cup
    price.append(data)
    live_price.append(live_price_)

    for index, row in data.iterrows():
        timestamp = int(index.timestamp() * 1000)  # Convert the datetime to milliseconds
        open_price, high_price, low_price, close_price = row["Open"], row["High"], row["Low"], row["Close"]
        candlestick = {
        "x": timestamp,
        "y": [open_price, high_price, low_price, close_price]
    }
        candlestick_data.append(candlestick)
    return jsonify(result = candlestick_data)


@blueprint.route('/avg' , methods =['GET'])
def get_avg():
    data= c_data.pop()
    #moving average data
    ma_data = avg(data)
    return jsonify(ma_data)




# Helper - Extract current page name from request
def get_segment(request):
    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment
    except:
        return None



