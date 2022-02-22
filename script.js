const questionOne = document.getElementById('country-question-one');
const questionTwo = document.getElementById('country-question-two');
const answerFeedback = document.getElementById('answer-feedback');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('user-input');
const giveupBtn = document.getElementById('giveup-btn');

fetch(`https://restcountries.com/v3.1/all`)
  .then((response) => {
    if (!response.ok) {
      const error = new Error(response.status);
      throw error;
    }
    else {
      return response.json();
    }
  })
  .then((data) => {
    const countries = data.map(elem => {
      return {country: elem.name.common, capital: elem.capital}
    });
    const countryObject = randomCountry(countries);
    questionOne.innerText = `What is the capital of ${countryObject.country}?`
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkAnswer(answerInput.value, countryObject.capital)
      giveupBtn.classList.remove('hide');
    });
    giveupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      answerFeedback. innerText =`The correct answer is: ${countryObject.capital}.`
    }
  )
});
  

function randomCountry(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function checkAnswer(input, answer) {
  if (answer.includes(input)) {
    answerFeedback.innerText = "That's right!"
  } else {
    answerFeedback.innerText = "Try again."
  }
}

//handle upper and lower case edge cases

//display second question only after the input to the first one has been submitted



