const DEFAULT_DISPLAY = "Mathematical";
let currentOperation = "";
let prevOperand = "";
let currentDisplay = DEFAULT_DISPLAY;
const mathMap = {
  minus: "-",
  plus: "+",
  times: "*",
  divide: "/"
};

const htmlInput = document.getElementById("input");
const buttons = document.querySelectorAll(".btn");

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    initApp();
  }
};

function initApp() {
  htmlInput.value = currentDisplay;
  buttons.forEach((btn) => btn.addEventListener("click", clickHandler));
}

function parseFromTarget(target) {
  const { value } = target;
  const type = target.getAttribute("data-type");
  return { type, value };
}

function clickHandler(evt) {
  const { type, value } = parseFromTarget(evt.target);
  if (type === "operand") {
    operandHandler(value);
  }
  if (type === "number") {
    numberHandler(value);
  }
}

function numberHandler(number) {
  const stringInt = String(number);
  if (currentDisplay === DEFAULT_DISPLAY) {
    currentDisplay = stringInt;
  } else {
    if (prevOperand === "equals") {
      setDisplayValue("");
      currentOperation = "";
    }
    currentDisplay += stringInt;
  }

  currentOperation += `${stringInt}`;
  setDisplayValue(currentDisplay);
}

function operandHandler(operand) {
  prevOperand = operand;
  if (operand === "ce") {
    currentOperation = "";
    setDisplayValue("");
    previousValue = 0;
    currentValue = 0;
  } else if (operand === "equals") {
    setDisplayValue(eval(currentOperation));
  } else {
    currentOperation += ` ${mathMap[operand]} `;
    setDisplayValue(currentOperation);
  }
}

function setDisplayValue(val) {
  currentDisplay = val;
  htmlInput.value = "";
  htmlInput.value = val;
}
