let pageTest;

document.addEventListener('DOMContentLoaded', () => {
  fetch("practice-test-" + testNumber + ".json").then(response => response.json()).then(setupTest)
});

function setupTest(test) {
  pageTest = test
  let body = document.getElementsByTagName("body")[0]
  let i = 0

  for (const question of test.questions) {
    let element = document.createElement("div")
    element.classList.add("question")

    let questionNumber = document.createElement("b")
    questionNumber.textContent = "Question " + (i + 1)

    let prompt = document.createElement("p")
    prompt.append(question.prompt)

    let passage;
    if (question.poetry) {
      passage = document.createElement("div")
      makePoemLineNumbers(passage)
    } else if ('passage' in question) {
      // paragraph
      passage = document.createElement("p")
      passage.classList.add("passage")
      passage.textContent = question.passage
    }

    let answers = makeAnswerSection(question, i)
    let feedback = document.createElement("p")
    feedback.id = "q" + i

    element.append(questionNumber, prompt)
    if (passage) {
      element.append(passage)
    }
    element.append(answers, feedback)

    body.appendChild(element)
    if (i + 1 < test.questions.length) {
      body.append(document.createElement("hr"))
    }
    i++
  }
}

function makePoemLineNumbers(passage) {
  // table with line numbers
  passage.classList.add("poetry")
  let poem = document.createElement("div")
  let lineCount = 0
  for (const line of question.passage.split("\n")) {
    lineCount++
    let br = document.createElement("br")
    poem.append(line, br)
  }
  let lineNumbers = document.createElement("div");
  lineNumbers.classList.add("line-numbers")
  for (let i = 0; i <= lineCount; i++) {
    if ((i + 1) % 5 === 0) {
      lineNumbers.append("" + (i + 1))
    }
    lineNumbers.append(document.createElement("br"))
  }

  passage.append(lineNumbers, poem)
}

function makeAnswerSection(question, i) {
  let answers = document.createElement("form")
  answers.onsubmit = checkAnswers
  let j = 0
  for (const choice of question.choices) {
    let answer = document.createElement("input")
    let label = document.createElement("label")
    answer.type = "checkbox"
    answer.id = "q" + i + ";" + j
    label.htmlFor = answer.id
    label.textContent = choice.title

    answers.append(answer, label, document.createElement("br"))
    j++
  }
  let check = document.createElement("input")
  check.type = "submit"
  check.value = "Check Answer"
  answers.appendChild(check)

  return answers
}

function checkAnswers(form) {
  let choices = form.target.length - 1

  for (let i = 0; i < choices; i++) {
    let choice = form.target[i];
    let t = choice.id.substring(1).split(";");
    let question = pageTest.questions[t[0]];
    let answer = question.choices[t[1]].correct;
    let feedback = document.getElementById("q" + t[0]);

    if (choice.checked !== answer) {
      feedback.classList.add("wrong-answer");
      feedback.textContent = "Incorrect answer"
      break;
    }

    if (i + 1 === choices) {
      feedback.classList.remove("wrong-answer");
      feedback.classList.add("correct-answer");
      feedback.textContent = "Correct! 😎"
    }
  }

  return false
}
