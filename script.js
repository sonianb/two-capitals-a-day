const questionOne = document.getElementById('country-question-one');
const questionTwo = document.getElementById('country-question-two');
const answerFeedback = document.getElementById('answer-feedback');
const submitBtn = document.getElementById('submit-btn');
const answerInput = document.getElementById('user-input');
const giveupBtn = document.getElementById('giveup-btn');
const questionTwoSection = document.getElementById('question-two-section');

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
    questionOne.innerText = `What is the capital of ${firstCountry.country}?`
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      checkAnswer(answerInput.value, firstCountry.capital)
      giveupBtn.classList.remove('hide');
    });
    giveupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      answerFeedback.innerText = `The correct answer is: ${firstCountry.capital}.`
    }
    )
    const secondCountry = randomCountry(countries);
    questionTwo.innerText = `What is the capital of ${secondCountry.country}?`
  });

//if the answer is correct show second question or if the user clicks give up.

function randomCountry(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function checkAnswer(input, answers) {
  const lowercasedAnswers = answers.map(answer => answer.toLowerCase());
  const lowercasedInput = input.toLowerCase();
  if (lowercasedAnswers.includes(lowercasedInput)) {
    answerFeedback.innerText = "That's right!"
    questionTwoSection.classList.remove('hide');
  } else {
    answerFeedback.innerText = "Try again."
  }
}




