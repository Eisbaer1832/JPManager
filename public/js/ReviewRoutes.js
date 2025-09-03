
async function fetchVids(reviewerID) {
    const res = await fetch('/getReviewItems', {
		method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
		body: reviewerID
	}) 
    const data = await res.json()
    console.log(data)
    $("#insertList").empty();
    data.videos.forEach((element, index) => {
        $("<div></div>").load("/public/html/videocard.html", function(responseText) {
            let updatedHtml = responseText
                .replace(/VideoID/, element)
                .replace(/FunctionVideoID/, element)
            
            if (data.done[index]) {
                updatedHtml = updatedHtml
                    .replace(/Nicht bearbeitet/, "Bereits bearbeitet")
                    .replace(/is-danger/, "is-success")
            }

            $(this).html(updatedHtml);
            $("#insertList").append($(this));
        });
    })
}


async function fetchReviewData(VideoID) {
    currentVid = VideoID
    Popup.classList.add("is-active")
    PopupText.innerHTML = "Video wird geladen"

    const dataToSend = {
        VideoID: VideoID,
        reviewer: rUUID
    }
    const resVidData = await fetch('/getVideoData', {
		method: 'POST',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dataToSend)
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

    reviewData = JSON.parse(data.data)

    if (reviewData.error == undefined) {
        Popup.classList.remove("is-active")
        listContainer.classList.add("disabled")
        bewertungsContainer.classList.remove("disabled")
        showCategorys(data.reviewType, reviewData)
        showData(reviewData)
    }else{
        PopupText.innerHTML = "<p class='has-text-danger'> Fehler beim Laden des Videos <p>"
    }
}