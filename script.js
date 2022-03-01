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

if (!gameData || isOutdated(gameData.date)) {
  gameData = {
    questionIndex: 0,
    countries: undefined,
    alreadyAnswered: gameData?.alreadyAnswered ?? [], //keep on reset, if gameData/value is undefined, create a new array
    currentCountry: undefined,
    date: new Date()
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
  const simplifiedAnswers = answers.map(answer => answer.toLowerCase().replace(/-/g, "").normalize("NFD").replace(/\p{Diacritic}/gu, ""));
  const simplifiedInput = input.toLowerCase().replace(/-/g, "").normalize("NFD").replace(/\p{Diacritic}/gu, "");
  if (simplifiedAnswers.includes(simplifiedInput)) {
    answerFeedback.innerText = "That's right!"
    submitBtn.classList.add('hide');
    nextBtn.classList.remove('hide');
    gameData.alreadyAnswered.push({ country: gameData.currentCountry.country , capitals: answers, correct: true});
  }
  else if (input.length <= 0) {
    answerFeedback.innerText = "Please submit an answer first."
  }
  else {
    answerFeedback.innerText = "Try again."
    giveupBtn.classList.remove('hide');
  }
}

function displayReview() {
  answerInput.classList.add('hide');
  submitBtn.classList.add('hide');
  giveupBtn.classList.add('hide');
  nextBtn.classList.add('hide');
  answerInput.value = "";
  answerFeedback.innerText = "";
  questionOne.innerText = "";
  answerFeedback.innerText = `That's all for today. You learned that
   ${gameData.countries[0].capital} is the capital of ${gameData.countries[0].country} and that
   ${gameData.countries[1].capital} is the capital of ${gameData.countries[1].country}. Don't forget to come back tomorrow for more.`;
}

function displayQuestion(country) {
  answerInput.disabled = false;
  submitBtn.classList.remove('hide');
  giveupBtn.classList.add('hide');
  nextBtn.classList.add('hide');
  answerInput.value = "";
  answerFeedback.innerText = "";
  questionOne.innerText = `${gameData.questionIndex + 1}. What is the capital of ${country.country}?`
}

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkAnswer(answerInput.value, gameData.currentCountry.capital)
});
giveupBtn.addEventListener('click', (e) => {
  e.preventDefault();
  answerFeedback.innerText = `The correct answer is: ${gameData.currentCountry.capital}.`
  submitBtn.classList.add('hide');
  giveupBtn.classList.add('hide');
  nextBtn.classList.remove('hide');
  answerInput.disabled = true;
  gameData.alreadyAnswered.push({ country: gameData.currentCountry.country , capitals: gameData.currentCountry.capital, correct: false}); 
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

      gameData.countries = [randomCountry(countries), randomCountry(countries)];
      gameData.currentCountry = gameData.countries[gameData.questionIndex];

      saveGameData();
      startGame();
    });
}

function startGame() {
  if (gameData.currentCountry) {
    displayQuestion(gameData.currentCountry);
  } else {
    displayReview()
  }

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameData.questionIndex++;

    gameData.currentCountry = gameData.countries[gameData.questionIndex];
    saveGameData();
    if (gameData.currentCountry) {
      displayQuestion(gameData.currentCountry);
    } else {
      displayReview()
    }
  })
}

function saveGameData() {
  window.localStorage.setItem('gameData', JSON.stringify(gameData));
}

//function that will be used to determine if a new questions should be displayed  
function isOutdated(date) {
  const currentDate = new Date();
  return currentDate.toISOString().slice(0, 10) !== date.slice(0, 10);
}

//Next steps:
//display previous answers using DOM manipulation (country, capital, answer right or wrong). Use a table maybe?
//how to handle countries that don't have a capital?