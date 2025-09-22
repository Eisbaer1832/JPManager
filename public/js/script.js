const FirstNameInput = document.getElementById("FirstNameInput")
const LastNameInput = document.getElementById("LastNameInput")
const LeitfrageInput = document.getElementById("LeitfrageInput")
const YearInput = document.getElementById("YearInput")
const SubjectInput = document.getElementById("SubjectInput")
const PresenterVisibleInput = document.getElementById("PresenterVisibleInput")
const PresenterVisibleHelper = document.getElementById("PresenterVisibleHelper")
const DurationInput = document.getElementById("DurationInput")
const DurationleHelper = document.getElementById("DurationleHelper")
const SourcesCheckInput = document.getElementById("SourcesCheckInput")
const SourcesCheckHelper = document.getElementById("SourcesCheckHelper")
const SourcesInput = document.getElementById("SourcesInput")
const VideoUploadInput = document.getElementById("VideoUploadInput")
const VideoUploadHelper = document.getElementById("VideoUploadHelper")
const ConsentInput = document.getElementById("ConsentInput")
const ConsentHelper = document.getElementById("ConsentHelper")

const Popup = document.getElementById("Popup")
const PopupText = document.getElementById("PopupText")


let durationOkay = true

$(document).ready(function(){
    $('#DurationInput').on("input", function(){
		const duration = DurationInput.value
		console.log(duration)
		if (duration >= 275 && duration <= 315) {
			DurationInput.classList.remove("is-danger")
			DurationInput.classList.add("is-success")
			DurationleHelper.classList.add("is-hidden")
			durationOkay = true
		}else {
			DurationInput.classList.remove("is-success")
			DurationInput.classList.add("is-danger")
			DurationleHelper.classList.remove("is-hidden")
			durationOkay = false
		}
	});
});


function isInputEmpty(input) {
	if (input.value.trim().length == 0) {
		input.classList.add("is-danger")
		input.classList.remove("is-success")

		return true
	}else{
		input.classList.remove("is-danger")
		input.classList.add("is-success")

	}
	return false
}

function isCheckboxTicked(input, helper) {
	if (input.checked) {
		helper.classList.add("is-hidden")
		return true
	}else {
		helper.classList.remove("is-hidden")
	}
	return false
}

function checkForErrors() {
	let passed = true;
	passed = isInputEmpty(LastNameInput) ? false : passed
	passed = isInputEmpty(FirstNameInput) ? false : passed
	passed = isInputEmpty(LeitfrageInput) ? false : passed
	passed = isInputEmpty(YearInput) ? false : passed
	passed = isCheckboxTicked(PresenterVisibleInput, PresenterVisibleHelper) ? passed : false
	passed = isCheckboxTicked(SourcesCheckInput, SourcesCheckHelper) ? passed : false
	passed = isInputEmpty(SourcesInput) ? false : passed
	passed = isCheckboxTicked(ConsentInput, ConsentHelper) ? passed : false

	if (SubjectInput.value == "Fachbereich wählen"){
		SubjectInput.classList.add("is-danger")
		SubjectInput.classList.remove("is-success")
		passed = false
	}else {
		SubjectInput.classList.remove("is-danger")
		SubjectInput.classList.add("is-sucess")
	}

	if (VideoUploadInput.files[0] == undefined) {
		VideoUploadHelper.classList.remove("is-hidden")
		passed = false
	}else {
		VideoUploadHelper.classList.add("is-hidden")
	}

	return passed
}


function submit() {
	if (checkForErrors()) {
		console.log("passed")
		const data = {
			firstName: FirstNameInput.value,
			lastName: LastNameInput.value,
			leitfrage: LeitfrageInput.value,
			year: YearInput.value,
			subject: SubjectInput.value,
			duration: DurationInput.value,
			sources: SourcesInput.value,
		};
		const blob = new Blob([JSON.stringify(data)], { type: "application/json" })

		//passing the file format, since the actual file name is uniform
        let ending = VideoUploadInput.files[0].name
        ending = ending.split(".")
		sendFile(VideoUploadInput.files[0], ending[ending.length-1], new File([blob], "the name", { type: "application/json" }))
	}
}

async function sendFile(file, filename, data, dataname) {
	const formData = new FormData();
    Popup.classList.add("is-active")
    PopupText.innerHTML = "<p class='has-text-info'> Video wird hochgeladen...<p> <p class='has-text-danger'>Schließe dieses Fenster nicht!<p>"
	formData.append('file', file);
    formData.append('data', data)

    formData.append('filename', filename);   
	const res = await fetch('/upload', {
		method: 'POST',
		body: formData,
	});
	if (res.error == undefined) {
        PopupText.innerHTML = "<p class='has-text-success'> Dein Video wurde erfolgreich abgegeben. Du kannst diesen Tab jetzt schließen! <p>"
    }else{
        PopupText.innerHTML = "<p class='has-text-danger'> Fehler beim Hochladen des Videos, lade die Seite neu und vesuche es noch einmal!<p>"
    }
	console.log(await res)
}

