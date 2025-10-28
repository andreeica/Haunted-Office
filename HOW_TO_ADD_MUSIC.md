# 🎵 Как добавить музыку в проект

## Вариант 1: Локальные файлы (Рекомендуется)

### Шаг 1: Скачайте музыку

1. **Star Wars Prologue** (фоновая музыка):
   - Найдите: "Star Wars Main Title John Williams"
   - Конвертируйте в MP3

2. **Backend Team (Star Wars)**:
   - `imperial-march.mp3` - Imperial March Theme
   - `darth-vader.mp3` - Darth Vader Theme  
   - `starwars-background.mp3` - любой Star Wars фон

3. **Frontend Team (Фиксики)**:
   - `fixiki-theme.mp3` - песня "Кто такие фиксики"
   - `fixiki-background.mp3` - фоновая музыка из мультика

4. **QA Team (Matrix)**:
   - `matrix-theme.mp3` - главная тема Matrix
   - `matrix-background.mp3` - Matrix background sounds

5. **BA/Support Team (Mystics)**:
   - `mystics-theme.mp3` - мистическая музыка
   - `mystics-background.mp3` - ambient звуки

6. **DevOps Team (Infrastructure)**:
   - `infra-theme.mp3` - техно/электро музыка
   - `infra-background.mp3` - инфраструктурная тема

### Шаг 2: Поместите файлы в папку `audio/`

Структура должна быть:
```
Haunted-Office/
  audio/
    ├── prologue.mp3
    ├── imperial-march.mp3
    ├── darth-vader.mp3
    ├── starwars-background.mp3
    ├── fixiki-theme.mp3
    ├── fixiki-background.mp3
    ├── matrix-theme.mp3
    ├── matrix-background.mp3
    ├── mystics-theme.mp3
    ├── mystics-background.mp3
    ├── infra-theme.mp3
    └── infra-background.mp3
```

### Шаг 3: Обновите index.html

Если нужно изменить названия файлов, найдите в `index.html`:
```html
<audio id="backgroundAudio" loop>
  <source src="audio/prologue.mp3" type="audio/mpeg">
</audio>
```

И замените `prologue.mp3` на имя вашего файла.

---

## Вариант 2: Онлайн музыка (Альтернатива)

### Использование YouTube или других источников

1. Найдите нужные треки на YouTube
2. Используйте YouTube to MP3 конвертеры:
   - https://www.y2mate.com/
   - https://onlinevideoconverter.com/

3. Или используйте прямые ссылки (если есть)

---

## Вариант 3: Конвертация из видео

### Инструменты для конвертации

1. **FFmpeg** (командная строка):
```bash
ffmpeg -i input_video.mp4 -vn -acodec mp3 output_audio.mp3
```

2. **VLC Media Player**:
   - Media → Convert/Save
   - Выберите формат MP3
   - Конвертируйте

3. **Онлайн конвертеры**:
   - https://convertio.co/
   - https://cloudconvert.com/

---

## Тестирование

После добавления музыки:

1. Откройте `index.html` в браузере
2. Нажмите F12 для открытия консоли
3. Проверьте что файлы загружаются
4. При наведении на команду должна играть музыка

### Если музыка не играет:

1. Проверьте консоль браузера (F12)
2. Убедитесь что файлы в правильной папке
3. Проверьте формат файлов (должен быть MP3)
4. Проверьте права доступа к файлам

---

## Рекомендации

- **Качество:** Используйте MP3 с битрейтом 128-192 kbps
- **Длительность:** Фоновые треки 30-60 секунд (зациклены)
- **Theme треки:** 15-30 секунд
- **Размер файлов:** Старайтесь держать каждый файл < 5MB

**Скачать готовые файлы можно с:**
- YouTube (с конвертацией)
- Freesound.org (бесплатная музыка)
- Incompetech.com (бесплатная музыка для проектов)

