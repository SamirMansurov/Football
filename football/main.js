document.addEventListener('DOMContentLoaded', function() {
    const ball = document.getElementById('ball');
    const goal1 = document.getElementById('goal1');
    const goal2 = document.getElementById('goal2');
    const goalSound = document.getElementById('goalSound');
    const timerDisplay = document.getElementById('timer');
    let isDragging = false;
    let offsetX, offsetY;
    let lastX = 0;
    let hasScored = false;
    let startTime = null;
    let timerInterval = null;

    function isBallInGoal(goal) {
        const ballRect = ball.getBoundingClientRect();
        const goalRect = goal.getBoundingClientRect();

        return ballRect.left < goalRect.right &&
               ballRect.right > goalRect.left &&
               ballRect.top < goalRect.bottom &&
               ballRect.bottom > goalRect.top;
    }

    function checkGoals() {
        if ((isBallInGoal(goal1) || isBallInGoal(goal2)) && !hasScored) {
            goalSound.currentTime = 0;
            goalSound.play().catch(error => {
                console.log("Ошибка воспроизведения звука:", error);
            });
            hasScored = true;
        } else if (!isBallInGoal(goal1) && !isBallInGoal(goal2)) {
            hasScored = false;
        }
    }

    function startTimer() {
        if (timerInterval) return; // Если таймер уже работает, не начинать новый
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const milliseconds = Math.floor((elapsed % 1000) / 10); // Миллисекунды в сотых долях секунды
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
        }, 10); // Обновление каждые 10 миллисекунд
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    ball.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - ball.getBoundingClientRect().left;
        offsetY = e.clientY - ball.getBoundingClientRect().top;
        lastX = e.clientX;
        startTimer(); // Запуск таймера при начале перетаскивания
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            ball.style.left = e.clientX - offsetX + 'px';
            ball.style.top = e.clientY - offsetY + 'px';

            checkGoals(); // Проверяем попадание мяча в ворота

            lastX = e.clientX;
        }
    };

    document.onmouseup = function() {
        isDragging = false;
        stopTimer(); // Остановка таймера при завершении перетаскивания
    };
});