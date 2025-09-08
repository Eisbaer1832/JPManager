const loginContainer = document.getElementById("loginContainer")
const listContainer = document.getElementById("listContainer")
const bewertungsContainer = document.getElementById("bewertungsContainer")
const insertList = document.getElementById("insertList")
const Popup = document.getElementById("Popup")
const PopupText = document.getElementById("PopupText")
const videoPlayer = document.getElementById('videoPlayer');
let rUUID = ""
let currentVid = ""
const radioButtons = ["radio1", "radio2","radio3","radio4","radio5"]

function login() {
    rUUID = document.getElementById("loginInput").value
    console.log(rUUID)
    loginContainer.classList.add("disabled")
    listContainer.classList.remove("disabled")
    fetchVids(rUUID)
}

function showCategorys(type, reviewData) {
    console.log(type)
    let savedReviewData = []
    switch (type){
        case "Fachkompetenzen":
            savedReviewData = reviewData.Fachkompetenzen
            $("#q1").html(`Fragestellung/Hypothese klar konturiert`)
            $("#q2").html(`Thema/Inhalte gut erarbeitet`)
            $("#q3").html(`Informationsgehalt angemessen`)
            $("#q4").html(`Sachlich richtig`)
            $("#q5").parent().addClass("disabled")
            break
        case "Darstellungsvermögen":
            savedReviewData = reviewData.Darstellungsvermögen
            $("#q1").html(`Argumentation nachvollziehbar`)
            $("#q2").html(`Aussagen anschaulich (Beispiele, Vergleiche, sprachliche Bilder)`)
            $("#q3").html(`Aufbau funktional (Einleitung, Hauptteil, Schluss, roter Faden)`)
            $("#q4").html(`Medieneinsatz funktional`)
            $("#q5").html(`Performanz (Körpersprache und Stimme) unterstützt die Präsentation`)
            $("#q5").parent().removeClass("disabled")
            break
        case "Adressatenorientierung":
            savedReviewData = reviewData.Adressatenorientierung
            $("#q1").html(`Vorwissen der Zuhörer berücksichtigt`)
            $("#q2").html(`Bezug zum Publikum hergestellt`)
            $("#q3").html(`Zeitmanagement überzeugend`)
            $("#q4").html(`Raumsituation berücksichtigt`)
            $("#q5").parent().addClass("disabled")
            break
    }   
    console.log(savedReviewData)

    if (savedReviewData == undefined) return 0
    radioButtons.forEach((radio, index) => { 
        const container = document.getElementById(radio);
        const buttons = container.querySelectorAll('.buttons .button');

        for (let i = 0; i <= buttons.length -1; i++) {
            if (buttons[i].innerHTML == savedReviewData[index]) {
                console.log(buttons[i].innerHTML +  savedReviewData[index])
                buttons[0].classList.remove('is-selected', "is-success")
                buttons[i].classList.add('is-selected', "is-success")
            }
        }
    })

}



function showData(data, video) {
    console.log(video)
    $("#Leitfrage").html(`Leitfrage: ${data.leitfrage}`);
    $("#year").html(`Jahrgang/Klasse: ${data.year}`);
    $("#Subject").html(`Fachgebiet: ${data.subject}`);
    $("#Duration").html(`Länge: ${data.duration}`);
    $("#Sources").html(`Quellen: ${data.sources}`);
}

function radioButton(id) {
    const container = document.getElementById(id);
    const buttons = container.querySelectorAll('.buttons .button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('is-selected', "is-success"));
            button.classList.add('is-selected', "is-success");
        });
    });
}

async function submit() {
    Popup.classList.add("is-active")
    PopupText.innerHTML = "Bewertung wird versendet!"

    values = []
    
    radioButtons.forEach(group => { 
        const container = document.getElementById(group);
        const buttons = container.querySelectorAll('.buttons .button');

        buttons.forEach(button => {
            if(button.classList.contains("is-selected")) {
                values.push(button.innerHTML)
            }
        });
    })
    const review = {
        reviewer: rUUID,
        video: currentVid,
        rating: values
    }
    const res = await fetch('/submitReview', {
		method: 'POST',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(review)
	}) 
    if (res.status == 200) {
        PopupText.innerHTML = "<p class='has-text-success'>Bewertung wurde erfolgreich abgegeben!<p> \n Du Wirst in Kürze auf die Startseite weitegeleitet!"
        await delay(3000);
        Popup.classList.remove("is-active")
        listContainer.classList.remove("disabled")
        bewertungsContainer.classList.add("disabled")
        fetchVids(rUUID)
    }else {
        PopupText.innerHTML = "Fehler bei der Datenübertragung. Bitte lade die Seite neu und versuche es ernaut!"

    }
}

radioButtons.forEach(group => { 
    radioButton(group)
})
const delay = ms => new Promise(res => setTimeout(res, ms));
