const questionOne = document.getElementById('country-question-one');
const questionTwo = document.getElementById('country-question-two');
const answerFeedback = document.getElementById('answer-feedback');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('user-input');
const giveupBtn = document.getElementById('giveup-btn');
const questionTwoSection = document.getElementById('question-two-section');
const secondAnswerFeedback = document.getElementById('second-answer-feedback');
const nextBtn = document.getElementById('next-btn');

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
      const secondCountry = randomCountry(countries);
      displayQuestion(secondCountry);
      giveupBtn.classList.add('hide');
      answerInput.innerHTML = "";
      answerFeedback.innerText = "";
    })
  });

function randomCountry(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function checkAnswer(input, answers) {
  const lowercasedAnswers = answers.map(answer => answer.toLowerCase());
  const lowercasedInput = input.toLowerCase();
  if (lowercasedAnswers.includes(lowercasedInput)) {
    answerFeedback.innerText = "That's right!"
    nextBtn.classList.remove('hide');
  } else {
    answerFeedback.innerText = "Try again."
  }
}

function displayQuestion(country) {
  questionOne.innerText = `What is the capital of ${country.country}?`
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    checkAnswer(answerInput.value, country.capital)
    giveupBtn.classList.remove('hide');
  });
  giveupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    answerFeedback.innerText = `The correct answer is: ${country.capital}.`
    nextBtn.classList.remove('hide');
  })
}



