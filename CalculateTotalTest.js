$(function(){
  let ScoreUnit = '';
  let WeightArray = [];
  let ScoreArray = [];
  let ScoreWeightArray = [];
  let total = 0;

  //回首頁
  $('.goHome').off('click').on('click',function(){
    $('#selectTestPage').show();
    $('#showPage').hide();
    EJSTemplate('index.html','#showPage');
  });

  $('#ScoreUnit').change(function(){
    ScoreUnit = $('#ScoreUnit option:selected').val();
    // console.log('ScoreUnit=>',ScoreUnit)
    // console.log(typeof(ScoreUnit));

    $('#EachWeight,#EachScore').val('');

    if(ScoreUnit === '0') return;

    $('#EachWeightArea').show(); 

    if(ScoreUnit === '2')  $('#EachWeightArea').hide(); 
    
    $('#EachScoreArea').show(); 
  })

  $('.calculateScoreBtn').on('click',function(){

    total = 0
    WeightArray = [];
    ScoreArray = [];
    ScoreWeight = [];

    $('#TotalResultArea').show();

    ScoreArray = $('#EachScore').val().split(' ').filter(val =>{
      return val !== '';
    })
    // console.log('ScoreArray=>',ScoreArray)

    WeightArray = $('#EachWeight').val().split(' ').filter(val =>{
      return val !== '';
    })

    ScoreWeightArray = ScoreArray.map(function(val,index){
      return {Weight:WeightArray[index], Score:val};
    })
    
    // console.log('ScoreWeightArray=>',ScoreWeightArray);

     //總分計算
    if(ScoreUnit === '1'){

      ScoreWeightArray.forEach(function(item){
        // console.log(item);
        total += parseFloat(item.Score)*parseFloat(item.Weight)/100;
      });    
      total = parseFloat(Math.round(total*100)/100);
    }
    else if(ScoreUnit === '2'){
      ScoreArray.forEach(function(item){
        total += parseInt(item);
      });
    }

    // console.log('total:',total);

    $('#TotalResult').text(total); 
  })

 

})
