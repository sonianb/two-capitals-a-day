const questionOne = document.getElementById('country-question-one');
const questionTwo = document.getElementById('country-question-two');

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
    // answerOne.innerText = `${countryObject.capital}`

  })

//create function to display random country
function randomCountry(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getInputValue() {
  const inputVal = document.getElementById('user-input').value;
  console.log(inputVal);
}

//test user input against answer and provide feedback if correct or not
// function checkAnswer() {
//   
// }

//display second question only after the input to the first one has been submitted



