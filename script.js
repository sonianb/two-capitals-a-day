// *************
// * Selectors *
// *************
const questionOne = document.getElementById('country-question-one');
const answerFeedback = document.getElementById('answer-feedback');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('user-input');
const giveupBtn = document.getElementById('giveup-btn');
const nextBtn = document.getElementById('next-btn');

let questionIndex = 0;

// *************
// * App logic *
// *************

function randomCountry(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function checkAnswer(input, answers) {
  const lowercasedAnswers = answers.map(answer => answer.toLowerCase());
  const lowercasedInput = input.toLowerCase();
  if (lowercasedAnswers.includes(lowercasedInput)) {
    answerFeedback.innerText = "That's right!"
    if (questionIndex === 0) {
      nextBtn.classList.remove('hide');
    }
  }
  else if (input.length <= 0) {
    answerFeedback.innerText = "Please submit an answer first."
  }
  else {
    answerFeedback.innerText = "Try again."
    giveupBtn.classList.remove('hide');
  }
}

function displayQuestion(country) {
  nextBtn.classList.add('hide');
  questionOne.innerText = `What is the capital of ${country.country}?`
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    checkAnswer(answerInput.value, country.capital)
  });
  giveupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    answerFeedback.innerText = `The correct answer is: ${country.capital}.`
    submitBtn.classList.add('hide');
    giveupBtn.classList.add('hide');
    if (questionIndex === 0) {
      nextBtn.classList.remove('hide');
    }
  })
}


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
    const firstCountry = randomCountry(countries);
    displayQuestion(firstCountry);
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      questionIndex = 1;
      const secondCountry = randomCountry(countries);
      displayQuestion(secondCountry);
      giveupBtn.classList.add('hide');
      answerInput.value = "";
      answerFeedback.innerText = "";
      submitBtn.classList.remove('hide');
    })
  });

  //how to restrict countries shown to two countries a day?
  //how to store them at the local storage?