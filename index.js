$(function(){
  let TestPageMode = '0';

   //檢測頁面
   $('#TestPageSel').change(function(){
    TestPageMode = $('#TestPageSel option:selected').val();
    console.log('TestPageMode=>',TestPageMode)

    $('#selectTestPage').hide();
    $('#showPage').show();

    if(TestPageMode === '1') EJSTemplate(null,'DifferenceTest.html','#showPage')
    if(TestPageMode === '2') EJSTemplate(null,'CalculateTotalTest.html','#showPage')
  })
})