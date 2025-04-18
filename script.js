let timeoutId;

if (localStorage.getItem("recent_songs") == null || localStorage.getItem("recent_songs") == undefined) {
    recents = [];
} else {
    recents = JSON.parse(localStorage.getItem("recent_songs"));
}
for (i=0; i < recents.length; i++) {
    document.getElementById("recents_display").innerHTML+=`<button onclick="document.getElementById('search').value='${recents.toReversed()[i]}';searchFor('${recents.toReversed()[i]}', false)">${recents.toReversed()[i]}</button>`;
}

function searchFor(query, searched) {
    clearTimeout(timeoutId); // Cancel any existing timeout
    if (query.length > 0) {
        if (document.querySelector("#songname").innerHTML=="no results :(") {document.querySelector("#songname").innerHTML=""}
        document.querySelector(".loader").style.display="inline-block";
    timeoutId = setTimeout(function(){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://lrclib.net/api/search?q='+query.replaceAll(" ", "+"), false); // The 'false' argument makes it synchronous
        xhr.send();

        if (xhr.status === 200) {
            console.log(xhr.responseText);
            if (JSON.parse(xhr.responseText).length>0) {
        
        document.querySelector("#lyrics").innerHTML=JSON.parse(xhr.responseText)[0]["plainLyrics"].replaceAll("\n","<br>");
        document.querySelector("#songname").innerHTML=JSON.parse(xhr.responseText)[0]["name"];
        document.querySelector("#artist").innerHTML=JSON.parse(xhr.responseText)[0]["artistName"];
        document.querySelector(".loader").style.display="none";
        if (searched == true){
        recents.push(query);
        if (recents.length > 9) {recents.shift();};
        localStorage.setItem("recent_songs", JSON.stringify(recents));
        document.getElementById("recents_display").innerHTML="";
        for (i=0; i < recents.length; i++) {
            document.getElementById("recents_display").innerHTML+=`<button onclick="document.getElementById('search').value='${recents.toReversed()[i]}';searchFor('${recents.toReversed()[i]}', false)">${recents.toReversed()[i]}</button>`;
        }}
    } else {document.querySelector(".loader").style.display="none"; document.querySelector("#songname").innerHTML="no results :("; document.querySelector("#artist").innerHTML=""; document.querySelector("#lyrics").innerHTML="";}
        } else {
        console.error('Request failed with status:', xhr.status);
        }

    }, 2000);} else {
        document.querySelector(".loader").style.display="none";
    }
}

function clearHistory() {
    localStorage.setItem("recent_songs", JSON.stringify([]));
    window.location.reload();
}
