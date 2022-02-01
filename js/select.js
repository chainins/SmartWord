/*!
 *
 * Copyright 2022 Chengpi Wu
 * Released under the MIT license
 * https://go4do.com/
 *
 * Date: Jan 31 2022 09:12:53 GMT-0500 (Eastern Standard Time)
 */

// select and share
function getBodyText(win) {
    var doc = win.document, body = doc.body, selection, range, bodyText;
    if (body.createTextRange) {
        return body.createTextRange().text;
    } else if (win.getSelection) {
        selection = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(body);
        selection.addRange(range);
        bodyText = selection.toString();
        selection.removeAllRanges();
        return bodyText;
    }
}

function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
				var txt = document.createElement("span");
				txt.innerHTML = node.textContent.replace(pattern, replacement) ;
				node.replaceWith(txt);
              
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}


function forwardRequest(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (!response) return reject(chrome.runtime.lastError)
      return resolve(response)
    })
  })
}


window.onload=function(){
	var bodyText = getBodyText(window) ; 
	chrome.runtime.sendMessage({
        action:"addnote",
 		article:bodyText 
		}, function(response) {
		for(var i = 0; i < response.length; i++) {
			var obj = response[i];
			oldTxt = ' ' + obj.oldTxt.toLowerCase() + ' ';
			var regExOrig = new RegExp(oldTxt, "ig");  
			var fontSize = parseFloat(window.getComputedStyle(document.getElementsByTagName("body")[0], null).getPropertyValue('font-size'));
            var displayInfo = '[' + obj.phonetic + ']' + obj.newTxt ; // obj.newTxt2.replaceAll('|||',' ');// obj.newTxt +
			var replaceTxt = '<span style="color:red;font-size:'+ Math.max(parseInt(fontSize *1.25),20).toString() + 'px"><ruby><rb>$&</rb><rt>'+  displayInfo +'</rt></ruby></span>';
			replaceInText(document.getElementsByTagName("body")[0],regExOrig,replaceTxt);
		}
	});
}

var preWord = "";

var isAlpha = function(str){return /[a-zA-Z']+/.test(str)};
// Check current character is english char.

document.onmousemove = function(event){
    if (event.shiftKey || event.altKey){ 
        var showDiv = document.getElementById("popupArea");
        if(showDiv)
        {
            showDiv.parentNode.removeChild(showDiv);
        }
        return true;
    }

    if (!event.ctrlKey){
        return true;
    }
    //if control key isn't clicked, return

    var r = document.caretRangeFromPoint(event.clientX, event.clientY); //deprecated.

    if (!r) return true;
    var pX = event.pageX;
    var pY = event.pageY;

    var so = r.startOffset;
    var eo = r.endOffset;
    var tr = r.cloneRange();

    var width = 0, height = 0;
    if (tr.getBoundingClientRect) {
        var rect = tr.getBoundingClientRect();
        width = rect.right - rect.left;
        height = rect.bottom - rect.top;
    }

    var text='';

    if (r.startContainer.data) while (so >= 1){
        tr.setStart(r.startContainer, --so);
        text = tr.toString();
        if (!isAlpha(text.charAt(0))){
            tr.setStart(r.startContainer, so + 1);
            break;
        }
    }

    if (r.endContainer.data) while (eo < r.endContainer.data.length){
        tr.setEnd(r.endContainer, ++eo);
        text = tr.toString();
        if (!isAlpha(text.charAt(text.length - 1))){
            tr.setEnd(r.endContainer, eo - 1);
            break;
        }
    }

    var word = tr.toString();
    if(!word.length) return;
    var selectedObject = window.getSelection();
    selectedObject.removeAllRanges();
    selectedObject.addRange(tr);
    if(preWord == word) return;
    preWord = word;

    if (chrome.runtime?.id) {
        chrome.runtime.sendMessage({
            action:"lookup",
            article:word 
        }, function(response) {
                var showDiv = document.getElementById("popupArea");
            
                popupArea.id = "popupArea";
                popupArea.style.position = "absolute";
                popupArea.style.overflowY = "scroll";
                popupArea.style.backgroundColor = '#3FFFFF';
                popupArea.style.top = "20px";
                popupArea.style.left = "20px";
                popupArea.style.width = "300px";
                popupArea.style.height = "210px";
                popupArea.style.zIndex = "9999";
                popupArea.style.borderRadius = "8px";
                popupArea.style.margin = "10px 15px 10px 15px";
                popupArea.style.padding = "10px";
                popupArea.style.border = "thick solid #20A0AF";
                popupArea.style.left = event.clientX + width + 5 +"px";
                popupArea.style.top = event.clientY + height + 5 +"px";
                var obj = response[0];
                var cn_note = ' ' + obj.newTxt.toLowerCase() + ' ';
                if(obj.word){
                    word =  obj.word.toLowerCase() +  '  [' + obj.phonetic + ']';
                }else{
                    word = word + '  [' + obj.phonetic + ']' ;
                }
                if (obj.newTxt.toLowerCase() == -1){ // only one meaning.
                    var en_note = ' ' + obj.newTxt.toLowerCase().replaceAll('|||',' ').substr(2) + ' ';                  
                }else{
                    var en_note = ' ' + obj.newTxt.toLowerCase().replaceAll('|||',' ') + ' ';
                }
                popupArea.innerHTML = '<span style="font-family:Helvetica; color:#000060;font-size:18px;">'+ word  +'</span><br>'+ cn_note + '<br>'+ en_note + '<br>';
                popupArea.style.height = ((Math.round(cn_note.length) + Math.round(en_note.length))*10 + 60).toString() +  "px";
                document.body.appendChild(popupArea);    
        });
    }else{
        return true;
    }
}