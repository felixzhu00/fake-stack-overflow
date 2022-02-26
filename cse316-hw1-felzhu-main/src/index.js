import Model from './model.js';

window.onload = function() {
  const model = new Model();
  let g;

  function generateOne(p2){
    const element = document.getElementById("display");


    var tr = document.createElement("tr");
    
    var td = document.createElement("td");
    td.className = "e1"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var num = document.createTextNode(p2.views);

    li.appendChild(num);
    ul.appendChild(li);

    var li = document.createElement("li");
    var num = document.createTextNode(p2.answers.length);

    li.appendChild(num);
    ul.appendChild(li);

    td.appendChild(ul);
    tr.appendChild(td);


    var td = document.createElement("td");
    td.className = "e2"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var num = document.createTextNode("Views");

    li.appendChild(num);
    ul.appendChild(li);

    var li = document.createElement("li");
    var num = document.createTextNode("Answers");

    li.appendChild(num);
    ul.appendChild(li);

    td.appendChild(ul);
    tr.appendChild(td);

    var td = document.createElement("td");
    td.className = "e3"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var a = document.createElement("a");

    a.className = "link"
    var w = document.createTextNode(p2.title);
    a.onclick = function (){
      p2["views"] = p2.views + 1
      document.getElementById("display").innerHTML = ""
      loadA(p2)
      g = p2
      
    }
    a.appendChild(w);
    li.appendChild(a);
    ul.appendChild(li);
    //
    var tags = p2.tagIds 
    var tags2 = model.data.tags 

    for(let i = 0; i < tags.length; i++){   
      
      if(i%4 == 0 && i != 0){
        ul.appendChild(li);
      }
      if(i%4 == 0){
        var li = document.createElement("li");
        li.className = "tags"
      }
        var found = tags2.find(element => element.tid == tags[i])
        var a = document.createElement("span");
        var w1 = document.createTextNode(found.name);
        a.appendChild(w1)
        li.appendChild(a)      
    }
    ul.appendChild(li);

    td.appendChild(ul);
    tr.appendChild(td);
    ///
    var td = document.createElement("td");
    td.className = "e4"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "by"
    var num = document.createTextNode(p2.askedBy);
    var w = document.createTextNode("Asked By ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);

    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "on"
    var num = document.createTextNode(p2.askedOn);
    var w = document.createTextNode("On ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);
    
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "at"
    var num = document.createTextNode(p2.askedAt);
    var w = document.createTextNode("At ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);

    td.appendChild(ul);
    tr.appendChild(td);
    element.appendChild(tr);
    
  }
  function generateEvery(p2, order){
    for(let i = 0; i< order.length; i++){
      var o = order[i].qid
      o = o.substring(1)
      generateOne(p2.data.questions[parseInt(o) - 1])
    }
  }
  function postQuestion(){
  var form = document.getElementById("form")
  form.addEventListener("submit", e => {
      var q1 = document.getElementById("q1")
      var q2 = document.getElementById("q2")
      var q3 = document.getElementById("q3")
      var q4 = document.getElementById("q4")
      
      var form = document.getElementById("form")
      var ask = document.getElementsByClassName("askquestions")
      let messages = []
      var error = document.getElementById("error")
      error.innerHTML = ""

      if(q1.value.length == 0){
        messages.push("Question title cannot be empty!")
      }
      if(q2.value.length == 0){
        messages.push("Question text cannot be empty!")
      }
      if(q3.value.length == 0){
        messages.push("Tags cannot be empty!")
      }
      if(q4.value.length == 0){
        messages.push("Username cannot be empty!")
      }
      if(q1.value.length > 100){
        messages.push("Question title cannot be more than 100 characters!")
      }
      if(q4.value.length > 15){
        messages.push("Username cannot be more than 15 characters!")
      }
      if(messages.length > 0){
        e.preventDefault()
        for(let i = 0; i< messages.length; i++){
          var p = document.createElement("p")
          var m = document.createTextNode(messages[i])
          p.appendChild(m)
          error.appendChild(p)
        }
      }else{
        e.preventDefault()
        var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
        var today = new Date();
        var mon = months[today.getMonth()]
        var day = String(today.getDate()).padStart(2, '0')
        var year = today.getFullYear()

        var pretags = q3.value.split(/[ ,]+/)
        var posttag = []

        var container = []
        for(let j = 0; j < model.data.tags.length; j++){
          container.push(model.data.tags[j].name)
        }

        for(let i = 0; i < pretags.length; i++){
          if(container.includes(pretags[i])){
            posttag.push("t" + (container.indexOf(pretags[i])+ 1))
          }else{
            let tag = {
              tid: "t" + (model.data.tags.length + 1),
              name: pretags[i]
            }
            posttag.push(tag.tid)
            model.data.tags.push(tag)
          }
        }
        
        let question = {
          qid: "q" + (model.data.questions.length + 1),
          title: q1.value,
          text: q2.value,
          tagIds: posttag,
          askedBy: q4.value,
          askedOn: mon + " " + day + ", " + year,
          askedAt: String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0'),
          answers:[],
          views:0
        }

        model.data.questions.push(question)
        document.getElementById("display").innerHTML = ""
        document.getElementById("display").style.display = "table"
        document.getElementById("askquestions").style.display = "none"
        document.getElementById("questions").className = "active"
        form.reset()
        load()
      }
      
      
    })
  }
  function hideAndR(){
    document.getElementById("display").style.display = "none"
    document.getElementById("askquestions").style.display = "block"
    var error = document.getElementById("error")
    error.innerHTML = ""
    postQuestion()
  }
  function createRoll(){
    const element = document.getElementById("display");

    var tr = document.createElement("tr");
    tr.className = "h"

    var th = document.createElement("th");
    th.className = "h1", th.id = "h1", th.colSpan = "2"
    var num = document.createTextNode("N Questions");
    th.appendChild(num)
    tr.appendChild(th)

    var th = document.createElement("th");
    th.className = "h2", th.id = "h2"
    var num = document.createTextNode("All Questions");
    th.appendChild(num)
    tr.appendChild(th)

    var th = document.createElement("th");
    th.className = "h3"
    var button = document.createElement("button");
    button.className = "ask", button.id = "ask"
    var num = document.createTextNode("Ask a Question");
    button.appendChild(num)
    th.appendChild(button)
    tr.appendChild(th)
    element.appendChild(tr);
    var butt = document.getElementById("ask")
    butt.style.display = "inline-block"
    butt.addEventListener("click", function(){
      hideAndR()
      if(document.getElementById("questions") != null){document.getElementById("questions").className = ""}
      if(document.getElementById("tags") != null){document.getElementById("tags").className = ""}})
      
  }
  function load(){
    createRoll()
    var list = []
    for(let i = 0; i < model.data.questions.length;i++){
      list.push(model.data.questions[i].qid)
    }
    generateEvery(model, getOrder(list))
    document.getElementById("h1").innerHTML = list.length + " Questions"
  }
  function loadA(q){
    if(document.getElementById("questions") != null){document.getElementById("questions").className = ""}
    if(document.getElementById("tags") != null){document.getElementById("tags").className = ""}
    generateA(q)
    generateAOnStart(q)
    var list = []
    for(let i = 0; i < q.answers.length;i++){
      list.push(q.answers[i])
    }
    generateEveryA(getOrderA(list))
    generateAButton()
}
  function getOrder(result){
    const newModel = []

    for(let i = 0; i < result.length; i++){      
      var found = model.data.questions.find(element => element.qid == result[i])
      let dictionary = {
        qid:result[i],
        date:new Date(found.askedOn + " " + found.askedAt)
      }
      newModel.push(dictionary)
    }

    return newModel.slice().sort((a,b) => b.date - a.date)
  }
  function getOrderA(result){
    const newModel = []
    for(let i = 0; i < result.length; i++){     
      var found = model.data.answers.find(element => element.aid == result[i])
      let dictionary = {
        aid:result[i],
        date:new Date(found.ansOn + " " + found.ansAt)
      }
      newModel.push(dictionary)
    }
    return newModel.slice().sort((a,b) => b.date - a.date)
  }
  function search(){
    
    document.getElementById("questions").className = ""
    var enter = document.getElementById("enter").value
    var order= searchText(enter)
    
    document.getElementById("display").innerHTML = ""
    document.getElementById("enter").value = ""
    
    document.getElementById("display").style.display = "table"
    document.getElementById("askquestions").style.display = "none"

    createRoll()
    document.getElementById("h1").innerHTML = order.length + " Questions"
    if(order.length == 0){
      document.getElementById("h2").innerHTML = "No Questions Found"
    }else{
      document.getElementById("h2").innerHTML = "Search Results"
      generateEvery(model, getOrder(order))
    }

  }
  function searchText(input){
    var result =[]
    var words = input.split(/[ ]+/)

    for(let i = 0; i < words.length; i++){
      if(words[i].charAt(0) == "[" && words[i].charAt(words[i].length-1) == "]"){
        //tag
        var tag = words[i].substring(1,words[i].length-1).toLowerCase()
        var searchtag = []
        
        for(let j = 0; j < model.data.tags.length; j++){ 
          if(model.data.tags[j].name == tag){
            searchtag.push(model.data.tags[j].tid)
          }
        }  

        for(let j = 0; j < model.data.questions.length; j++){
          if(model.data.questions[j].tagIds.includes(searchtag[0]) && !(result.includes(model.data.questions[j].qid))){
            result.push(model.data.questions[j].qid)
          }
        }

      }else{
        //text
        for(let j = 0; j < model.data.questions.length; j++){
          if((model.data.questions[j].title.slice().split(/[ ]+/).includes(words[i]) || model.data.questions[j].text.slice().split(/[ ]+/).includes(words[i])) && !(result.includes(model.data.questions[j].qid))){
            result.push(model.data.questions[j].qid)
          }
        }
      }
    }
    return result
    
  }
  
  function generateEveryA(order){
    for(let i = 0; i< order.length; i++){
      var o = order[i].aid
      o = o.substring(1)
      generateAOne(model.data.answers[parseInt(o) - 1])
    }
    
  }
  function generateAOnStart(q){

    const element = document.getElementById("display");


    var tr = document.createElement("tr");
    
    var td = document.createElement("td");
    td.className = "e2"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    li.className = "aviews"
    var num = document.createTextNode(q.views + " Views");

    li.appendChild(num);
    ul.appendChild(li);
    td.appendChild(ul);
    tr.appendChild(td);

    var td = document.createElement("td");
    td.className = "e3"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var w = document.createTextNode(q.text);
    
    li.appendChild(w);
    ul.appendChild(li);
    td.appendChild(ul);
    tr.appendChild(td);
    
    var td = document.createElement("td");
    td.className = "e4"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "by"
    var num = document.createTextNode(q.askedBy);
    var w = document.createTextNode("Asked By ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);

    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "on"
    var num = document.createTextNode(q.askedOn);
    var w = document.createTextNode("On ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);
    
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "at"
    var num = document.createTextNode(q.askedAt);
    var w = document.createTextNode("At ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);

    td.appendChild(ul);
    tr.appendChild(td);
    element.appendChild(tr);
  }

  function generateA(q){
    const element = document.getElementById("display");

    var tr = document.createElement("tr");
    tr.className = "h"

    var th = document.createElement("th");
    th.className = "h1", th.id = "heading"
    var num = document.createTextNode(q.answers.length + " Answers");
    th.appendChild(num)
    tr.appendChild(th)

    var th = document.createElement("th");
    th.className = "h2", th.id = "heading"
    var num = document.createTextNode(q.title);
    th.appendChild(num)
    tr.appendChild(th)

    var th = document.createElement("th");
    th.className = "h3"
    var button = document.createElement("button");
    button.className = "ask", button.id = "ask"
    var num = document.createTextNode("Ask a Question");
    button.appendChild(num)
    th.appendChild(button)
    tr.appendChild(th)
    element.appendChild(tr);
    var butt = document.getElementById("ask")
    butt.addEventListener("click", function(){
      hideAndR()
      if(document.getElementById("questions") != null){document.getElementById("questions").className = ""}
      if(document.getElementById("tags") != null){document.getElementById("tags").className = ""}})
  }
  function generateAOne(a){
    const element = document.getElementById("display");


    var tr = document.createElement("tr");

    var td = document.createElement("td");
    td.className = "e3", td.colSpan = "2"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var w = document.createTextNode(a.text);

    
    li.appendChild(w);
    ul.appendChild(li);
    td.appendChild(ul);
    tr.appendChild(td);
    
    var td = document.createElement("td");
    td.className = "e4"
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "by"
    var num = document.createTextNode(a.ansBy);
    var w = document.createTextNode("Ans By ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);

    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "on"
    var num = document.createTextNode(a.ansOn);
    var w = document.createTextNode("On ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);
    
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.className = "at"
    var num = document.createTextNode(a.ansAt);
    var w = document.createTextNode("At ");

    li.appendChild(w)
    span.appendChild(num)
    li.appendChild(span);
    ul.appendChild(li);

    td.appendChild(ul);
    tr.appendChild(td);
    element.appendChild(tr);
  }
  function gotoQ(){
    document.getElementById("display").innerHTML = ""
    load()
    document.getElementById("display").style.display = "table"
    document.getElementById("askquestions").style.display = "none"
    document.getElementById("postanswer").style.display = "none"

  }
  function generateAButton(){
    const element = document.getElementById("display");

    var container = document.createElement("td")
    container.colSpan = "3"
    var button = document.createElement("button");
    button.className = "Aask", button.id = "Aask"
    var num = document.createTextNode("Answer Question");
    button.addEventListener("click", function(){
      console.log()
      hideAndRA()
      if(document.getElementById("questions") != null){document.getElementById("questions").className = ""}
      if(document.getElementById("tags") != null){document.getElementById("tags").className = ""}
    })

    button.appendChild(num)
    container.appendChild(button)
    element.appendChild(container)

  }
  function hideAndRA(){
    document.getElementById("display").innerHTML = ""
    document.getElementById("display").style.display = "none"
    document.getElementById("postanswer").style.display = "block"
    var error = document.getElementById("erroranswer")
    error.innerHTML = ""
    postAnswer()
  }
  function postAnswer(){
    var form = document.getElementById("form2")
    form.addEventListener("submit", e => {
      var a1 = document.getElementById("a1")
      var a2 = document.getElementById("a2")
      var ask = document.getElementsByClassName("postanswer")
      let messages = []
      var error = document.getElementById("erroranswer")
      error.innerHTML = ""

      if(a1.value.length == 0){
        messages.push("Answer Text cannot be empty!")
      }
      if(a2.value.length == 0){
        messages.push("Username cannot be empty!")
      }
      if(a2.value.length > 15){
        messages.push("Username cannot be more than 15 characters!")
      }
      if(messages.length > 0){
        e.preventDefault()
        for(let i = 0; i< messages.length; i++){
          var p = document.createElement("p")
          var m = document.createTextNode(messages[i])
          p.appendChild(m)
          error.appendChild(p)
        }
      }else{
        e.preventDefault()
        var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
        var today = new Date();
        var mon = months[today.getMonth()]
        var day = String(today.getDate()).padStart(2, '0')
        var year = today.getFullYear()

        let answers = {
          aid: "a" + (model.data.answers.length + 1),
          text: a1.value,
          ansBy: a2.value,
          ansOn: mon + " " + day + ", " + year,
          ansAt: String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0'),
        }
        
        model.data.answers.push(answers)
        g.answers.push(answers.aid)
        document.getElementById("display").innerHTML = ""
        document.getElementById("display").style.display = "table"
        document.getElementById("postanswer").style.display = "none"
        form.reset()
        loadA(g)
      }
    })
  }

  function gotoT(){
    document.getElementById("display").innerHTML = ""
    loadT()
    document.getElementById("display").style.display = "table"
    document.getElementById("askquestions").style.display = "none"
    document.getElementById("postanswer").style.display = "none"
  }
  function loadT(){
    createRoll()
    document.getElementById("h1").innerHTML = model.data.tags.length + " Tags"
    document.getElementById("h2").innerHTML = "All Tags"

    let allTags = {
      tags:[
      ]
    }

    var listOfTags = []
    for(let i = 0; i < model.data.tags.length; i++){
      listOfTags.push(model.data.tags[i].tid)
    }
    for(let i = 0; i < listOfTags.length; i++){
      var temparr = []
      for(let j = 0; j < model.data.questions.length; j++){
        if(model.data.questions[j].tagIds.includes(listOfTags[i])){
          temparr.push(model.data.questions[j].qid)
        }
      }
      let dictionary = {
        tid:listOfTags[i],
        qid:temparr
      }
      allTags.tags.push(dictionary)
    }
    generateTags(allTags)

  }
  function generateTags(tagList){
    const element = document.getElementById("display");

    for(let i = 0; i< tagList.tags.length; i++){
      if(i%3 == 0 && i !=0){
        element.appendChild(tr);
      }
      if(i%3 == 0){
        var tr = document.createElement("tr");
        tr.className = "area"
        var td = document.createElement("td");
        td.className = "itemCont", td.colSpan = "4"
        tr.appendChild(td);
      }

      var found = model.data.tags.find(element => element.tid == tagList.tags[i].tid)

      var tagid = document.createTextNode(found.name);
      var qesid = document.createTextNode(tagList.tags[i].qid.length + " questions");

      const a = document.createElement("a");
      a.href = "#" ,a.className = found.name

      a.onclick = function (){
        document.getElementById("display").innerHTML = ""
        searchTerm("[" + this.className + "]")
        if(document.getElementById("questions") != null){document.getElementById("questions").className = ""}
        if(document.getElementById("tags") != null){document.getElementById("tags").className = ""}
      }

      var span = document.createElement("span");
      var div = document.createElement("div");
      div.className = "containers"

      a.appendChild(tagid)
      span.appendChild(qesid)

      div.appendChild(a), div.appendChild(span)
      td.appendChild(div)
      
    }
    
    element.appendChild(tr);
    
  }

  function searchTerm(t){

    var order = searchText(t)
    
    document.getElementById("display").innerHTML = ""
    document.getElementById("enter").value = ""
    
    document.getElementById("display").style.display = "table"
    document.getElementById("askquestions").style.display = "none"
    document.getElementById("postanswer").style.display = "none"

    createRoll()
    document.getElementById("h1").innerHTML = order.length + " Questions"
    if(order.length == 0){
      document.getElementById("h2").innerHTML = "No Questions Found"
    }else{
      document.getElementById("h2").innerHTML = "Questions Tagged " + t
      generateEvery(model, getOrder(order))
    }
  }

  load()
  var Q = document.getElementById("questions")
  Q.addEventListener("click", function(){
    Q.className = "active"
    T.className = ""
    gotoQ()
  })
  var T = document.getElementById("tags")
  T.addEventListener("click", function(){
    T.className = "active"
    Q.className = ""
    gotoT()
  })

  var enter = document.getElementById("enter")
  enter.addEventListener("keyup", function(event){
    if(event.code === "Enter"){
      search()
    }
  })
































  // write relevant code.
};
