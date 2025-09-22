const FirstNameInput = document.getElementById("FirstNameInput")
const LastNameInput = document.getElementById("LastNameInput")
const SubjectInput1 = document.getElementById("SubjectInput1")
const SubjectInput2 = document.getElementById("SubjectInput2")
const SubjectInput3 = document.getElementById("SubjectInput3")

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


function checkForErrors() {
	let passed = true;
	passed = isInputEmpty(LastNameInput) ? false : passed
	passed = isInputEmpty(FirstNameInput) ? false : passed

	if (SubjectInput1.value == "Fachbereich wählen"){
		SubjectInput1.classList.add("is-danger")
		SubjectInput1.classList.remove("is-success")
		passed = false
	}else {
		SubjectInput1.classList.remove("is-danger")
		SubjectInput1.classList.add("is-sucess")
	}
    
    if (SubjectInput2.value == "Fachbereich wählen"){
		SubjectInput2.classList.add("is-danger")
		SubjectInput2.classList.remove("is-success")
		passed = false
	}else {
		SubjectInput2.classList.remove("is-danger")
		SubjectInput2.classList.add("is-sucess")
	}

    if (SubjectInput3.value == "Fachbereich wählen"){
		SubjectInput3.classList.add("is-danger")
		SubjectInput3.classList.remove("is-success")
		passed = false
	}else {
		SubjectInput3.classList.remove("is-danger")
		SubjectInput3.classList.add("is-sucess")
	}
	return passed
}


async function sendLehrerAnmeldung(data) {
    Popup.classList.add("is-active")
    PopupText.innerHTML = "<p class='has-text-info'> Video wird hochgeladen...<p> <p class='has-text-danger'>Schließe dieses Fenster nicht!<p>"


	const res = await fetch('/LehrerAnmeldung', {
		method: 'POST',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (res.error == undefined) {
        PopupText.innerHTML = "<p class='has-text-success'> Dein Video wurde erfolgreich abgegeben. Du kannst diesen Tab jetzt schließen! <p>"
    }else{
        PopupText.innerHTML = "<p class='has-text-danger'> Fehler beim Hochladen des Videos, lade die Seite neu und vesuche es noch einmal!<p>"
    }
	console.log(await res)
}


function submit() {
    if (checkForErrors()) {
		console.log("passed")
		const data = {
			firstName: FirstNameInput.value,
			lastName: LastNameInput.value,
			subject1: SubjectInput1.value,
            subject2: SubjectInput2.value,
            subject3: SubjectInput3.value,
		};

		sendLehrerAnmeldung(data)
	}
}
