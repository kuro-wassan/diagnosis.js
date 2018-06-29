window.onload = function(){
  //入力画面だった場合
  if(!location.href.match(/result\.html/)) {

    //リロードでローカルストレージを削除
    window.localStorage.clear();

    var form       = document.getElementById('diagnoseform'),
        inputPlace = form.place,
        inputLevel = form.level,
        inputOption = form.option;

    //placeの項目が入力されたとき
    var eachPlace = Array.prototype.forEach;
    eachPlace.call(inputPlace, function(that) {
      //イベントリスナを登録
      that.onclick = function() {
        var answerPlace = [];

        //選択したのが、0だった場合
        if(that = inputPlace[0]) {
          if(that.checked ){
            //ローカルストレージに保存する項目を設定
            answerPlace.push("0");
            //他の項目を選択不可にする
            for(var i=1;i<inputPlace.length; i++){
              inputPlace[i].disabled = true;
              inputPlace[i].checked = false;
            }
          }else{
            //ローカルストレージに保存する項目を設定
            for(var i=0;i<inputPlace.length; i++){
              if(inputPlace[i].checked) {
                answerPlace.push(inputPlace[i].value);
              }
            }
            //他の項目の選択を可にする。
            for(var i=0;i<inputPlace.length; i++){
              inputPlace[i].disabled = false;
            }
          }
        //選択したのが、0以外だった場合
        }else{
          //ローカルストレージに保存する項目を設定
          for(var i=0;i<inputPlace.length; i++){
            if(inputPlace[i].checked) {
              answerPlace.push(inputPlace[i].value);
            }
          }
        }

        //データをローカルストレージに保存
        window.localStorage.setItem('answerPlace',answerPlace);
        next_check();
      };
    });

    //Levelの項目が入力されたとき
    var eachLevel = Array.prototype.forEach;
    eachLevel.call(inputLevel, function(that) {
        //イベントリスナを登録
        that.onclick = function() {
          var answerLevel = "";
          for(var i=0;i<inputLevel.length; i++){
            if(inputLevel[i].checked) {
              answerLevel = inputLevel[i].value;
              break;
            }
          }
          //データをローカルストレージに保存
          window.localStorage.setItem('answerLevel',answerLevel);
          next_check();
          //console.log(answerLevel);
        };
    });

    //Optionの項目が入力されたとき
    var eachOption = Array.prototype.forEach;
    eachOption.call(inputOption, function(that) {
      //イベントリスナを登録
      that.onclick = function() {
        var answerOption = [];

        //選択したのが、0だった場合
        if(that = inputOption[0]) {
          if(that.checked ){
            //ローカルストレージに保存する項目を設定
            answerOption.push("0");
            //他の項目を選択不可にする
            for(var i=1;i<inputOption.length; i++){
              inputOption[i].disabled = true;
              inputOption[i].checked = false;
            }
          }else{
            //ローカルストレージに保存する項目を設定
            for(var i=0;i<inputOption.length; i++){
              if(inputOption[i].checked) {
                answerOption.push(inputOption[i].value);
              }
            }
            //他の項目の選択を可にする。
            for(var i=0;i<inputOption.length; i++){
              inputOption[i].disabled = false;
            }
          }
        //選択したのが、0以外だった場合
        }else{
          //ローカルストレージに保存する項目を設定
          for(var i=0;i<inputOption.length; i++){
            if(inputOption[i].checked) {
              answerOption.push(inputOption[i].value);
            }
          }
        }

        //データをローカルストレージに保存
        window.localStorage.setItem('answerOption',answerOption);
        next_check();
      };
    });

  //結果表示画面だった場合
  }else{
  //結果反映
    showResult();
  }
}

//結果ボタン表示制御
var next_check = function(){
  var step1 = window.localStorage.getItem('answerPlace') || "",
      step2 = window.localStorage.getItem('answerLevel') || "",
      step3 = window.localStorage.getItem('answerOption') || "",
      btn_submit = document.getElementById('btn_submit');

  if(!step1 || !step2 || !step3) {
    btn_submit.disabled = true;
  }else {
    btn_submit.disabled = false;
  }
}

var showResult = function(){
  var place = window.localStorage.getItem('answerPlace') || "",
      level = window.localStorage.getItem('answerLevel') || "",
      option = window.localStorage.getItem('answerOption') || "";
  place = place.split(/\,/);
  option = option.split(/\,/);

  //選択した条件を表示
  var answerPlace ="";
  for(var i=0;i<place.length;i++){
    answerPlace += answer["place"][place[i]] + ',';
  }
  document.getElementById('answer_place').textContent = answerPlace;

  var answerLevel = answer["level"][level];
  document.getElementById('answer_level').textContent = answerLevel;

  var answerOption ="";
  for(var i=0;i<option.length;i++){
    answerOption += answer["option"][option[i]] + ',';
  }
  document.getElementById('answer_option').textContent = answerOption;


  //診断結果を表示
  var resultHtml = "",
      countFlg = 0;
  for( var p in result ){
    var place_flg = 0,
        level_flg = 0,
        option_flg = 0;

    //placeの配列の中の項目と一つでもマッチすればOK
    for(var n of result[p]["place"]){
      for(var i of place){
        if(n === i) {
          place_flg++;
          break;
        }
      }
    }

    //levelの配列の中の項目と一つでもマッチすればOK
    for(var n of result[p]["level"]){
      if(n === level) {
        level_flg++;
        break;
      }
    }

    //optionの配列の中の項目と一つでもマッチすればOK
    for(var n of result[p]["option"]){
      for(var i of option){
        if(n === i) {
          option_flg++;
          break;
        }
      }
    }

    //全ての条件でマッチしていれば、情報を表示
    if( place_flg && level_flg && option_flg ){
      resultHtml +=
      `   <li>
            <h3>${result[p]["name"]}</h3>
            <p>場所：<span>${result[p]["address"]}</span></p>
            <p>所要時間：${result[p]["time"]}</p>
            <p>標高：${result[p]["height"]}</p>
            <p>${result[p]["text"]}</p>
          </li>`;
      countFlg++;
    }
  }
  document.getElementById('result_count').innerHTML = `${countFlg}件ヒットしました`;
  document.getElementById('result').innerHTML = resultHtml;
}




//表示結果
var answer = {
  "place" : {
    "0": "決めていない",
    "1": "東京都",
    "2": "神奈川県",
    "3": "千葉県",
    "4": "埼玉県",
  },
  "level" : {
    "0": "★",
    "1": "★★",
    "2": "★★★",
    "3": "★★★★",
    "4": "★★★★★",
  },
  "option" : {
    "0": "特になし",
    "1": "温泉に入りたい。",
    "2": "子供と一緒に上りたい。",
    "3": "頂上に食堂がある。",
    "4": "電車で行ける。",
  },
}

var result = [
  {
    "no": "1",
    "name": "A山",
    "place": [
      "1","0"
    ],
    "level": "0",
    "option": [
      "1","2","3","4","0"
    ],
    "text": "都心からのアクセスがしやすく日帰りで十分に楽しめます。",
    "time": "1時間45分～6時間5分",
    "address": "東京都",
    "height": "599m"
  },
  {
    "no": "2",
    "name": "B山",
    "place": [
      "2","0"
    ],
    "level": "2",
    "option": [
      "1","2","3","4","0"
    ],
    "text": "神奈川県のB山は紅葉シーズン、初詣で人気です。",
    "time": "約4時間",
    "address": "千葉県",
    "height": "1,252m"
  },
  {
    "no": "3",
    "name": "C山",
    "place": [
      "2","0"
    ],
    "level": "1",
    "option": [
      "1","2","3","4","0"
    ],
    "text": "C山は神奈川県と静岡県の県境にあります。アクセスが良く登山初心者におすすめです。",
    "time": "約4時間",
    "address": "神奈川県・静岡県",
    "height": "1,212m"
  },
  {
    "no": "4",
    "name": "D山",
    "place": [
      "1","0"
    ],
    "level": "1",
    "option": [
      "1","2","4","0"
    ],
    "text": "D山は古くより山岳信仰の対象となる山です。",
    "time": "1時間20分～",
    "address": "埼玉県",
    "height": "929m"
  }
];