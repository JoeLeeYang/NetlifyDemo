$(function(){
  let keyScoreArray = []; //分數陣列
  let AValue = '';
  let BValue = '';
  let ZScoreArray = [];
  let TScoreArray = [];
  let AdjustedScoreArray = [];
  
  //調整分數AB值
  $('.ABValues').change(function(){
    let value = parseFloat($(this).val());
    let type = $(this).attr('name');
    let oldScore = $(this).data('score');
    // console.log('oldScore=>',oldScore)
    
    $(this).val(value); 
    
    $('#showAlert').text('').html('').hide();
    
    if(type === "AValue" && (value > 3 || value < 0)){
      $('#showAlert').text(`A值範圍是0-3`).append(`<button class='btn alertBtn'>確定</button>`).show();
      $(this).val(oldScore); 
    }
    else if(type === "BValue" && (value > 50 || value < 0)){
      $('#showAlert').text(`b值範圍是0-50`).append(`<button class='btn alertBtn'>確定</button>`).show();
      $(this).val(oldScore); 
    }
    else $(this).data('score',value); //配分比重
      
    $('.alertBtn').on('click',function(){
      $('#showAlert').hide();
    })
  })
  
  //計算btn => 計算高低差 標準差 與 平均值
  $('.calculateScoreBtn').on('click',function(){
    //清空原設定值 與 陣列
    AValue = '';
    BValue = '';
    keyScoreArray = [];

    //取差分設定值
    if($('input[name=AValue]').val() !== '')
      AValue = parseFloat($('input[name=AValue]').val());
    
    if($('input[name=BValue]').val() !== '')
      BValue = parseFloat($('input[name=BValue]').val());
  
    keyScoreArray = $('#keyScoreDiv').val().split(' ').filter(val => {
      return val !== '';
    });
    
    
    let StandardDeviation = 0;//標準差
    let ScoreAvg = 0; //平均值
    let Total = 0;

    //平均值 => 離均差
    keyScoreArray.forEach(function(val){
      Total += parseFloat(val);
    });
    ScoreAvg = parseFloat((Math.round(Total/keyScoreArray.length*100)/100).toFixed(2));
    
    //標準差
    keyScoreArray.forEach(val => {
      StandardDeviation += Math.pow((Math.abs(parseFloat(val)-ScoreAvg)),2);
    });
    StandardDeviation = parseFloat(Math.sqrt(StandardDeviation/keyScoreArray.length));

    //Z分數
    ZScoreArray = keyScoreArray.map(val => {
      return (val -ScoreAvg)/StandardDeviation;
    });

    //T分數
    TScoreArray = ZScoreArray.map(val => {
      return parseFloat((Math.round((val*10+50)*10)/10)).toFixed(2);
    });

    //調整分數
    AdjustedScoreArray = TScoreArray.map(val =>{
      return parseFloat((Math.round((parseFloat(val)*AValue + BValue)*100)/100)).toFixed(2);
    });

    console.log('AVlaue:',AValue);
    console.log('BValue:',BValue);
    console.log('ScoreAvg:',ScoreAvg);
    console.log('StandardDeviation:',StandardDeviation);
    console.log('keyScoreArray:',keyScoreArray);
    console.log('ZScoreArr:',ZScoreArray);
    console.log('TScoreArr:',TScoreArray);
    console.log('AdjustedScoreArr:',AdjustedScoreArray);
    
    SetUpScoreResult();  
    $('#AdjustedScoreDes').show();
  });
  
  //table塞值
  function SetUpScoreResult(){
    $('#ResultArea').show();
    
    //清空Div 與 table元素
    $('#showResult td').text('').html('');
    
    //set差分結果
    //綜合得分
    keyScoreArray.forEach((val,index) => {
      if(index%2 === 0)
        $('.AvgTotalScoreTd').append(`<span style='background-color: rgba(10,255,10,0.8)'>${val}</span><br>`);
      else if(index%2 === 1)
        $('.AvgTotalScoreTd').append(`<span style='background-color: rgba(10,30,200,0.5'>${val}</span><br>`);

    });

    //T分數
    TScoreArray.forEach((val,index) => {
      if(index%2 === 0)
        $('.TScoreTd').append(`<span style='background-color: rgba(10,255,10,0.8)'>${val}</span><br>`);
      else if(index%2 === 1)
        $('.TScoreTd').append(`<span style='background-color: rgba(0,0,200,0.5)'>${val}</span><br>`);
        
    });
    
    //調整分數
    AdjustedScoreArray.forEach((val,index) =>{
      if(index%2 === 0)
        $('.AdjustedScoreTd').append(`<span style='background-color: rgba(10,255,10,.8)'>${val}</span><br>`);
      if(index%2 === 1)
        $('.AdjustedScoreTd').append(`<span style='background-color: rgba(0,0,200,0.5)'>${val}</span><br>`);
    });
    
  }
})
