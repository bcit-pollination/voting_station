function votingLoginButtonHandler() {
    console.log('clicked: voting-login-button')
    let email = document.getElementById('login-username-input').value
    let password = document.getElementById('login-password-input').value
    console.log(email, password);

    // stores the jwt in the global variable
    login(email, password).then((jwt) => {
        session_jwt = jwt;
        console.log(jwt);
        let loginForm = document.getElementById('step-I');
        // loginForm.style.visibility = 'hidden';

        // Let the Verifier add the location. Submit button uses submitLocation.
        loginForm.innerHTML = "<center><h2>Please enter the location of<br>this polling station.</h2><br><br><input type='text' id='rpi-location-id' /><br><br><button onclick = 'submitLocation()'>Submit</button></center>";

        let verifierPasswordStep = document.getElementById('step-II-0')
        verifierPasswordStep.style.visibility = 'visible'

        // FIXME: uncomment this:
        // let importStep = document.getElementById('step-II-1');
        // importStep.style.visibility = 'visible';
    });
}

function goBack() {
    window.history.back();
}

module.exports = {
    votingLoginButtonHandler,
    goBack
}