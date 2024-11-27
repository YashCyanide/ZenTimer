class ZenTimer {
    constructor() {
        this.timerDisplay = document.getElementById('timer');
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.actionSelect = document.getElementById('end-action');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.timerId = null;
        this.isRunning = false;

        this.bindEvents();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
    }

    startTimer() {
        if (this.isRunning) return;

        // Convert hours and minutes to seconds
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;

        if (hours === 0 && minutes === 0) {
            alert('Please set a timer duration');
            return;
        }

        this.totalSeconds = (hours * 3600) + (minutes * 60);
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = true;

        this.timerId = setInterval(() => {
            this.updateTimer();
        }, 1000);

        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.resetBtn.disabled = false;
    }

    updateTimer() {
        if (this.remainingSeconds <= 0) {
            this.endTimer();
            return;
        }

        this.remainingSeconds--;
        this.displayTime(this.remainingSeconds);
    }

    displayTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        this.timerDisplay.textContent = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }

    pad(number) {
        return number.toString().padStart(2, '0');
    }

    pauseTimer() {
        if (!this.isRunning) return;

        clearInterval(this.timerId);
        this.isRunning = false;

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    resetTimer() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.remainingSeconds = 0;

        this.timerDisplay.textContent = '00:00:00';
        this.hoursInput.value = '';
        this.minutesInput.value = '';

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = true;
    }

    endTimer() {
        clearInterval(this.timerId);
        this.displayTime(0);

        const selectedAction = this.actionSelect.value;

        // Trigger system action
        window.electronAPI.systemAction(selectedAction);

        // Show motivational quote if applicable
        if (selectedAction === 'quote') {
            const quote = window.electronAPI.getRandomQuote();
            alert(quote);
        }

        // Reset UI
        this.resetTimer();
    }
}

// Initialize timer when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZenTimer();
});