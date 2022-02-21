const questionOne = document.getElementById('country-question-one');
const questionTwo = document.getElementById('country-question-two');
const answerOne = document.getElementById('country-answer-one');
const answerTwo = document.getElementById('country-answer-two');

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
     questionOne.innerText = `What is the capital of ${countries[45].country}?`
     
    //display answer
    
})

//create function to display random country with capital 

