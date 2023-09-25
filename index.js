$(function(){
  const app = Vue.createApp({
    data(){
      return {
        showPage:'',
        isIndexPage: true,
        isDifferencePage: false,//差分檢測
        isAdjustedScorePage:false,//調整分數檢測
        isCalculateTotalPage: false,//書審頁面總分檢測
        isRelativePerformancePage:false, //推估相對現
        indexList: [
          { name: '差分檢測',
            engName: 'isDifferencePage',
          },
          { name: '調整分數檢測',
            engName: 'isAdjustedScorePage',
          },
          { name: '書審頁面-總分檢測',
            engName: 'isCalculateTotalPage',
          },
          { name: '推估相對表現檢測',
            engName: 'isRelativePerformancePage',
          },
        ],
        differenceObj:{ //差分檢測
          differenceMode: '', //差分制 =>1 各面向差分、 2 總分差分
          scoreUnit: '',//面向制 => 1 百分制 、 2 配分制
          heightDifferenceSet: '', //高低差設定
          standardDeviationSet:'', //標準差設定
          avgSet:'', //離均差設定
          showWeightArea: false,
          showScoreArea:false,
          showChangeToScoreUnit1:false,
		  showCalResult: false,
          scoreStr:'',//各面向分數輸入
          scoreArr:[], //分數Arr
          scoreWeightArr:[],//分數的Arr (配分制 換算為百分制、保留原配分分數)
          weightStr:'', //配分比重
        },
        adjustedScoreObj:{ //調整分數
          scoreA:'',
          scoreB:'',
          scoreStr:'',
          scoreArr:[],
          tScoreArr:[],
          adjustedScoreArr:[],
          isShowResultArea: false,
        },
        estimatedRelPerObj:{ //推估相對表現
          score: '',
          betweenPersons: '',
          lowerThanPersons:'',
          allPersons:'',
          min:'',
          max:'',
          minRelativePerformanceVal:'',
          maxRelativePerformanceVal:'',
          relativePerformanceVal:'',
          showCalResultArea:false
        },
      }
    },
    created(){
      emitter.on('sendDifferenceData',(data)=>{
        this.differenceObj.scoreArr = data;
	  	});	  
    },
    methods: {
      changePage(page){ //index 切換頁面
        if(page !== '') this.isIndexPage = false;
        this[page] = !this[page];
      },
      turnToIndexPage(){ //返回首頁
        this[this.showPage] = false;
        this.isIndexPage = true;
				this.showPage = '';
		// window.location.reload();
      },
      showArea(){ //差分頁面 show Area
        let objName = '';
        let scoreUnit = 0;

        if(this.showPage === 'isDifferencePage'){
          objName = 'differenceObj';
		  scoreUnit = this.differenceObj.scoreUnit;
		  differenceMode = this.differenceObj.differenceMode;

          this[objName].showScoreArea = false;
		  this[objName].showWeightArea = false;
			
		  
		  if(scoreUnit === 1) this[objName].showScoreArea = true;
		  if(scoreUnit === 2 ){
			this[objName].showScoreArea = true;
			this[objName].showWeightArea = true;
		  }
        }
        else if(this.showPage === 'isCalculateTotalPage'){
          objName = 'totalTestObj';
          scoreUnit = this.totalTestObj.scoreUnit;

          this[objName].showScoreArea = false;
          this[objName].showWeightArea = false;

          if(scoreUnit === 2) this.totalTestObj.showScoreArea = true;
          if(scoreUnit === 1 ){
            this[objName].showScoreArea = true;
            this[objName].showWeightArea = true;
          }
        }
      },
      saveToArr(isWeight=false){ // 將輸入的分數存至scoreArr

        if(this.showPage === 'isDifferencePage')
          this.differenceObj.scoreArr = this.differenceObj.scoreStr.split(' ').filter(item => {
            return item !=='';
          });

        else if(this.showPage === 'isAdjustedScorePage')
          this.adjustedScoreObj.scoreArr = this.adjustedScoreObj.scoreStr.split(' ').filter(item=>{
            return item !== '';
          })
          
        else if(this.showPage === 'isCalculateTotalPage' && !isWeight)
          this.totalTestObj.scoreArr = this.totalTestObj.scoreStr.split(' ').filter(item=>{
            return item !== '';
          })
        
        else if(this.showPage === 'isCalculateTotalPage' && isWeight)
          this.totalTestObj.weightArr = this.totalTestObj.weightStr.split(' ').filter(item=>{
            return item !== '';
          })
	  },	
		 
	  changeDiffType(differenceMode) {
		  emitter.emit('differenceMode', differenceMode);		  
	  },		
	 
      calculateDifference(){ //差分計算
        let scoreArr = this.differenceObj.scoreArr;

        //各面向差分 && 配分制 && 比重不為空值
        if(this.differenceObj.scoreUnit === 2 && this.differenceObj.differenceMode !== 2 && this.differenceObj.weightStr !== ''){
          let weight = this.differenceObj.weightStr;
          let tempArr = [];

          scoreArr.forEach((item,key) => {
            tempArr.push({
              score: parseFloat((parseFloat(item)/weight*100).toFixed(10)),
              originScore: parseInt(item)
            })
          });
          this.differenceObj.scoreWeightArr = tempArr;

          this.differenceObj.showChangeToScoreUnit1 = true; 
				}
				if(!this.differenceObj.showCalResult) this.differenceObj.showCalResult = true
      },
      calculateAdjustedScore(){ //調整分數計算 
        let scoreArr = this.adjustedScoreObj.scoreArr;

        //平均值
        let totalVal = 0;
        scoreArr.forEach((item,key) => {
          scoreArr[key] = parseFloat(item);
          totalVal += scoreArr[key];
        })
        let avgVal = parseFloat((Math.round(totalVal/scoreArr.length*10000000000)/10000000000).toFixed(10));

        //標準差
        let standardDeviationVal = 0;
        scoreArr.forEach(item => {
          standardDeviationVal += Math.pow((Math.abs(item - avgVal)),2);
        })
        standardDeviationVal = parseFloat(Math.sqrt(standardDeviationVal/scoreArr.length).toFixed(10));

        //Z分數
        let zScoreArray = scoreArr.map(val => (val -avgVal)/standardDeviationVal);

        //T分數
        this.adjustedScoreObj.tScoreArr = zScoreArray.map(val => {
          return parseFloat((Math.round((val*10+50)*10)/10)).toFixed(2);
        });

        //調整分數
        this.adjustedScoreObj.adjustedScoreArr = this.adjustedScoreObj.tScoreArr.map(val =>{
          return parseFloat((Math.round((parseFloat(val)*this.adjustedScoreObj.scoreA + this.adjustedScoreObj.scoreB)*100)/100)).toFixed(2);
        });

        this.adjustedScoreObj.avgShowOnTable
        
        this.adjustedScoreObj.isShowResultArea = true;
      },
      
      calculateEstimatedRelPer(){ //相對表現計算

        let score = this.estimatedRelPerObj.score;
        let BetweenPersons = this.estimatedRelPerObj.betweenPersons;
        let LowerThanPersons = this.estimatedRelPerObj.lowerThanPersons;
        let AllPersons = this.estimatedRelPerObj.allPersons;
        let min = parseInt(score);
        let max = parseInt(score)+1;
        let RelativePerformanceVal,MaxRelativePerformanceVal,MinRelativePerformanceVal = "";

        //計算相對表現
        RelativePerformanceVal = parseFloat(Math.round(((1-(score - min))*BetweenPersons+LowerThanPersons)/AllPersons*1000)/10).toFixed(1);

        MinRelativePerformanceVal = parseFloat(Math.round((BetweenPersons+LowerThanPersons)/AllPersons*1000)/10).toFixed(1);

        MaxRelativePerformanceVal = parseFloat(Math.round((LowerThanPersons)/AllPersons*1000)/10).toFixed(1);

        this.estimatedRelPerObj.relativePerformanceVal = RelativePerformanceVal;
        this.estimatedRelPerObj.minRelativePerformanceVal = MinRelativePerformanceVal;
        this.estimatedRelPerObj.maxRelativePerformanceVal = MaxRelativePerformanceVal;

        this.estimatedRelPerObj.showCalResultArea = true;
      }
    },
    watch:{      
      estimatedRelPerObj:{ //相對表現 最大 最小值
        handler(){
          if(this.estimatedRelPerObj.score !== ''){
            this.estimatedRelPerObj.min = parseInt(this.estimatedRelPerObj.score);
            this.estimatedRelPerObj.max = parseInt(this.estimatedRelPerObj.score)+1;
          }
        },
        deep:true,
      },
    },
    computed:{
      heightDifferenceVal(){ //高低差 val
        let scoreArr = this.differenceObj.scoreArr;
        scoreArr.sort((a,b) => {
          return a-b;
        });
        this.differenceObj.heightDifferenceVal = parseFloat(scoreArr[scoreArr.length -1]) - parseFloat(scoreArr[0]);

        return this.differenceObj.heightDifferenceVal;
      },
			heightDifferenceShowOnTable() { //差分結果(高低差)

          let difference = this.differenceObj;

          if(difference.heightDifferenceVal >= difference.heightDifferenceSet && difference.heightDifferenceSet !== ''){

            difference.heightDifferenceShowOnTable =  difference.scoreArr.join('、');
          }
          else difference.heightDifferenceShowOnTable ='分數皆低於設定值(或未設定)';

          return difference.heightDifferenceShowOnTable;
      },
      standardDeviationVal(){ //標準差 val

        let scoreArr = this.differenceObj.scoreArr;
				let standardDeviationVal = 0;
				
        this.differenceObj.scoreArr.forEach(item => {
          standardDeviationVal += Math.pow((Math.abs(parseFloat(item)- this.differenceObj.avgVal)),2);
				})
				
        this.differenceObj.standardDeviationVal =  parseFloat(Math.sqrt(standardDeviationVal/scoreArr.length).toFixed(10)); 

        return this.differenceObj.standardDeviationVal;       
      },
      standardDeviationShowOnTable(){ //差分結果(標準差)

        let difference = this.differenceObj;

        if(difference.standardDeviationVal >= difference.standardDeviationSet && difference.standardDeviationSet !== ''){
          difference.standardDeviationShowOnTable = difference.scoreArr.join('、');
        }
        else difference.standardDeviationShowOnTable = '分數皆低於設定值(或未設定)';

        return difference.standardDeviationShowOnTable;
      },
      avgVal(){//平均值(離均差) val
        let scoreArr = this.differenceObj.scoreArr;
        let totalVal = 0;
        scoreArr.forEach(item => {
          totalVal += parseFloat(item);
        });
        this.differenceObj.avgVal = parseFloat((Math.round(totalVal/scoreArr.length*10000000000)/10000000000).toFixed(10));;

        return this.differenceObj.avgVal;
      },
      avgRange(){ //離均差 範圍
        let difference =this.differenceObj
        return `(範圍: ${difference.avgVal - difference.avgSet} ~ ${difference.avgVal + difference.avgSet})`
      },
      avgShowOnTable(){ //差分結果(離均差)

        let difference = this.differenceObj;
        let count = 0;
        let max = parseFloat((difference.avgVal + parseInt(difference.avgSet)).toFixed(10));
        let min =  parseFloat((difference.avgVal - parseInt(difference.avgSet)).toFixed(10));

        if(difference.avgSet === '') difference.avgShowOnTable = '分數皆低於設定值(或未設定)';
        else{
          let avgShowArr = [];
          difference.scoreArr.forEach( item => {
            if(item >= max || item <= min){
              avgShowArr.push(item);
              ++count;
            }
          });

          difference.avgShowOnTable = count === 0 ? '分數皆低於設定值(或未設定)' : avgShowArr.join('、');
        }
        return difference.avgShowOnTable;
      },
    }
  });

  const emitter = mitt();

  app.component('select-score-unit',{ //總分計算 /  - 評分制 select
    data(){
      return {
		scoreUnit: 0,
		showScoreUnit: true,
      }
	  },
	created() { 
	  emitter.on('differenceMode', (differenceMode) => {
	    if (differenceMode === 1) this.showScoreUnit = true;
	    if(differenceMode === 3 || differenceMode === 2) this.showScoreUnit = false;
	  });  
	},
    methods:{
      showArea(){
        // this.test = true;
        emitter.emit('selectedMode',this.scoreUnit);
      }
    },
    template:
    `
      <div class="ScoreUnitMode content" v-if="showScoreUnit">
        <span>評分制: </span>
        <select name="ScoreUnitSel" id="ScoreUnit" class="select" v-model="scoreUnit" @click="showArea()">
          <option value="" disabled>請選擇...</option>
          <option :value="1">百分制</option>
          <option :value="2">配分制</option>
        </select>
      </div>
    `
  })

  app.component('weight-score',{
    data(){
      return {
        totalTestObj:{ //總分計算
          scoreUnit:'',
          scoreStr:'',
          weightStr:'',
          scoreArr:[],
          weightArr:[],
        },
        differenceObj:{ //差分檢測
        },
      }
    },
    props:['page','diffObj'],
    created(){
      emitter.on('selectedMode',(mode) => {

        if(this.page === 'isCalculateTotalPage'){
          this.totalTestObj.scoreUnit = mode;
          this.totalTestObj.showWeightArea = false;
          this.totalTestObj.showScoreArea = false;
        }
        else if(this.page === 'isDifferencePage'){
          this.differenceObj = this.diffObj;
          this.differenceObj.scoreUnit = mode;
          this.differenceObj.showWeightArea = false;
          this.differenceObj.showScoreArea = false;
        }  

				if (this.page === 'isCalculateTotalPage' && mode === 1) {
					this.totalTestObj.showWeightArea = true;
					this.totalTestObj.showScoreArea = true;
				}
				else if (this.page === 'isCalculateTotalPage' && mode === 2)
					this.totalTestObj.showScoreArea = true;
					
				else if (this.page === 'isDifferencePage' && this.differenceObj.differenceMode === 1 && mode === 1)
					this.differenceObj.showScoreArea = true;

				else if (this.page === 'isDifferencePage' && this.differenceObj.differenceMode === 1 && mode === 2) {
					this.differenceObj.showWeightArea = true;
					this.differenceObj.showScoreArea = true;
				}  
			})
			emitter.on('differenceMode', (differenceMode) => { 		  
				if (this.page === 'isDifferencePage' && (differenceMode === 3 || differenceMode === 2)) {
					this.differenceObj.showScoreArea = true;
					this.differenceObj.showWeightArea = false;
				}
			})
    },
    methods:{
      showTotalArea(){
        this.totalTestObj.isShowTotalArea = true;

        emitter.emit('showTotalArea',this.totalTestObj)
      },
      saveToArr(isWeight=false){ // 將輸入的分數存至scoreArr

        if(this.page === 'isDifferencePage')
          this.differenceObj.scoreArr = this.differenceObj.scoreStr.split(' ').filter(item => {
            return item !=='';
          });

        else if(this.showPage === 'isAdjustedScorePage')
			this.adjustedScoreObj.scoreArr = this.adjustedScoreObj.scoreStr.split(' ').filter(item=>{
			return item !== '';
			})
        
        else if(this.page === 'isDifferencePage' && !isWeight)
          this.totalTestObj.scoreArr = this.totalTestObj.scoreStr.split(' ').filter(item=>{
            return item !== '';
          })

        else if(this.page === 'isDifferencePage' && isWeight)
          this.totalTestObj.weightArr = this.totalTestObj.weightStr.split(' ').filter(item=>{
            return item !== '';
          })
      },
      calculateDifference(){ //差分計算

        //各面向差分 && 配分制 && 比重不為空值
        if(this.differenceObj.scoreUnit === 2 && this.differenceObj.differenceMode !== 2 && this.differenceObj.weightStr !== ''){
          let weight = this.differenceObj.weightStr;
          let tempArr = [];

          this.differenceObj.scoreArr.forEach((item,key) => {
            tempArr.push({
              score: parseFloat((parseFloat(item)/weight*100).toFixed(10)),
              originScore: parseInt(item)
            })
          });
          this.differenceObj.scoreWeightArr = tempArr;

          this.differenceObj.showChangeToScoreUnit1 = true; 
        }

		  	if(!this.differenceObj.showCalResult) this.differenceObj.showCalResult = true;

        emitter.emit('sendDifferenceData',this.differenceObj.scoreArr)
      },
    },
    template:
    `
      <div id='WeightArea' v-if="differenceObj.showWeightArea">
        <h3>請輸入該面向的配分比重</h3>
        <input type='number' v-model.number="differenceObj.weightStr" max='100' min='1' id="keyWeight">
      </div>

      <div id="ScoreArea" v-if="differenceObj.showScoreArea">
        <h3>請輸入各面向(總分)分數</h3>
        <textarea rows='2' v-model.lazy="differenceObj.scoreStr" @change="saveToArr" id="keyScoreDiv" class="keyArea" placeholder="請輸入分數(以空格隔開)(精準度至小數點後10位)"></textarea>
        <button class="button calculateScoreBtn" @click="calculateDifference">計算</button>
      </div>

      <div v-if="differenceObj.showChangeToScoreUnit1">
      <h4>分數轉換(配分轉百分)</h4>
      <div>
        <ul>
          <li v-for="(item,key) in this.differenceObj.scoreWeightArr">
            原分數: {{item.originScore}} / 換算後: {{item.score}}
          </li>
        </ul>
      </div>
    </div>

      <div id="EachWeightArea" class="area" v-if="totalTestObj.showWeightArea">
          <h3>請依序輸入各面向配分比重</h3>
          <textarea v-model.lazy="totalTestObj.weightStr" @change="saveToArr(true)" name="EachWeight" id="EachWeight" class="keyArea" cols="30" rows="2" placeholder="分數請以空格隔開"></textarea>
      </div>
    
      <div id="EachScoreArea" class="area" v-if="totalTestObj.showScoreArea">
        <h3>請依序輸入各面向分數</h3>
        <textarea v-model.lazy="totalTestObj.scoreStr" @change="saveToArr(false)" name="EachScore" id="EachScore" class="keyArea"  cols="30" rows="5" placeholder="請依照上方欄位的配分比重順序輸入分數(以空格隔開)"></textarea>
        <button class="button calculateScoreBtn" @click="showTotalArea">計算</button> 
      </div>
    `
  })
  
  app.component('total-area',{

    data(){
      return {
        totalTestObj:{},
        total: 0
      }
    },
    created(){
      emitter.on('showTotalArea',(data) => {
        this.totalTestObj = data;

        let total = 0;
        if(this.totalTestObj.scoreUnit === 1){
          this.totalTestObj.scoreArr.forEach((item,key) => {
            total += parseFloat(item)*parseFloat(this.totalTestObj.weightArr[key])/100;
          })
          total = parseFloat(Math.round(total*100)/100);
        }
        else if(this.totalTestObj.scoreUnit === 2)
          this.totalTestObj.scoreArr.forEach(item =>{
            total += parseInt(item);
          });

        this.total = total;
      })
    },
    template: 
    `
      <div id="TotalResultArea" class="area" v-if="totalTestObj.isShowTotalArea">
        <h3>總分 - 計算結果 :</h3>
        <h4>{{total}}</h4>
      </div>
    `
  })

  app.mount('#app');
})