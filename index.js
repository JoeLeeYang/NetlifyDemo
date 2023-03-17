$(function(){
  let TestPageMode = '0';

   //檢測頁面
   $('#TestPageSel').change(function(){
    TestPageMode = $('#TestPageSel option:selected').val();
    // console.log('TestPageMode=>',TestPageMode)

    $('#selectTestPage').hide();
    $('#showPage').show();

    if(TestPageMode === '1') EJSTemplate('DifferenceTest.html','#showPage');
    if(TestPageMode === '2') EJSTemplate('AdjustedScoreTest.html','#showPage');
    if(TestPageMode === '3') EJSTemplate('CalculateTotalTest.html','#showPage');
    if(TestPageMode === '4') EJSTemplate('EstimatedRelativePerformanceScoreTest.html','#showPage')
  })
})