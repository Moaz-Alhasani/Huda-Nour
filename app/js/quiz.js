// DOM Elements
const quiz = document.querySelector(".quiz");
const questionCountElement = document.querySelector(".quiz__count-number");
const bulletsContainer = document.querySelector(".quiz__bullets");
const quizQuestionElement = document.querySelector(".quiz__question");
const submitButton = document.querySelector(".quiz__submit");
const popUp = document.querySelector(".pop-up");
const popUpButton = document.querySelector(".pop-up__button");
const quizResult = document.querySelector(".quiz__result");
const secondsElement = document.querySelector(".quiz__seconds");
const minutesElement = document.querySelector(".quiz__minutes");

// Quiz state
let numberOfCorrectAnswers = 0;
let questionIndices = [];
let timer = null;

// Event Listeners
popUpButton.addEventListener("click", startQuiz);

// Functions
function startQuiz() {
    popUp.style.opacity = "0";
    popUp.style.animation = "none";
    quiz.style.opacity = "1";

    // Start timer
    let [seconds, minutes] = [60, 1];
    
    timer = setInterval(() => {
        seconds--;
        if (seconds === 0 && minutes === 0) {            
            showResult();
            return;
        }

        if (seconds === 0 && minutes !== 0) {
            minutes--;
            seconds = 60;
        }

        secondsElement.textContent = seconds < 10 ? `0${seconds}` : seconds;
        minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
    }, 1000);

    fetchQuestions();
}

function fetchQuestions() {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const questions = JSON.parse(this.responseText);
            const totalQuestions = questions.length;
            
            createBullets(totalQuestions);
            loadRandomQuestion(questions, totalQuestions);
            
            submitButton.addEventListener("click", () => {
                checkAnswerAndLoadNext(questions, totalQuestions);
            });
        }
    };

    request.open("GET", "/app/pages/html_question.json", true);
    request.send();
}

function checkAnswerAndLoadNext(questions, totalQuestions) {
    const checkedLabel = document.querySelector("input:checked + .quiz__label");
    const currentQuestionIndex = questionIndices[questionIndices.length - 1];
    
    if (checkedLabel.textContent === questions[currentQuestionIndex].right_answer) {
        numberOfCorrectAnswers++;
    }
    
    loadRandomQuestion(questions, totalQuestions);
    document.querySelectorAll(".quiz__bullet")[questionIndices.length - 1].classList.add("quiz__bullet--active");
}

function createBullets(totalQuestions) {
    questionCountElement.textContent = totalQuestions;
    
    for (let i = 0; i < totalQuestions; i++) {
        const bullet = document.createElement("span");
        bullet.classList.add("quiz__bullet");
        if (i === 0) {
            bullet.classList.add("quiz__bullet--active");
        }
        bulletsContainer.appendChild(bullet);
    }
}

function loadRandomQuestion(questions, totalQuestions) {
    if (questionIndices.length >= totalQuestions) {
        submitButton.style.cursor = "no-drop";
        submitButton.disabled = true;
        showResult();
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * totalQuestions);
    } while (questionIndices.includes(randomIndex) && questionIndices.length < totalQuestions);

    questionIndices.push(randomIndex);
    const currentQuestion = questions[randomIndex];

    // Update question text
    quizQuestionElement.textContent = currentQuestion.title;

    // Prepare answer options
    const answerLabels = document.querySelectorAll(".quiz__label");
    const correctAnswerPosition = Math.floor(Math.random() * 4);
    const usedAnswers = new Set();
    usedAnswers.add("right_answer");

    // Set correct answer at random position
    answerLabels[correctAnswerPosition].textContent = currentQuestion.right_answer;

    // Fill other positions with wrong answers
    for (let i = 0; i < 4; i++) {
        if (i === correctAnswerPosition) continue;
        
        let randomAnswerKey;
        do {
            const randomNum = Math.floor(Math.random() * 3) + 1;
            randomAnswerKey = `answer_${randomNum}`;
        } while (usedAnswers.has(randomAnswerKey) || !currentQuestion[randomAnswerKey]);
        
        usedAnswers.add(randomAnswerKey);
        answerLabels[i].textContent = currentQuestion[randomAnswerKey];
    }
}

function showResult() {
    clearInterval(timer);
    submitButton.style.cursor = "no-drop";
    submitButton.disabled = true;

    let resultClass, resultText;
    
    if (numberOfCorrectAnswers <= 3) {
        resultClass = "quiz__score--bad";
        resultText = "سيئ";
    } else if (numberOfCorrectAnswers <= 6) {
        resultClass = "quiz__score--good";
        resultText = "جيد";
    } else {
        resultClass = "quiz__score--perfect";
        resultText = "ممتاز";
    }

    quizResult.innerHTML = `
        <span class="quiz__score ${resultClass}">${resultText}</span>
        لقد أجبت عن  <span class="quiz__score-number">${numberOfCorrectAnswers}</span> من ${questionIndices.length}
    `;
}


//

const btnHamburger = document.querySelector("#btnHamburger");
const header = document.querySelector(".header");
const overlay = document.querySelector(".overlay");
const fadeElems = document.querySelectorAll(".has-fade"); // overlay and menu
const body = document.querySelector("body");

btnHamburger.addEventListener("click", function () { // open
    if (header.classList.contains("open")) {
        header.classList.remove("open");
        fadeElems.forEach(function (e) {
            e.classList.add("fade-out");
            e.classList.remove("fade-in");
        })

    } else {                                  // close 
        header.classList.add("open");
        fadeElems.forEach(function (e) {
            e.classList.remove("fade-out");
            e.classList.add("fade-in")
        })


    }
})
