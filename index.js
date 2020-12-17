const meter = document.getElementById("meter");
const password = document.getElementById("password");
const tips = document.getElementById("tips");

password.addEventListener("input", updateMeter);

//Initial call
updateMeter();

//Update the bar progress with the current password
function updateMeter() {
  const weaknesses = calculatePasswordStrength(password.value);

  //Reset of the values
  let strength = 100;
  tips.innerHTML = "";

  //Loop to setup the new values
  weaknesses.forEach((weakness) => {
    if (weakness == null) {
      return;
    }
    const message = document.createElement("div");
    message.innerText = weakness.message;
    tips.appendChild(message);
    strength -= weakness.deduction;
  });

  meter.style.setProperty("--strength", strength);
}

//Received the password value, return an array of the possible weaknesses, after check the password out with lengthWeakness
function calculatePasswordStrength(password) {
  const weaknesses = [];
  weaknesses.push(lengthWeakness(password));
  weaknesses.push(lowerCaseWeakness(password));
  weaknesses.push(upperCaseWeakness(password));
  weaknesses.push(numberWeakness(password));
  weaknesses.push(specialCharacterWeakness(password));
  weaknesses.push(repeatCharacterWeakness(password));
  return weaknesses;
}

//Return the weakness length related to the password given
function lengthWeakness(password) {
  const length = password.length;

  if (length <= 5) {
    return {
      message: "Password too short",
      deduction: 40,
    };
  }
  if (length <= 10) {
    return {
      message: "Password shall be longer",
      deduction: 15,
    };
  }
}

//Return the weakness lowercase related to the password given
function lowerCaseWeakness(password) {
  return checkWeakness(password, /[a-z]/g, "lowercase");
}

//Return the weakness uppercase related to the password given
function upperCaseWeakness(password) {
  return checkWeakness(password, /[A-Z]/g, "uppercase");
}

//Return the weakness numbers related to the password given
function numberWeakness(password) {
  return checkWeakness(password, /[0-9]/g, "numbers");
}

//Return the weakness special characters related to the password given
function specialCharacterWeakness(password) {
  return checkWeakness(password, /[^0-9a-zA-Z\s]/g, "special");
}

//Used for the four almost identical checks (lower,upper,number and special characters), get the current password, the regex to use, and the type of weakness to return in the message
function checkWeakness(password, regex, type) {
  const matches = password.match(regex) || [];

  if (matches.length === 0) {
    return {
      message: `Password has not ${type} characters`,
      deduction: 20,
    };
  }
  if (matches.length <= 2) {
    return {
      message: `Password shall use more ${type} characters`,
      deduction: 5,
    };
  }
}

function repeatCharacterWeakness(password) {
  const matches = password.match(/(.)\1/g) || [];
  if (matches.length > 0) {
    return {
      message: "Password has repeat characters",
      deduction: matches.length * 10,
    };
  }
}
