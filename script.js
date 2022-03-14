// *************
// * Selectors *
// *************
const questionOne = document.getElementById('country-question-one');
const answerFeedback = document.getElementById('answer-feedback');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('user-input');
const giveupBtn = document.getElementById('giveup-btn');
const nextBtn = document.getElementById('next-btn');
const reviewMessage = document.getElementById('review-message');
const toggleSection = document.getElementById('toggle-container');
const reviewBtn = document.getElementById('review-btn')

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
  console.log(alreadyAnswered[1]);
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
    gameData.alreadyAnswered.push({country: gameData.currentCountry.country, capitals: answers, correct: true});
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
  setInterval(() => {
    answerFeedback.innerText = `That's all for today. 
  The next two countries will be available in: ${createTimer()}.`
  }, 1000)

  answerFeedback.innerText = `That's all for today. 
  The next two countries will be available in: ${createTimer()}.`
  // Now you know that ${gameData.countries[0].capital} is the capital of ${gameData.countries[0].country} and
  //  ${gameData.countries[1].capital} is the capital of ${gameData.countries[1].country}. 
  //  Come back tomorrow to learn two more national capitals.`;
}

//toggle review button
let reviewVisible = false;
function toggleReview() {
  reviewVisible = !reviewVisible;
  if (reviewVisible) {
    reviewMessage.classList.remove('hide');
    displayPreviousAnswers()
  } else {
    reviewMessage.classList.add('hide');
  }
}

reviewBtn.addEventListener('click', toggleReview);

//Show review btn at the end only?


function displayPreviousAnswers() {
  reviewMessage.innerHTML = "";
  gameData.alreadyAnswered.forEach(element => {
    const newElem = document.createElement('div');
    newElem.innerText = `${element.country}: ${element.capitals}`
    reviewMessage.appendChild(newElem);
    reviewMessage.classList.add('style-previous-answers')
  });
}

function displayQuestion(country) {
  reviewMessage.innerText = "";
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
  gameData.alreadyAnswered.push({country: gameData.currentCountry.country, capitals: gameData.currentCountry.capital, correct: false});
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
    // displayPreviousAnswers()
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
      // displayPreviousAnswers();
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


//display timer-when the next country/question will be available 
function createTimer() {
  const currentDate = new Date();
  let hours = 23 - currentDate.getHours();
  let minutes = 59 - currentDate.getMinutes();
  let seconds = 59 - currentDate.getSeconds();
  return `${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`
}

//if number has one character, add a leading 0
function zeroPad(num) {
  return String(num).padStart(2, '0')
} 