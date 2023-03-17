$(function(){
  let Score = '';
  let BetweenPersons = '';
  let LowerThanPersons = '';
  let AllPersons = '';
  let min = "";
  let max = "";

 //回首頁
 $('.goHome').off('click').on('click',function(){
  $('#selectTestPage').show();
  $('#showPage').hide();
});
  
  //調整分數AB值
  $('.inputVal').change(function(){
    let value = parseFloat($(this).val());
    let type = $(this).attr('name');
    let oldScore = $(this).data('score');
    // console.log('oldScore=>',oldScore)

    $('#showAlert').text('').html('').hide();
    
    if(type === "Score" && (value < 0 || value > 100)){
      $('#showAlert').text(`學期平均分數範圍是0-100`).append(`<button class='btn alertBtn'>確定</button>`).show();
      $(this).val(oldScore); 
      return;
    }
    else if(type === "Score" && (value > 0 || value < 100)){
      Score = value;
      min = parseInt(value);
      max = parseInt(value)+1;
      $('#MaxMin span:nth-child(2)').text(min);
      $('#MaxMin span:nth-child(4)').text(max);
    }
    else if(type === "BetweenPersons") BetweenPersons = value;
    else if(type === "LowerThanPersons") LowerThanPersons = value;
    else if(type === "AllPersons") AllPersons = value;
      
    $('.alertBtn').on('click',function(){
      $('#showAlert').hide();
    })
  });
  
  //計算btn => 計算高低差 標準差 與 平均值
  $('.calculateScoreBtn').on('click',function(){
    //清空原設定值 與 陣列
    Score,BetweenPersons,LowerThanPersons,AllPersons,min,max = ''; 

    let RelativePerformanceVal,MaxRelativePerformanceVal,MinRelativePerformanceVal = "";

    //計算相對表現
    RelativePerformanceVal = parseFloat(Math.round(((1-(Score - min))*BetweenPersons+LowerThanPersons)/AllPersons*1000)/10).toFixed(1);
    MinRelativePerformanceVal = parseFloat(Math.round(((1-(min - min))*BetweenPersons+LowerThanPersons)/AllPersons*1000)/10).toFixed(1);
    MaxRelativePerformanceVal = parseFloat(Math.round((LowerThanPersons)/AllPersons*1000)/10).toFixed(1);
    
    console.log('Score:',Score);
    console.log('BetweenPersons:',BetweenPersons);
    console.log('LowerThanPersons:',LowerThanPersons);
    console.log('AllPersons:',AllPersons);
    console.log('min:',min);
    console.log('max:',max);
    console.log('RelativePerformanceVal:',RelativePerformanceVal);
    
    SetUpScoreResult(RelativePerformanceVal,MaxRelativePerformanceVal,MinRelativePerformanceVal);  
  });
  
  //table塞值
  function SetUpScoreResult(RelativePerformanceVal,MaxRelativePerformanceVal,MinRelativePerformanceVal){
    $('#ResultArea').show();
    
    //清空Div 與 table元素
    $('#showResult td').text('').html('');
    
    $('.RelativePerformanceRange').text(`${MaxRelativePerformanceVal} % ~ ${MinRelativePerformanceVal} %`)
    $('.RelativePerformanceVal').text(`${RelativePerformanceVal}%`)     
  }
})
