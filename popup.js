let currentInput = '0';
let previousInput = '';
let operator = '';
let waitingForOperand = false;
let justCalculated = false;

const display = document.getElementById('display');
const history = document.getElementById('history');

document.addEventListener('DOMContentLoaded', function() {
        let currentInput = '0';
        let previousInput = '';
        let operator = '';
        let waitingForOperand = false;
        let justCalculated = false;

        const display = document.getElementById('display');
        const history = document.getElementById('history');

        function updateDisplay() {
            const value = parseFloat(currentInput);
            if (isNaN(value)) {
                display.textContent = 'Error';
                display.classList.add('error');
                return;
            }
            display.classList.remove('error');
            if (currentInput.length > 9) {
                if (value >= 1e9 || (value <= 1e-6 && value > 0) || (value >= -1e-6 && value < 0) || value <= -1e9) {
                    display.textContent = value.toExponential(3);
                } else {
                    display.textContent = value.toPrecision(6);
                }
            } else {
                display.textContent = currentInput;
            }
            if (display.textContent.length > 12) {
                display.style.fontSize = '28px';
            } else if (display.textContent.length > 8) {
                display.style.fontSize = '32px';
            } else {
                display.style.fontSize = '40px';
            }
        }

        function updateHistory() {
            if (previousInput && operator && !waitingForOperand) {
                const opSymbol = {
                    '+': '+',
                    '-': '−',
                    '*': '×',
                    '/': '÷'
                }[operator] || operator;
                history.textContent = `${previousInput} ${opSymbol} ${currentInput}`;
            } else {
                history.textContent = '';
            }
        }

        function clearOperatorStates() {
            document.querySelectorAll('.operator').forEach(btn => {
                btn.classList.remove('active');
            });
        }

        function appendNumber(number) {
            if (waitingForOperand) {
                currentInput = number;
                waitingForOperand = false;
            } else if (justCalculated) {
                currentInput = number;
                justCalculated = false;
                previousInput = '';
                operator = '';
                history.textContent = '';
            } else {
                currentInput = currentInput === '0' ? number : currentInput + number;
            }
            updateDisplay();
            clearOperatorStates();
        }

        function appendDecimal() {
            if (waitingForOperand) {
                currentInput = '0.';
                waitingForOperand = false;
            } else if (justCalculated) {
                currentInput = '0.';
                justCalculated = false;
                previousInput = '';
                operator = '';
                history.textContent = '';
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
            clearOperatorStates();
        }

        function setOperator(nextOperator) {
            const inputValue = parseFloat(currentInput);
            if (isNaN(inputValue)) {
                return;
            }
            if (previousInput === '') {
                previousInput = currentInput;
            } else if (operator && !waitingForOperand) {
                const prevValue = parseFloat(previousInput);
                const result = performCalculation(prevValue, inputValue, operator);
                if (isNaN(result) || !isFinite(result)) {
                    currentInput = 'Error';
                    updateDisplay();
                    return;
                }
                currentInput = String(result);
                previousInput = currentInput;
                updateDisplay();
            }
            justCalculated = false;
            waitingForOperand = true;
            operator = nextOperator;
            clearOperatorStates();
            const operatorButtons = {
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide'
            };
            if (operatorButtons[nextOperator]) {
                document.getElementById(operatorButtons[nextOperator]).classList.add('active');
            }
            updateHistory();
        }

        function calculate() {
            const inputValue = parseFloat(currentInput);
            if (previousInput === '' || operator === '' || waitingForOperand) {
                return;
            }
            const prevValue = parseFloat(previousInput);
            const result = performCalculation(prevValue, inputValue, operator);
            if (isNaN(result) || !isFinite(result)) {
                currentInput = 'Error';
                previousInput = '';
                operator = '';
                waitingForOperand = false;
                updateDisplay();
                return;
            }
            updateHistory();
            currentInput = String(result);
            previousInput = '';
            operator = '';
            waitingForOperand = false;
            justCalculated = true;
            updateDisplay();
            clearOperatorStates();
            setTimeout(() => {
                history.textContent = '';
            }, 2000);
        }

        function performCalculation(firstOperand, secondOperand, operator) {
            switch (operator) {
                case '+':
                    return firstOperand + secondOperand;
                case '-':
                    return firstOperand - secondOperand;
                case '*':
                    return firstOperand * secondOperand;
                case '/':
                    return secondOperand !== 0 ? firstOperand / secondOperand : NaN;
                default:
                    return secondOperand;
            }
        }

        function clearAll() {
            currentInput = '0';
            previousInput = '';
            operator = '';
            waitingForOperand = false;
            justCalculated = false;
            updateDisplay();
            clearOperatorStates();
            history.textContent = '';
        }

        function toggleSign() {
            if (currentInput !== '0') {
                currentInput = currentInput.charAt(0) === '-' 
                    ? currentInput.slice(1) 
                    : '-' + currentInput;
                updateDisplay();
            }
        }

        function percentage() {
            const value = parseFloat(currentInput);
            if (!isNaN(value)) {
                currentInput = String(value / 100);
                updateDisplay();
            }
        }

        document.querySelectorAll('.btn.number[data-number]').forEach(btn => {
            btn.addEventListener('click', function() {
                appendNumber(btn.getAttribute('data-number'));
            });
        });
        const decimalBtn = document.getElementById('decimal');
        if (decimalBtn) {
            decimalBtn.addEventListener('click', appendDecimal);
        }
        const operatorMap = {
            add: '+',
            subtract: '-',
            multiply: '*',
            divide: '/'
        };
        Object.keys(operatorMap).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', function() {
                    setOperator(operatorMap[id]);
                });
            }
        });
        const equalsBtn = document.getElementById('equals');
        if (equalsBtn) {
            equalsBtn.addEventListener('click', calculate);
        }
        const acBtn = document.getElementById('ac');
        if (acBtn) {
            acBtn.addEventListener('click', clearAll);
        }
        const signBtn = document.getElementById('sign');
        if (signBtn) {
            signBtn.addEventListener('click', toggleSign);
        }
        const percentBtn = document.getElementById('percent');
        if (percentBtn) {
            percentBtn.addEventListener('click', percentage);
        }

        document.addEventListener('keydown', (event) => {
            const key = event.key;
            event.preventDefault();
            if (key >= '0' && key <= '9') {
                appendNumber(key);
            } else if (key === '.') {
                appendDecimal();
            } else if (key === '+') {
                setOperator('+');
            } else if (key === '-') {
                setOperator('-');
            } else if (key === '*') {
                setOperator('*');
            } else if (key === '/') {
                setOperator('/');
            } else if (key === 'Enter' || key === '=') {
                calculate();
            } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                clearAll();
            } else if (key === 'Backspace') {
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateDisplay();
            } else if (key === '%') {
                percentage();
            }
        });

        updateDisplay();
    });
