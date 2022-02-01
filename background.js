/*!
 *
 * Copyright 2022 Chengpi Wu
 * Released under the MIT license
 * https://go4do.com/
 *
 * Date: Jan 31 2022 09:12:53 GMT-0500 (Eastern Standard Time)
 */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	async function postData2(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		"Access-Control-Allow-Origin" : "*", 
		"Access-Control-Allow-Credentials" : true 
		},
		body: JSON.stringify(data) 
	});
	return response.json(); 
	}

	async function postData(url = '') {
	const response = await fetch(url, {
		method: 'POST',
	});
	return response.json(); 
	}

	chrome.cookies.getAll({domain: "go4do.com"}, function(cookies) {
		var email;
		var pwd;
		for(var i=0; i<cookies.length;i++) {
			if(cookies[i].name === "email") {
				email = cookies[i].value;
			}
			if(cookies[i].name === "password") {
				pwd = cookies[i].value;
			}
		}
		postData( 'https://go4do.com/smartword/info.php?email=' + email + '&pwd=' + pwd )
		.then((data)=>{

				if (JSON.parse(JSON.stringify(request)).action == 'addnote')
				{
					if(data.di){
						var didata = data.di;
					}else{
						var didata = 70;
					}
					postData2('https://go4do.com/smartword/gettxt.php', {di: didata, article: encodeURIComponent(JSON.parse(JSON.stringify(request)).article)})
					.then((codeTourContent) => sendResponse(codeTourContent));

				}
				else if (JSON.parse(JSON.stringify(request)).action == 'lookup'){
					postData2('https://go4do.com/smartword/getword.php', {word: encodeURIComponent(JSON.parse(JSON.stringify(request)).article)})
					.then((codeTourContent) => sendResponse(codeTourContent));
				}
			}
		);

	});


	return true
})
