
/*!
 *
 * Copyright 2022 Chengpi Wu
 * Released under the MIT license
 * https://go4do.com/
 *
 * Date: Jan 31 2022 09:12:53 GMT-0500 (Eastern Standard Time)
 */


//////////////////////////////////////////////////////

// slider show tips.
var rawWordList = [
	["tren coppin callosum echidna suffocate burro ditty footman spinifex shredding"],
	["tetragrammaton imitator parotid dank viner aldol crowfoot triplex carder predispose"],
	["discontinuance malleus pion dur roundhead coralline pondweed territorially signora skyward"],
	["snarl bicyclic sterilize lithophytic egoist pastorale daphnia keta pruritus hustings"],
	["majolica rappel dexterous kike uranian giantess ging stimulator freethinker polarizer"],
	["tipple sunbow tatu wigeon butting mangle forget-me-not megalomania toughen riveter"],
	["ecclesiological handcart wol chickasaws kisser towboat bonefish high-minded indemnify arioso"],
	["three-color desecrate orris tessera water-logged pterostigma gunnel linum coracle mincing"],
	["improver ileus ill-timed co-respondent nucleate vend describer paise impudence goatherd"],
	["prizeman totter phonolite equipotential swagman ateles bezoar refound coz ramie"],
	["witted antispasmodic shagreen homeopath linne luxation enumerator megapode tappen conceptualist"],
	["bine brickmaker debark gunstock badgering volvox recidivist supraoccipital hydatid anabranch"],
	["propitiatory cordierite muggins reenlistment dote gratin petrologist indigene steenbok nakedly"],
	["cheerless plack massasauga unimportance comprador clawback ogam haught reassume locken"],
	["stone-cold fraise wene apochromatic seriality semiweekly inhere preeminently sprent skyman"],
	["culturable goosander toady seborrhea filially plethysmograph fluoroscope gatepost reduplicative greenlet"],
	["plaudit consubstantiality lanthorn sleekly rampion secretiveness pensively epineurium ponent antilegomena"],
	["gallimaufry puzzlingly pawk backwardation chatterer devisee tactility bestowment rowlock roup"],
	["faculae brambly foresighted archenteron schoolman hilus microphonic flocculate inspirator spirt"],
	["nonperformance succade vinegary fundable quean cahoot tremie quamash oratorial ketonic"],
	["scrutator flounce overrate diplococcus proclaimer presswork divaricate gynophore rattlebox itinerate"],
	["cyprine somniloquy appendiculate tabret forbore cat-rigged proustite satyriasis dimidiation trunch"],
	["noble-minded aerography infula nonattendance nubecula laudably usance tentage multilineal brisure"],
	["glancingly live-forever unhand perspectively paguma telephotography noduled surgeoncy apocalyptically petroglyphic"],
	["gardyloo illegalize antipole squanderer egophony crenelation locular intercolumnar biangular pretorium"],
	["loller shotted correspondency iatrochemist theine heppen pluckily lutestring hypnotizer azurine"],
	["packway huckaback eventration masthouse cicatrization gemmate waverer subserviently disenroll sarcode"],
	["retainable vaward northwester multicuspidate hierology enclothe rhynchophora naphthene correlatable reconcentrate"],
	["gloser fenestral manubrial beseem noncondensing fortifiable sanies anatine beastlike binocle"],
	["galenite abbreviatory spary uncorruptible unhold improbation appealer overleap tumultuary emanative"],
	["deckle-edged redemptory primateship overissue corresponsive thereinto oppositive paedogenetic enterer uplook"],
	["diageotropic offish anthozoa bilection coenurus demosthenic legerdemainist idiomorphous pamprodactylous whiggery"],
	["water course wennel alogy oligochete arrhizal; arrhizous ungulous west india; west indian dungfork squamipen piscinal"]
];

var rangeslider = document.getElementById("sliderDI");
var output = document.getElementById("myDI");
output.innerHTML = rangeslider.value;

var myRawWords = document.getElementById("myRawWords");
myRawWords.innerHTML = rawWordList[rangeslider.value];
document.getElementById("suggestRawWords").innerHTML = rawWordList[parseInt(document.getElementById("suggestDI").innerHTML)];


rangeslider.oninput = function() {
  output.innerHTML = this.value;
  myRawWords.innerHTML = rawWordList[this.value];
}



////////////////////////////////////////////////////////////


var itemTitle;

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var strCheck;
var strConfirmReview;

function updateSiteInfo(){

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){

		var urlObj = new URL(tabs[0].url);
		host = urlObj.hostname;

		a = urlObj.origin;

		const hostList = host.split('.');

		var topDomain = hostList[hostList.length-1];


		itemTitle = tabs[0].title;


		var maxperc = 0;
		var maxlang = "";
		chrome.i18n.detectLanguage(itemTitle,
			function(langInfo) {

				for (lang of  langInfo.languages) {
	
				  if ( parseInt(lang.percentage) > maxperc ){
					maxlang = lang.language.toString();
					maxperc = parseInt(lang.percentage);					
				  }
				}
			}
		);

		var detectLang = "en";
		if (maxlang == "zh" || maxlang == "ja" || maxlang == "ko"){
			detectLang = franc(itemTitle);
		}

		var langdir = "";
		if ((maxlang == "zh" && detectLang == "cmn" && topDomain == "tw")){
			langdir = "zh_TW";
		}else if ((maxlang == "zh" && detectLang == "cmn") || (maxlang == "zh" && topDomain == "cn")){
			langdir = "zh_CN";
		}else if ((maxlang == "ko" && detectLang == "und") || (maxlang == "ko" && topDomain == "kr")){
			langdir = "ko"; // korean
		}else if ((maxlang == "ja" && detectLang == "und") || (maxlang == "ja" && topDomain == "jp")){
			langdir = "jp"; // japanese
		}else if ((maxlang == "hi" && topDomain == "in" )  || (maxlang == "ne" && topDomain == "com") || (maxlang == "hi" && topDomain == "com") ){
			langdir = "hi"; // Hindi
		}else if ((maxlang == "ru" || maxlang == "ky" )&& topDomain == "ru"   ){
			langdir = "ru"; // Russian
		}else if ((maxlang == "vi" && topDomain == "vn")){
			langdir = "vi"; // Vietnamese
		}else if ((maxlang == "fr" && topDomain == "fr")){
			langdir = "fr"; // French
		}else if ((maxlang == "es" && (topDomain == "mx"  || topDomain == "ar"))){
			langdir = "es"; // Spanish, mexico,argintina
		}else if ((maxlang == "es" || maxlang == "la") && topDomain == "ar" ){
			langdir = "es"; // Spanish, Argentina
		}else {
			langdir = "en";
		}

		var strSubmit;
		var strTitle;
		var strWebsite;
		var strSiteScore;
		var strItem;
		var strItemScore;
		var strMyScore;
		var strMyComment;
		var strMyCredit;
		var strMyContrib;
		var strMyDI;
		var strlogout;

		readTextFile("_locales/" + langdir + "/messages.json", function(text){
			var mydata = JSON.parse(text);
			strTitle = mydata["extName"]["message"];
			strSubmit = mydata["extSubmit"]["message"];
			strWebsite = mydata["extWebsite"]["message"];
			strSiteScore = mydata["extSiteScore"]["message"];
			strItem = mydata["extItem"]["message"];
			strItemScore = mydata["extItemScore"]["message"];
			strMyScore = mydata["extMyScore"]["message"];
			strMyComment = mydata["extMyComment"]["message"];
			strMyCredit = mydata["extMyCredit"]["message"];
			strMyContrib = mydata["extMyContrib"]["message"];
			strMyDI = mydata["extMyDI"]["message"];
			strlogout = mydata["extLogout"]["message"];

			strComment = mydata["extComment"]["placeholder"];
			strUsername = mydata["extUsername"]["placeholder"];
			strEmail = mydata["extEmail"]["placeholder"];
			strPassword = mydata["extPassword"]["placeholder"];

			strlogout = mydata["extLogout"]["message"];

			strWithGoogle = mydata["extWithGoogle"]["message"];
			strWithAccount = mydata["extWithAccount"]["message"];
			strLoginGoogle = mydata["extLoginGoogle"]["message"];
			strLoginAccount = mydata["extLoginAccount"]["message"];

			strRememberGoogle = mydata["extRememberGoogle"]["message"];
			strRememberAccount = mydata["extRememberAccount"]["message"];


			strGoback = mydata["extGoback"]["message"];
			strGobackEmail = mydata["extGobackEmail"]["message"];

		

			document.getElementById("txtTitle").innerHTML = strTitle;
			document.getElementById("submitreview").innerHTML = strSubmit;

			// document.getElementById("txtMyScore").innerHTML = strMyScore;
			// document.getElementById("txtMyComment").innerHTML = strMyComment;
			document.getElementById("txtMyCredit").innerHTML = strMyCredit;
			document.getElementById("txtMyContrib").innerHTML = strMyContrib;
			document.getElementById("logout").innerHTML = strlogout;

			document.getElementById("txtMyDI").innerHTML = strMyDI;

			// document.getElementById("comment").placeholder = strComment;
			document.getElementById("username").placeholder = strUsername;
			document.getElementById("email").placeholder = strEmail;
			document.getElementById("password").placeholder = strPassword;


			// document.getElementById("txtWithGoogle").innerHTML = strWithGoogle;
			document.getElementById("txtWithAccount").innerHTML = strWithAccount;
			// document.getElementById("login_google").innerHTML = strLoginGoogle;
			document.getElementById("login_email").innerHTML = strLoginAccount;

			document.getElementById("login_email").innerHTML = strLoginAccount;

			// document.getElementById("txtRememberGoogle").innerHTML = strRememberGoogle;
			document.getElementById("txtRememberAccount").innerHTML = strRememberAccount;


			document.getElementById("goback").innerHTML = strGoback;
			// document.getElementById("gobackemail").innerHTML = strGobackEmail;

			strConfirmReview = mydata["extConfirmReview"]["message"];
			strCheck = mydata["extCheck"]["message"];
			

		});

		var url = new URL(tabs[0].url)

		var siteUrl = url.hostname;
		var itemTitle = tabs[0].title;

		var urlTxt = 'https://go4do.com/smartword/queryScore.php?website=' + encodeURIComponent(siteUrl) + '&item=' + encodeURIComponent(itemTitle) ;

});

}

updateSiteInfo();


var usr = null;
var pwd = null;
var email = null;
var elem;




function showLogin() {
	document.getElementById("login").style.display = "block";
	document.getElementById("myinfo").style.display = "none";
	document.getElementById("myAccountInfo").style.display = "none";
	document.getElementById("logout").style.display = "none";
	document.getElementById("submitreview").style.display = "none";
	
}

function hideLogin() {
	document.getElementById("login").style.display = "none";
	document.getElementById("myinfo").style.display = "block";
	document.getElementById("myAccountInfo").style.display = "block";
	document.getElementById("logout").style.display = "block";
	document.getElementById("submitreview").style.display = "block";
}



function updateUserInfo(){
		chrome.cookies.getAll({domain: "go4do.com"}, function(cookies) {
		
		for(var i=0; i<cookies.length;i++) {

			if(cookies[i].name === "email") {
				email = cookies[i].value;
				
			}

			if(cookies[i].name === "password") {
				pwd = cookies[i].value;
				
			}
		}

		if ( pwd !=null && email !=null ) {
			var disp= null;
			var urlTxt = 'https://go4do.com/smartword/glogin.php?email=' + encodeURIComponent(email) + '&way=GAPI&access_token=' + pwd   ;
		} else {
			var urlTxt = 'https://go4do.com/smartword/glogin.php?way=GAPI' ;

		}
 
			$.ajax({
				url: urlTxt,
				type: 'POST',
				dataType: 'json',
				success: function(data) {

					if ( data ) {
						hideLogin();
						
						chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
							function(tabs)	{			
								
								var url = new URL(tabs[0].url)			
								var siteUrl = url.hostname;
								var itemTitle = tabs[0].title;
						
								var urlTxt = 'https://go4do.com/smartword/queryMyInfo.php?email=' + data.email + '&pwd=' + data.pwd;
								$.ajax({
								//async: false,
								url: urlTxt,
								type: 'POST',
								dataType: 'json',
								success: function(data3) {
						
								if (data3 != null){ // get my info and review
									
									//alert(data3);
									if (data3.credit){ // this need to be user himself!
										document.getElementById('credit').innerHTML = parseFloat(data3.credit).toFixed(0);
									}

									if (data3.di){
										document.getElementById('myDI').innerHTML = parseFloat(data3.di).toFixed(0);
										document.getElementById('sliderDI').value = data3.di;	
										document.getElementById('myRawWords').innerHTML = rawWordList[data3.di];
									}
								}
								}
							});
						});
					}
					else{
						showLogin();			
					}
				}
			});
	});

}
updateUserInfo();


function updateNotice(){
	var urlTxt = 'https://go4do.com/smartword/notice.php' ;
	$.ajax({
		url: urlTxt,
		type: 'POST',
		dataType: 'html',
		success: function(data) {
			if (data != null){ 
				document.getElementById('notice').innerHTML = data;					
			}
		}
	});
}


updateNotice();

var linkLogout = document.getElementById('logout');
linkLogout.addEventListener('click', function() {

	chrome.cookies.getAll({domain: "go4do.com"}, function(cookies) {
		for(var i=0; i<cookies.length;i++) {
			chrome.cookies.remove({url: "https://go4do.com" + cookies[i].path, name: cookies[i].name});
			location.reload();
		}
	});

});





var bottonBack = document.getElementById('goback');
bottonBack.addEventListener('click', function() {
	document.getElementById('light').style.display='none';
	document.getElementById('fade').style.display='none';
	location.reload();
})


window.addEventListener('load', function () {
	displayReviews(1);
})

var submitReviewGlogin = '';

var linkLoginEmail = document.getElementById('login_email');

linkLoginEmail.addEventListener('click', function() {

          email = document.querySelector('#email').value;
          if (!(validateEmail(email))){
            return;
          };
          password = document.querySelector('#password').value;
		  if (!(validatePassword(password))){
            return;
          };
          username = document.querySelector('#username').value;
		  if (!(validateUsername(username))){
            return;
          };

          password = sha512(password);

          if(document.querySelector('#remember2').checked){
            var remember = 1;
          }else{
            var remember = 0;
          }

          var loginURL ='https://go4do.com/smartword/glogin.php?email=' + email + '&username=' + username +'&way=email&pwd=' + password +'&remember=' + remember ;

          $.ajax({

            url: loginURL,
            type: 'POST',

            dataType: 'json',
            success: function(data_glogin) {
                if (data_glogin.success) {
                  if (remember == 1){
                    chrome.cookies.set({
                      url: "https://go4do.com",
                      name: "email",
                      value: email,
                      expirationDate: (new Date().getTime() / 1000) + 3600*365
                    });
                    chrome.cookies.set({
                      url: "https://go4do.com",
                      name: "username",
                      value: username,
                      expirationDate: (new Date().getTime() / 1000) + 3600*365
                    });
                    
                    chrome.cookies.set({
                      // async: false,
                      url: "https://go4do.com",
                      name: "password",
                      value: password,
                      expirationDate: (new Date().getTime() / 1000) + 3600*365
                    });  
      
                  }else if (remember == 0){
                    chrome.cookies.set({
                      url: "https://go4do.com",
                      name: "email",
                      value: "",
                      expirationDate: (new Date().getTime() / 1000) - 3600
                    });
                    chrome.cookies.set({
                      url: "https://go4do.com",
                      name: "username",
                      value: "",
                      expirationDate: (new Date().getTime() / 1000)  - 3600
                    });
                    
                    chrome.cookies.set({
                      // async: false,
                      url: "https://go4do.com",
                      name: "password",
                      value: "",
                      expirationDate: (new Date().getTime() / 1000)  - 3600
                    });
                  }


                location.reload();

                }else{

                    document.getElementById("txtConfirmReview").innerHTML = strCheck;
                    document.getElementById('light').style.display='block';
                    document.getElementById('fade').style.display='block';
                
                }

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 

            } 
          });

});



function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var validCheck = re.test(email);
  if (!validCheck){
	document.getElementById("txtConfirmReview").innerHTML = strCheck;
    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';
  }
  return validCheck;
}

function validatePassword(password) {
	var passw = /^[a-zA-Z0-9._]{8,30}$/;
	var validCheck = passw.test(password);
	if(!validCheck) 
	{ 
		document.getElementById("txtConfirmReview").innerHTML = strCheck;
		document.getElementById('light').style.display='block';
		document.getElementById('fade').style.display='block';
	}
	return validCheck;
}

function validateUsername(username) {
	var usernameRegex = /^[a-zA-Z0-9._]{0,30}$/;
	var validCheck = usernameRegex.test(username);
	if(!validCheck) 
	{ 
		document.getElementById("txtConfirmReview").innerHTML = strCheck;
		document.getElementById('light').style.display='block';
		document.getElementById('fade').style.display='block';
	}
	return validCheck;
}


  
