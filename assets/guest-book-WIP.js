

 window.onload = fetchGuestBook_Entries();

function fetchGuestBook_Entries(){

// Fetching Spreadsheet JSON Data	
fetch(
    `https://opensheet.elk.sh/${Google_Form_ID}/${Google_Form_Name}`
)
    .then((res) => res.json())
    .then((data) => {

        // reversing JSON data to make things easier
         let sortedInput = (data.reverse())
             
			
	 	
	// Add 5 entries to main page
	      // ie; iterate 5 times
	for(var i = 0; i < 5 && i < sortedInput.length; i++){
		
		// Split timestamp data
		var splitTime =  sortedInput[i].Timestamp.split(' ')[0];
		var splitTime_1 =  sortedInput[i].Timestamp.split(' ').pop();

		
		 // Work in Progress - Convert to 24 Hour
		let ConvertedTime =  tConvert (splitTime_1)
		
		// Sanitize Data
		let SantizeName =  encodeHTML(sortedInput[i].Name)
		
		let SantizeResponses =  encodeHTML(sortedInput[i].Guestbook_Entry)
		
		    // Dis-allow unicode comments for spam 
		 SantizeName = SantizeName.replace(/[^\x00-\x7F]/g, "")

		SantizeResponses = SantizeResponses.replace(/[^\x00-\x7F]/g, "")
                  
		// Add Entries To Main Section
		document.getElementById("json").innerHTML += `
					 <div class="entry">
                <div class="entry-info">
                    <p><span class="author"> ${SantizeName}.</span> | <span class="date">${splitTime}</span> | <span class="time">${ConvertedTime}</span></p>
                </div>
                <div class="entry-text">
                    <p>${SantizeResponses} </p>
                </div>
            </div>`
		
}
	
	
	/// Adding all entries to all entry section
	
        data.forEach((row) => {
		
		// Sanitize Data
		let SantizeResponses =  encodeHTML(row.Guestbook_Entry)
		
		let SantizeName =  encodeHTML(row.Name)
		
		// Dis-allow unicode comments for spam 
		 SantizeName = SantizeName.replace(/[^\x00-\x7F]/g, "")

		SantizeResponses = SantizeResponses.replace(/[^\x00-\x7F]/g, "")
		
		// Split timestamp data
					var splitTime =  row.Timestamp.split(' ')[0];
		var splitTime_1 =  row.Timestamp.split(' ').pop();

		
		 // Work in Progress - Convert to 24 Hour
		let ConvertedTime =  tConvert (splitTime_1)
					
				
           document.getElementById("AllEntries_Content").innerHTML += `
					 <div class="entry">
                <div class="entry-info">
                    <p><span class="author">${SantizeName}</span> | <span class="date">${splitTime}</span> | <span class="time">${ConvertedTime}</span></p>
                </div>
                <div class="entry-text">
                    <p>${SantizeResponses}</p>
                </div>
            </div>`
          
        });
    });

	
}


// On Submit - Validating Text Before Sending For Profanities
var Gform = document.getElementById("gform")
Gform.addEventListener('submit', (e) => {
  validateRecaptcha();
	
  
})

// Validate Recaptcha
function validateRecaptcha() {
    var response = grecaptcha.getResponse();
    if (response.length === 0) {
         // if Captcha not passed - do no nothing. 
        return false;
    } else {
	    // if Captcha Passed - Validate Text For Swearing Etc. 
        validate_text();
        return true;
    }
}

// Convert 24 hour timestamp to 12 hour format - Work in Progress

// https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no

function tConvert (time) {
  
  return time; // return adjusted time or original string
}



		 
var subscribeForm = document.getElementById("SendForm")

/// Profanity Filter

   // Enter the words to be not allowed in form submission for Profanity Filter
var swear_words_arr=new Array("mlzrt");

var swear_alert_arr=new Array;
var swear_alert_count=0;
function reset_alert_count()
{
 swear_alert_count=0;
}
function validate_text()
{
 reset_alert_count();
 var compare_text=document.getElementById(GOOGLE_ENTRY_ID_Guestbook).value;
 for(var i=0; i<swear_words_arr.length; i++)
 {
  for(var j=0; j<(compare_text.length); j++)
  {
   if(swear_words_arr[i]==compare_text.substring(j,(j+swear_words_arr[i].length)).toLowerCase())
   {
    swear_alert_arr[swear_alert_count]=compare_text.substring(j,(j+swear_words_arr[i].length));
    swear_alert_count++;
   }
  }
 }
 var alert_text="";
 for(var k=1; k<=swear_alert_count; k++)
 {
  alert_text+="\n" + "(" + k + ")  " + swear_alert_arr[k-1];
 }

	// if profanity is detected - show this message	 	
 if(swear_alert_count>0)
 {
	 
  var subscribeForm = document.getElementById("SendForm")
  // Fade out form to make things look nice
 subscribeForm.setAttribute("style", "-webkit-animation: fadeOut 1s; animation: fadeOut 1s;  animation-fill-mode: forwards;");
// Hide the input form values	 
 Gform.setAttribute("style", "display:none;");  
 // Show the user this message + the illegal character they used.
subscribeForm.innerHTML = `	<a class="close" onclick="ResetSwearForm();" href="#">&times;</a>
<h1  style="text-align: center;
    margin-top: 2em;">Your message will not be added! \nThe following illegal words were found:</h1> <p>${alert_text}</p>`   
  // Fade message in
subscribeForm.setAttribute("style", "-webkit-animation: fadeIn 1s; animation: fadeIn 1s;  animation-fill-mode: forwards;");  
	 

 }
 else  // if no profanities found - check if Captcha is complete
 {
	 
	
	 
	   var response = grecaptcha.getResponse();
    if (response.length === 0) { // if Captcha is not complete
        // do nothing
   
    } else { // add values to guestbook
	
      document.gform.submit();
    
    }

	 
	   // Timeout is needed for form to properly submit with animation
	 
	 setTimeout(function(){
   
		 

  // Hide the form values 
Gform.setAttribute("style", "display:none;");  
  var subscribeForm = document.getElementById("SendForm")

  
     // Show the user message their entry has been added
subscribeForm.innerHTML = `	<a class="close" href="#">&times;</a>
<h1 style="text-align: center;
    margin-top: 2em;">Your Guestbook Entry Has Added! It will appear shortly!</h1> `   
  
},500);
 }
}
window.onload=reset_alert_count;

// After profanity message is shown - we need to reset it to allow user to try again

    /// ie : Reset form after showing user message of violation
var subscribeForm = document.getElementById("SendForm")

function ResetSwearForm(){
	
			 
                      // Fade out form to make things look nice
 subscribeForm.setAttribute("style", "-webkit-animation: fadeOut 1s; animation: fadeOut 1s;  animation-fill-mode: forwards;");
 
 
subscribeForm.innerHTML = ` <h1>Sign The Guestbook</h1>
		<a class="close" href="#">&times;</a>
		<div class="content">
      <label style="display: block;
    text-align: center;" class="aterisk_before" for="gform"> indicates a required field</label>
      <br>
		
    <form name="gform" id="gform" enctype="text/plain" action="${Google_Form_Link}" target="hidden_iframe">
    
    
    
    
     
  
    
       <label for="${GOOGLE_ENTRY_ID_Name}"  class="aterisk_after">Name </label>
      
        <input class="form-element short" type="text" name="${GOOGLE_ENTRY_ID_Name}" id="${GOOGLE_ENTRY_ID_Name}" placeholder="John Doe." style="background: #5EC6C8;" required>
      
        <label for="${GOOGLE_ENTRY_ID_Email}">GitHub Username</label>
      
   
        <input class="form-element short" type="text" name="${GOOGLE_ENTRY_ID_Email}" id="${GOOGLE_ENTRY_ID_Email}" placeholder="MarketingPip" style="background: #5EC6C8;">
      
   <label for="${GOOGLE_ENTRY_ID_Guestbook}"  class="max-length">Guestbook Entry</label>
      
      <textarea class="form-element" name="${GOOGLE_ENTRY_ID_Guestbook}" id="${GOOGLE_ENTRY_ID_Guestbook}" rows="5" cols="30" oninvalid="this.setCustomValidity('You must sign the guestbook')"
  oninput="this.setCustomValidity('')"  maxlength="50" placeholder="Enter Your Message Here" required></textarea>
      
         <label for="g-recaptcha"  class="aterisk_after">Captcha</label>      
   <div class="g-recaptcha"
       data-sitekey="${CaptchaKey}"></div> 
      
        <input class="form-button" type="submit" value="Submit">
        <input class="form-button" type="reset" value="Reset Form">
 
    </form>
		</div>
	</div>
</div> 
</div>
     
	     
`   
  
subscribeForm.setAttribute("style", "-webkit-animation: fadeIn 1s; animation: fadeIn 1s;  animation-fill-mode: forwards;");  
}
