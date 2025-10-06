<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Логируем данные для отладки
    error_log("Форма получена: " . date('Y-m-d H:i:s'));
    error_log("Данные POST: " . print_r($_POST, true));
    error_log("Данные FILES: " . print_r($_FILES, true));
    
    // Получаем данные из формы
    $author_email = htmlspecialchars($_POST['author_email']);
    $article_title = htmlspecialchars($_POST['article_title']);
    
    // Получаем данные авторов
    $authors = [];
    for ($i = 1; $i <= 5; $i++) {
        if (!empty($_POST["author{$i}_name"])) {
            $authors[] = [
                'name' => htmlspecialchars($_POST["author{$i}_name"]),
                'affiliation' => htmlspecialchars($_POST["author{$i}_affiliation"])
            ];
        }
    }
    
    $article_file = $_FILES['article_file'];
    
    // Ваш email
    $to = "ulugbek.vepayevich@gmail.com";
    $subject = "Новая статья для журнала 'Дом Науки'";
    
    // Создаем красивый HTML контент для письма
    $authors_html = "";
    foreach ($authors as $index => $author) {
        $number = $index + 1;
        $authors_html .= "
        <tr>
            <td><strong>Автор $number:</strong></td>
            <td>{$author['name']}</td>
        </tr>
        <tr>
            <td><strong>Организация $number:</strong></td>
            <td>{$author['affiliation']}</td>
        </tr>
        <tr><td colspan='2' style='border-bottom: 1px solid #ddd;'></td></tr>
        ";
    }
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #0d2b14; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .section { margin-bottom: 20px; padding: 15px; background: white; border-left: 4px solid #0d2b14; }
            .section-title { color: #0d2b14; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .file-info { background: #e8f5e8; padding: 10px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Дом Науки - Новая статья</h2>
            </div>
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>Информация о статье</div>
                    <table>
                        <tr><td><strong>Название статьи:</strong></td><td>$article_title</td></tr>
                        <tr><td><strong>Email для связи:</strong></td><td>$author_email</td></tr>
                    </table>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Авторы статьи</div>
                    <table>
                        $authors_html
                    </table>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Файл статьи</div>
                    <div class='file-info'>
                        <strong>Имя файла:</strong> " . $article_file['name'] . "<br>
                        <strong>Размер:</strong> " . round($article_file['size'] / 1024, 2) . " KB<br>
                        <strong>Тип:</strong> " . $article_file['type'] . "
                    </div>
                </div>
                
                <div class='section'>
                    <div class='section-title'>Техническая информация</div>
                    <table>
                        <tr><td><strong>Дата отправки:</strong></td><td>" . date('d.m.Y H:i:s') . "</td></tr>
                        <tr><td><strong>IP адрес:</strong></td><td>" . $_SERVER['REMOTE_ADDR'] . "</td></tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Заголовки для HTML письма
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Дом Науки <noreply@dom-nauki.ru>" . "\r\n";
    $headers .= "Reply-To: $author_email" . "\r\n";
    
    // Пытаемся отправить письмо
    error_log("Пытаемся отправить письмо на: $to");
    
    if (mail($to, $subject, $message, $headers)) {
        error_log("Письмо успешно отправлено");
        header('Location: success.html');
        exit;
    } else {
        error_log("ОШИБКА: Письмо не отправлено");
        header('Location: error.html');
        exit;
    }
} else {
    error_log("ОШИБКА: Форма не отправлена методом POST");
    header('Location: submit-article.html');
    exit;
}
?>