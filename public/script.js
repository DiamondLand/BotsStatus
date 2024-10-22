document.addEventListener('DOMContentLoaded', () => {
    const platformSelect = document.getElementById('platformSelect');
    const statusDiv = document.getElementById('status');
    const errorDiv = document.getElementById('error');

    async function checkStatus() {
        const platform = platformSelect.value;

        try {
            const response = await fetch(`/status?platform=${platform}`);
            const data = await response.json();

            // Сброс классов перед обновлением статуса
            statusDiv.classList.remove('status-online', 'error');

            if (data.status === 'working') {
                statusDiv.textContent = data.message;
                statusDiv.classList.add('status-online'); // Добавляем класс для успешного статуса
                errorDiv.textContent = '';
            } else {
                statusDiv.textContent = 'Ошибка';
                statusDiv.classList.add('error'); // Добавляем класс для ошибки
                errorDiv.textContent = data.message;
            }
        } catch (error) {
            statusDiv.textContent = 'Ошибка';
            statusDiv.classList.add('error'); // Добавляем класс для ошибки
            errorDiv.textContent = error.message;
        }
    }

    platformSelect.addEventListener('change', checkStatus);

    // Проверка статуса при загрузке страницы
    checkStatus();
});
