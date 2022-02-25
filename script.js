// *************
// * Selectors *
// *************
const questionOne = document.getElementById('country-question-one');
const answerFeedback = document.getElementById('answer-feedback');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('user-input');
const giveupBtn = document.getElementById('giveup-btn');
const nextBtn = document.getElementById('next-btn');

let gameData = JSON.parse(window.localStorage.getItem('gameData'));
let currentCountry = undefined;

if (!gameData) {
  gameData = {
    questionIndex: 0,
    country1: undefined,
    country2: undefined,
    country1Outcome: undefined,
    country2Outcome: undefined,
  };
  initGame();
} else {

  startGame();
}

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
    submitBtn.classList.add('hide');
    if (gameData.questionIndex === 0) {
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
  submitBtn.classList.remove('hide');
  giveupBtn.classList.add('hide');
  nextBtn.classList.add('hide');
  questionOne.innerText = `${gameData.questionIndex + 1}. What is the capital of ${country.country}?`
}

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkAnswer(answerInput.value, currentCountry.capital)
});
giveupBtn.addEventListener('click', (e) => {
  e.preventDefault();
  answerFeedback.innerText = `The correct answer is: ${currentCountry.capital}.`
  submitBtn.classList.add('hide');
  giveupBtn.classList.add('hide');
  if (gameData.questionIndex === 0) {
    nextBtn.classList.remove('hide');
  }
})


function initGame() {
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

      gameData.country1 = randomCountry(countries);
      gameData.country2 = randomCountry(countries);

      window.localStorage.setItem('gameData', JSON.stringify(gameData));
      startGame();
    });
}

function startGame() {
  currentCountry = gameData.country1;
  displayQuestion(currentCountry);
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameData.questionIndex = 1;

    currentCountry = gameData.country2;
    displayQuestion(currentCountry);
    answerInput.value = "";
    answerFeedback.innerText = "";
  })
}