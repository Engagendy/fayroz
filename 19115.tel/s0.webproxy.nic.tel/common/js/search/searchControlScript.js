// Enable search button if the user typed more than 2 characters
function enablesearchbtn(str, event){			
	event.preventDefault();
		//str = document.getElementById("searchTxt").value;
		if (str.length >= 3) {
			document.getElementById("searchBtn").removeAttribute("disabled");
			if (event.keyCode == 13) {
				//document.getElementById("searchBtn").click();
				document.searchForm.submit();
			}
		}	
		else{
			document.getElementById("searchBtn").setAttribute("disabled", true);
		}		

}

function searchSubmit(){
	str = document.getElementById("searchTxt").value;
	if (str.length < 3) return false;
}
