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

	if (SubjectInput1.value === "Fachbereich wählen"){
		SubjectInput1.classList.add("is-danger")
		SubjectInput1.classList.remove("is-success")
		passed = false
	}else {
		SubjectInput1.classList.remove("is-danger")
		SubjectInput1.classList.add("is-sucess")
	}
    

	return passed
}


async function sendLehrerAnmeldung(data) {
    Popup.classList.add("is-active")
    PopupText.innerHTML = "<p > Du wirst angemeldet <p> <p class='has-text-danger'>Schließe dieses Fenster nicht!<p>"



	const res = await fetch('/LehrerAnmeldung', {
		method: 'POST',
        headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (res.error === undefined) {
        PopupText.innerHTML = "<p class='has-text-success'> Du bist erfolgreich registriert! Du kannst dieses Fenster nun schließen! <p>"
    }else{
        PopupText.innerHTML = "<p class='has-text-danger'> Fehler bei der Anmeldung!<p>"
    }
	console.log(await res)
}


function submit() {
    if (checkForErrors()) {
		console.log("passed")
        let subjects = []
        if (SubjectInput1.value !== "---") {
            subjects.push(SubjectInput1.value)
        }
        if (SubjectInput2.value !== "---") {
            subjects.push(SubjectInput2.value)
        }
        if (SubjectInput3.value !== "---") {
            subjects.push(SubjectInput3.value)
        }

		const data = {
			firstName: FirstNameInput.value,
			lastName: LastNameInput.value,
            subjects: subjects
		};

		sendLehrerAnmeldung(data)
	}
}
