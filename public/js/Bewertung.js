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
    console.log(await res.json().videos)

}