const loginContainer = document.getElementById("loginContainer")
const listContainer = document.getElementById("listContainer")
const bewertungsContainer = document.getElementById("bewertungsContainer")
const insertList = document.getElementById("insertList")
const Popup = document.getElementById("Popup")
const PopupText = document.getElementById("PopupText")
const videoPlayer = document.getElementById('videoPlayer');



function login() {
    const rUUID = document.getElementById("loginInput").value
    console.log(rUUID)
    loginContainer.classList.add("disabled")
    listContainer.classList.remove("disabled")
    fetchVids(rUUID)
}

async function fetchVids(reviewerID) {
    const res = await fetch('/getReviewItems', {
		method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
		body: reviewerID
	}) 
    const data = await res.json()
    console.log(data)
    data.videos.forEach(element => {
        $("<div></div>").load("/public/html/videocard.html", function(responseText) {
            let updatedHtml = responseText
                .replace(/VideoID/, element)
                .replace(/FunctionVideoID/, element)


        
            $(this).html(updatedHtml);
            $("#insertList").append($(this));
        });
    })
}


async function fetchReviewData(VideoID) {
    Popup.classList.add("is-active")
    PopupText.innerHTML = "Video wird geladen"


    const resVidData = await fetch('/getVideoData', {
		method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
		body: VideoID
	})
    let data = await resVidData.json()


    const resVid = await fetch('/getVideo', {
		method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
		body: VideoID
	})
    const vid = await resVid.blob()
    const videoURL = URL.createObjectURL(vid);
    videoPlayer.src = videoURL;
    videoPlayer.play();

    data = JSON.parse(data.data)
    
    if (data.error == undefined) {
        Popup.classList.remove("is-active")
        listContainer.classList.add("disabled")
        bewertungsContainer.classList.remove("disabled")
        showData(data)
    }else{
        PopupText.innerHTML = "<p class='has-text-danger'> Fehler beim Laden des Videos <p>"
    }
    console.log(data, data.video)

}

function showData(data, video) {
    console.log(video)
    $("#Leitfrage").html(`Leitfrage: ${data.leitfrage}`);
    $("#year").html(`Jahrgang/Klasse: ${data.year}`);
    $("#Subject").html(`Fachgebiet: ${data.subject}`);
    $("#Duration").html(`Länge: ${data.duration}`);
    $("#Sources").html(`Quellen: ${data.sources}`);
}