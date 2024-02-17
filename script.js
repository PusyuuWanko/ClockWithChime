/*****************************************
  *----------------------------------
  |  ThisScriptVersion: 1.12.0    |
  |  © 2021-2024 By PusyuuWanko/  |
  |  LastUpdate: 2024-02-17       |
  |  License: MITLicense          |
  |  ClockWithTimeSignal          |
----------------------------------*
******************************************/

document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('background-select');
  const body = document.body;
  const uploadInput = document.getElementById('upload-input');
  const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
  const selectedLocalStorageKey = 'ClockChime_selectedImage';

  const selectedImage = localStorage.getItem(selectedLocalStorageKey);
  if (selectedImage) {
    body.style.backgroundImage = `url(${selectedImage})`;
    select.value = selectedImage;
  }

  select.addEventListener('change', function() {
    const selectedImage = select.value;
    body.style.backgroundImage = `url(${selectedImage})`;
    localStorage.setItem(selectedLocalStorageKey, selectedImage);
  });

  uploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file.size > maxFileSize) {
      alert('The file size exceeds the maximum limit of 1MB.');
      return;
    }

    reader.onload = function() {
      const uploadedImage = reader.result;
      const randomThreeDigitNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const imageName = 'Your wallpaper' + randomThreeDigitNumber;
      localStorage.setItem(imageName, uploadedImage);
      addImageOption(imageName, uploadedImage);
    };
    reader.readAsDataURL(file);
  });

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('Your wallpaper')) {
      const uploadedImage = localStorage.getItem(key);
      addImageOption(key, uploadedImage);
    }
  }

  function addImageOption(imageName, uploadedImage) {
    const option = document.createElement('option');
    option.value = uploadedImage;
    option.text = imageName;
    select.add(option);

    if (uploadedImage === selectedImage) {
      option.selected = true;
    }
  }

  function applyBackgroundStyles() {
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
  }

  applyBackgroundStyles();

  function addPreloadedImages() {
    const preloadedImages = [
      './1.jpg',
      './2.jpg'
    ];
    addImageOption("Select Wallpaper", "");
    preloadedImages.forEach(function(image, index) {
      const wallpaperNumber = (index + 1).toString();
      const imageName = 'wallpaper ' + wallpaperNumber;
      addImageOption(imageName, image);
    });
  }

  addPreloadedImages();

  function updateClockAndCalendar() {
    // 現在の時刻と日付を取得
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    const formattedTime = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;

    function addZero(number) {
      return number < 10 ? `0${number}` : number;
    }

    // 時刻表示の要素を取得
    const clock = document.getElementById("clock");
    clock.textContent = formattedTime;

    playChime(hour, min, sec);

    // カレンダー表示の要素を取得
    const calendar = document.getElementById("calendar");

    calendar.textContent = "";

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const clockRow = document.createElement("tr");
    const clockCell = document.createElement("td");
    clockCell.colSpan = 7;
    clockCell.appendChild(clock);
    clockRow.appendChild(clockCell);
    tbody.appendChild(clockRow);

    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);

    // 年と月を表示する部分を追加
    const yearMonthRow = document.createElement("tr");
    const yearMonthCell = document.createElement("td");
    yearMonthCell.classList.add("yearMonth");
    yearMonthCell.colSpan = 7;
    yearMonthCell.textContent = `${year}年${month}月`;
    yearMonthRow.appendChild(yearMonthCell);
    tbody.appendChild(yearMonthRow);

    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekdaysRow = document.createElement("tr");
    for (let i = 0; i < weekdays.length; i++) {
      const th = document.createElement("th");
      th.textContent = weekdays[i];
      weekdaysRow.appendChild(th);
    }
    tbody.appendChild(weekdaysRow);

    for (let i = 0; i < 6; i++) {
      const dateRow = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const dateCell = document.createElement("td");
        const date = i * 7 + j - firstDate.getDay() + 1;
        if (date > 0 && date <= lastDate.getDate()) {
          dateCell.textContent = date;
          if (date === day) {
            dateCell.classList.add("current-date");
          }
        }
        dateRow.appendChild(dateCell);
      }
      tbody.appendChild(dateRow);
    }

    calendar.appendChild(table);
  }

  const chimeStorageKey = 'ClockChime_selectedChime';
  const chimeIndexStorageKey00 = 'ClockChime_selectedChimeIndex00';
  const chimeIndexStorageKey30 = 'ClockChime_selectedChimeIndex30';
  const selectChime00 = document.getElementById('chime00-select');
  const selectChime30 = document.getElementById('chime30-select');
  const uploadChimeInput = document.getElementById('upload-chime');

  if (selectChime00 && selectChime30 && uploadChimeInput) {
    const storageChKey = 'selectedChimes';

    uploadChimeInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (file.size > maxFileSize) {
        alert('The file size exceeds the maximum limit of 1MB.');
        return;
      }

      reader.onload = function() {
        const uploadedChime = reader.result;
        const randomThreeDigitNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const chimeName = 'Your chime' + randomThreeDigitNumber;
        localStorage.setItem(chimeName, uploadedChime);
        addChimeOption(chimeName, uploadedChime);
      };
      reader.readAsDataURL(file);
    });

    // 事前に読み込むチャイムのリスト
    function addPreloadedChimes() {
      const preloadedChimes = [
        './1.mp3',
        './2.mp3'
      ];
      preloadedChimes.forEach(function(chime, index) {
        const chimeNumber = (index + 1).toString();
        const chimeName = 'chimeSound ' + chimeNumber;
        addChimeOption(chimeName, chime);
      });
    }
    addPreloadedChimes();

    function addChimeOption(chimeName, uploadedChime) {
      const option = document.createElement('option');
      option.value = uploadedChime;
      option.text = chimeName;
      selectChime00.add(option);
      selectChime30.add(option.cloneNode(true));

      // 新しいオプションが追加された時にローカルストレージに保存
      saveChimeToLocalStorage(chimeName, uploadedChime);
    }

    function saveChimeToLocalStorage(chimeName, uploadedChime) {
      let selectedChimes = JSON.parse(localStorage.getItem(storageChKey)) || {};

      selectedChimes[chimeName] = uploadedChime;
      localStorage.setItem(storageChKey, JSON.stringify(selectedChimes));
    }

    function loadChimesFromLocalStorage() {
      const selectedChimes = JSON.parse(localStorage.getItem(storageChKey)) || {};

      // チャイムの選択肢をクリア
      selectChime00.innerHTML = "";
      selectChime30.innerHTML = "";

      for (const chimeName in selectedChimes) {
        if (selectedChimes.hasOwnProperty(chimeName)) {
          addChimeOption(chimeName, selectedChimes[chimeName]);
        }
      }

      selectChime00.selectedIndex = localStorage.getItem(chimeIndexStorageKey00);
      selectChime30.selectedIndex = localStorage.getItem(chimeIndexStorageKey30);
    }

    // ページ読み込み時にローカルストレージからチャイムを読み込む
    loadChimesFromLocalStorage();

    // チャイム選択が変更された時の処理
    selectChime00.addEventListener('change', function() {
      const selectedChimeName = selectChime00.options[selectChime00.selectedIndex].text;
      const selectedChimeValue = selectChime00.value;

      // 選択されたチャイムをローカルストレージに保存
      saveChimeToLocalStorage(selectedChimeName, selectedChimeValue);

      // 選択されたチャイムの位置をローカルストレージに保存
      localStorage.setItem(chimeIndexStorageKey00, selectChime00.selectedIndex);
    });

    selectChime30.addEventListener('change', function() {
      const selectedChimeName = selectChime30.options[selectChime30.selectedIndex].text;
      const selectedChimeValue = selectChime30.value;

      // 選択されたチャイムをローカルストレージに保存
      saveChimeToLocalStorage(selectedChimeName, selectedChimeValue);

      // 選択されたチャイムの位置をローカルストレージに保存
      localStorage.setItem(chimeIndexStorageKey30, selectChime30.selectedIndex);
    });
  }

  // チャイム再生機能
  function playChime(hour, min, sec) {
    if (!isChimeEnabled) {
      return;
    }

    if (min === 0 && sec === 0) {
      const my_audio = new Audio(selectChime00.value);
      my_audio.currentTime = 0;
      my_audio.play();
    }
    if (min === 30 && sec === 0) {
      const my_audio = new Audio(selectChime30.value);
      my_audio.currentTime = 0;
      my_audio.play();
    }
  }

  const chimeToggle = document.getElementById("chime-toggle");
  chimeToggle.textContent = "チャイムオフ🔇";
  chimeToggle.addEventListener("click", function() {
    isChimeEnabled = !isChimeEnabled;

    if (isChimeEnabled) {
      chimeToggle.textContent = "チャイムオン🔊";
    } else {
      chimeToggle.textContent = "チャイムオフ🔇";
    }
  });

  let isChimeEnabled = false;

  // 1秒ごとに時計とカレンダーを更新
  setInterval(updateClockAndCalendar, 1000);
});