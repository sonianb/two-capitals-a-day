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

if (!gameData) {
  gameData = {
    questionIndex: 0,
    countries: undefined,
    currentCountry: undefined,
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
    nextBtn.classList.remove('hide');
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
  questionOne.innerText = `That's all for today. You learned that
   ${gameData.countries[0].capital} is the capital of ${gameData.countries[0].country} and that
   ${gameData.countries[1].capital} is the capital of ${gameData.countries[1].country} 
   `;
}

function displayQuestion(country) {
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
  if (gameData.questionIndex === 0) {

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

//Next steps: 
//change btn text to show review after next question
// Save the date in the local storage so new questions can be displayed the next day 