function chartChange(stockName) {
    $.ajax({
        url: "/get_candlestick_data" ,
        type:"GET" ,
        data :{param:stockName} ,
        success :function(response){
            avgChange(stockName)

        },
        error:function(response){
            console.log("Not done ")
        }
    }) ;
}


//getting average data from function using ajax
function avgChange(stockName){
    $.ajax({
        url:'/avg',
        type:'GET' ,
        data:{param:stockName} ,
        success:function(response){
            console.log(response)
            renderAvg(response , true)
        },
        error:function(response){
            console.log('Not loaded')
        }
    })
}




