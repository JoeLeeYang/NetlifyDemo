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
    ScoreAvg = parseFloat((Math.round(Total/keyScoreArray.length*10000000000)/10000000000).toFixed(10));
    
    //標準差
    keyScoreArray.forEach(val => {
      StandardDeviation += Math.pow((Math.abs(parseFloat(val)-ScoreAvg)),2);
    });
    StandardDeviation = parseFloat(Math.sqrt(StandardDeviation/keyScoreArray.length).toFixed(10));

    //Z分數
    ZScoreArray = keyScoreArray.map(val => {
      return (val -ScoreAvg)/StandardDeviation;
    });

    //T分數
    TScoreArray = ZScoreArray.map(val => {
      return parseFloat((Math.round((val*10+50)*100)/100).toFixed(2));
    });

    //調整分數
    AdjustedScoreArray = TScoreArray.map(val =>{
      return parseFloat((Math.round((val*AValue + BValue)*100)/100).toFixed(2));
    });

    // console.log('AVlaue:',AValue);
    // console.log('BValue:',BValue);

    // console.log('ZScoreArr:',ZScoreArray);
    // console.log(('TScoreArr:',TScoreArray));
    // console.log('AdjustedScoreArr:',AdjustedScoreArray);
    
    SetUpScoreResult();  
  });
  
  //table塞值
  function SetUpScoreResult(){
    $('#ResultArea').show();
    
    //清空Div 與 table元素
    $('#showResult td').text('').html('');
    
    //set差分結果
    //綜合得分
    keyScoreArray.forEach(val => {
      $('.AvgTotalScoreTd').append(`<span style='background-color: yellow'>${val} &emsp;</span><br>`)
    });

    //T分數
    TScoreArray.forEach(val => {
    $('.TScoreTd').append(`<span style='background-color: yellow'>${val} &emsp;</span><br>`);
    });
    
    //調整分數
    AdjustedScoreArray.forEach(val =>{
      $('.AdjustedScoreTd').append(`<span style='background-color: yellow'>${val} &emsp;</span><br>`);
    });
    
  }
})
