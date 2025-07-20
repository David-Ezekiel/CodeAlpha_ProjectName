class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.previousOperandElement = document.getElementById('previousOperand');
        this.currentOperandElement = document.getElementById('currentOperand');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Button click events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button);
            });
            // Keyboard accessibility: Space/Enter triggers button
            button.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });

        // Keyboard navigation: Tab/Shift+Tab
        const buttons = Array.from(document.querySelectorAll('.btn:not(.empty):not([disabled])'));
        let lastTabIndex = 0;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                if (e.shiftKey) {
                    lastTabIndex = (lastTabIndex - 1 + buttons.length) % buttons.length;
                } else {
                    lastTabIndex = (lastTabIndex + 1) % buttons.length;
                }
                buttons[lastTabIndex].focus();
            }
        });

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    handleButtonClick(button) {
        const action = button.dataset.action;
        const number = button.dataset.number;
        
        if (number) {
            this.appendNumber(number);
        } else if (action) {
            this.handleAction(action);
        }
        
        this.updateDisplay();
    }
    
    handleKeyboardInput(e) {
        // Don't block Tab for accessibility
        if (e.key === 'Tab') return;
        
        e.preventDefault();
        
        const key = e.key;
        
        // Number keys (0-9)
        if (/[0-9]/.test(key)) {
            this.appendNumber(key);
            this.highlightButton(key);
        }
        // Decimal point
        else if (key === '.') {
            this.appendDecimal();
            this.highlightButton('.');
        }
        // Operators
        else if (['+', '-', '*', '/'].includes(key)) {
            this.chooseOperation(this.getOperationFromKey(key));
            this.highlightButton(key);
        }
        // Equals
        else if (key === 'Enter' || key === '=') {
            this.compute();
            this.highlightButton('=');
        }
        // Clear (C)
        else if (key.toLowerCase() === 'c') {
            this.clear();
            this.highlightButton('C');
        }
        // Clear Entry (CE)
        else if (key === 'Delete') {
            this.clearEntry();
            this.highlightButton('CE');
        }
        // Delete
        else if (key === 'Backspace') {
            this.delete();
            this.highlightButton('⌫');
        }
        // Percentage
        else if (key === '%') {
            this.percentage();
            this.highlightButton('%');
        }
        
        this.updateDisplay();
    }
    
    getOperationFromKey(key) {
        const operationMap = {
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide'
        };
        return operationMap[key];
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand.includes('.')) return;
        this.currentOperand += '.';
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'clear-entry':
                this.clearEntry();
                break;
            case 'delete':
                this.delete();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.chooseOperation(action);
                break;
            case 'equals':
                this.compute();
                break;
            case 'percent':
                this.percentage();
                break;
            case 'decimal':
                this.appendDecimal();
                break;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = this.formatNumber(current / 100);
        this.shouldResetScreen = true;
    }
    
    delete() {
        if (this.shouldResetScreen) return;
        
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    clearEntry() {
        this.currentOperand = '0';
        this.shouldResetScreen = false;
    }
    
    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
    
    getOperationSymbol(operation) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[operation] || '';
    }
    
    highlightButton(key) {
        // Map key to button selector
        let selector = '';
        if (/[0-9]/.test(key)) selector = `.btn.number[data-number="${key}"]`;
        else if (key === '.') selector = '.btn.number[data-action="decimal"]';
        else if (key === '+') selector = '.btn.operator[data-action="add"]';
        else if (key === '-') selector = '.btn.operator[data-action="subtract"]';
        else if (key === '*') selector = '.btn.operator[data-action="multiply"]';
        else if (key === '/') selector = '.btn.operator[data-action="divide"]';
        else if (key === '=') selector = '.btn.equals[data-action="equals"]';
        else if (key === 'Enter') selector = '.btn.equals[data-action="equals"]';
        else if (key === 'C' || key === 'c') selector = '.btn.clear[data-action="clear"]';
        else if (key === 'CE' || key === 'Delete') selector = '.btn.clear-entry[data-action="clear-entry"]';
        else if (key === '⌫' || key === 'Backspace') selector = '.btn.operator[data-action="delete"]';
        else return;
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('active-key');
            setTimeout(() => btn.classList.remove('active-key'), 150);
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Add some visual feedback for button presses
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
});

// Add ripple effect for better UX
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 