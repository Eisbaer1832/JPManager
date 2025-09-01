const loginContainer = document.getElementById("loginContainer")
const listContainer = document.getElementById("listContainer")
const bewertungsContainer = document.getElementById("bewertungsContainer")
const insertList = document.getElementById("insertList")

//TODO Implement list view

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
    const res = await fetch('/getVideo', {
		method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
		body: VideoID
	})
    const data = await res.json()
    console.log(data)

}