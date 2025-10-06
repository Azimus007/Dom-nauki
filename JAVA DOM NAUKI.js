// Общие функции для всех страниц научного журнала "Дом Науки"

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена: ' + window.location.pathname);
    
    // Инициализация функций для всех страниц
    initCommonFunctions();
    
    // Специфическая инициализация для разных страниц
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'archive.html':
            initArchivePage();
            break;
        case 'contacts.html':
            initContactsPage();
            break;
        case 'authors.html':
            initAuthorsPage();
            break;
        case 'about.html':
            initAboutPage();
            break;
    }
});

// Получить текущую страницу
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Общие функции для всех страниц
function initCommonFunctions() {
    highlightActiveNavigation();
    initSmoothScrolling();
    initBackToTop();
}

// Подсветка активной страницы в навигации
function highlightActiveNavigation() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-btn');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Плавная прокрутка для внутренних ссылок
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Кнопка "Наверх"
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0d2b14;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(backToTopButton);
    
    // Показать/скрыть кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'translateY(0)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'translateY(10px)';
        }
    });
    
    // Обработчик клика
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Функции для главной страницы
function initHomePage() {
    console.log('Инициализация главной страницы');
    loadLatestArticles();
    setupPublicationButtons();
}

// Загрузка последних статей на главной
function loadLatestArticles() {
    const articlesContainer = document.getElementById('articles-list');
    if (!articlesContainer) return;
    
    const articles = getArticlesFromStorage();
    
    if (articles.length === 0) {
        articlesContainer.innerHTML = `
            <div class="content-card" style="grid-column: 1 / -1; text-align: center;">
                <h3>Пока нет опубликованных статей</h3>
                <p>Станьте первым автором нашего журнала!</p>
                <a href="authors.html" class="btn-primary" style="margin-top: 1rem;">Стать автором</a>
            </div>
        `;
        return;
    }
    
    // Показываем только последние 6 статей
    const latestArticles = articles.slice(0, 6);
    
    articlesContainer.innerHTML = latestArticles.map(article => `
        <div class="article-card">
            <h3 class="article-title">${escapeHtml(article.title)}</h3>
            <p><strong>Автор:</strong> ${escapeHtml(article.author)}</p>
            <p class="article-content">${escapeHtml(article.abstract)}</p>
            <div class="article-meta">
                <span class="article-date">Опубликовано: ${article.date}</span>
                <span class="article-status">${article.status}</span>
            </div>
        </div>
    `).join('');
}

// Настройка кнопок публикации
function setupPublicationButtons() {
    const publishBtn = document.querySelector('a[href*="submit-article"]');
    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            if (!document.querySelector('a[href="submit-article.html"]')) {
                e.preventDefault();
                alert('Функция подачи статьи будет доступна в ближайшее время');
            }
        });
    }
}

// Функции для страницы архива
function initArchivePage() {
    console.log('Инициализация страницы архива');
    setupArchiveFilters();
    loadArchiveStatistics();
}

// Настройка фильтров архива
function setupArchiveFilters() {
    const yearFilter = document.getElementById('year-filter');
    const volumeFilter = document.getElementById('volume-filter');
    
    if (yearFilter && volumeFilter) {
        yearFilter.addEventListener('change', filterArchive);
        volumeFilter.addEventListener('change', filterArchive);
    }
}

// Фильтрация архива
function filterArchive() {
    const year = document.getElementById('year-filter').value;
    const volume = document.getElementById('volume-filter').value;
    
    const archiveItems = document.querySelectorAll('.archive-item');
    let visibleCount = 0;
    
    archiveItems.forEach(item => {
        const itemYear = item.closest('.archive-year').querySelector('h3').textContent;
        const isYearMatch = year === 'all' || itemYear.includes(year);
        const isVolumeMatch = volume === 'all' || item.querySelector('h4').textContent.includes(`Том ${volume}`);
        
        if (isYearMatch && isVolumeMatch) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Показываем/скрываем годы без видимых элементов
    document.querySelectorAll('.archive-year').forEach(yearSection => {
        const visibleItems = yearSection.querySelectorAll('.archive-item[style=""]');
        yearSection.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });
    
    console.log(`Показано элементов: ${visibleCount}`);
}

// Загрузка статистики архива
function loadArchiveStatistics() {
    const articles = getArticlesFromStorage();
    const publishedArticles = articles.filter(article => article.status === 'Опубликована');
    
    // Обновляем статистику
    const totalArticles = document.querySelector('.stat-item:nth-child(2) .stat-number');
    if (totalArticles) {
        totalArticles.textContent = publishedArticles.length;
    }
}

// Функции для страницы контактов
function initContactsPage() {
    console.log('Инициализация страницы контактов');
    setupContactForm();
    initMapInteraction();
}

// Настройка формы обратной связи
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                subject: this.querySelectorAll('input[type="text"]')[1].value,
                message: this.querySelector('textarea').value,
                timestamp: new Date().toISOString()
            };
            
            // Сохраняем в localStorage
            saveContactMessage(formData);
            
            // Показываем уведомление
            showNotification('Сообщение отправлено! Мы ответим вам в ближайшее время.', 'success');
            
            // Очищаем форму
            this.reset();
        });
    }
}

// Имитация взаимодействия с картой
function initMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            showNotification('Интерактивная карта будет добавлена в ближайшее время', 'info');
        });
        
        mapPlaceholder.style.cursor = 'pointer';
        mapPlaceholder.title = 'Кликните для просмотра карты';
    }
}

// Функции для страницы "Авторам"
function initAuthorsPage() {
    console.log('Инициализация страницы "Авторам"');
    setupTemplateDownload();
    initSubmissionGuidelines();
}

// Настройка загрузки шаблона
function setupTemplateDownload() {
    const templateBtn = document.querySelector('a[download]');
    if (templateBtn) {
        templateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Шаблон статьи будет доступен для скачивания в ближайшее время', 'info');
        });
    }
}

// Инициализация руководства по подаче
function initSubmissionGuidelines() {
    // Добавляем интерактивность к разделам
    document.querySelectorAll('.content-card h3').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            this.nextElementSibling.classList.toggle('expanded');
        });
    });
}

// Функции для страницы "О журнале"
function initAboutPage() {
    console.log('Инициализация страницы "О журнале"');
    initTeamInteractions();
    loadJournalStats();
}

// Взаимодействия с командой
function initTeamInteractions() {
    document.querySelectorAll('.team-member').forEach(member => {
        member.addEventListener('click', function() {
            const name = this.querySelector('h4').textContent;
            showNotification(`Информация о ${name} будет доступна в ближайшее время`, 'info');
        });
    });
}

// Загрузка статистики журнала
function loadJournalStats() {
    const articles = getArticlesFromStorage();
    const publishedCount = articles.filter(a => a.status === 'Опубликована').length;
    const reviewCount = articles.filter(a => a.status === 'На рецензии').length;
    
    console.log(`Статистика журнала: ${publishedCount} опубликовано, ${reviewCount} на рецензии`);
}

// Вспомогательные функции

// Получить статьи из localStorage
function getArticlesFromStorage() {
    return JSON.parse(localStorage.getItem('domnauki_articles')) || [];
}

// Сохранить сообщение из формы контактов
function saveContactMessage(message) {
    const messages = JSON.parse(localStorage.getItem('domnauki_contacts')) || [];
    messages.push(message);
    localStorage.setItem('domnauki_contacts', JSON.stringify(messages));
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0d2b14'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Генерация тестовых данных (для демонстрации)
function generateSampleData() {
    if (getArticlesFromStorage().length === 0) {
        const sampleArticles = [
            {
                id: 1,
                title: "Новые подходы в машинном обучении",
                author: "Иванов А.С., Петрова М.В.",
                abstract: "В статье рассматриваются инновационные методы машинного обучения...",
                content: "Полный текст статьи...",
                date: "15.12.2024",
                status: "Опубликована",
                keywords: "машинное обучение, искусственный интеллект"
            },
            {
                id: 2,
                title: "Биотехнологии в современной медицине",
                author: "Сидоров П.К.",
                abstract: "Исследование применения биотехнологий в лечении заболеваний...",
                content: "Полный текст статьи...",
                date: "10.12.2024",
                status: "Опубликована",
                keywords: "биотехнологии, медицина, лечение"
            }
        ];
        
        localStorage.setItem('domnauki_articles', JSON.stringify(sampleArticles));
        console.log('Сгенерированы демонстрационные данные');
    }
}

// Генерация демонстрационных данных при первой загрузке
generateSampleData();