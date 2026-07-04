
const nextAfterSong = document.getElementById("nextAfterSong");

function checkAnswer() {
  const answer = document.getElementById("answer").value.trim().toLowerCase();
  const result = document.getElementById("result");
  const btn = document.getElementById("nextStepBtn");
  const benar = document.getElementById("img-correct");
  const salah = document.getElementById("img-wrong");

  if (answer === "") {
    result.textContent = "INII BARUU KAMUU!!";
    result.style.color = "green";
    benar.classList.remove("hidden");
    salah.classList.add("hidden");
    btn.classList.remove("hidden");
  } else {
    result.textContent = "AH PAYAHHH, COBA LAGI DONG 😏 ";
    result.style.color = "red";
    salah.classList.remove("hidden");
    benar.classList.add("hidden");
    btn.classList.add("hidden");
  }
   
}

function goToStep(step) {
  pauseAllAudio(); // 🔥 INI SAJA TAMBAHANNYA
  document.querySelectorAll(".container")
    .forEach(el => el.classList.add("hidden"));

  document.getElementById("step" + step)
    .classList.remove("hidden");
      
    if (step === 4) {
    gmusic.currentTime = 0;
    gmusic.play().catch(() => {});
  } else {
    gmusic.pause();
  }

    if (step === 1) {
    lagu.loop = true;   // 🔁 REPEAT
    lagu.currentTime = 0;
    lagu.play().catch(() => {});
  } else {
    lagu.pause();
  }
    if (step === 2) {
    page1.currentTime = 0;
    page1.play().catch(() => {});
  } else {
    page1.pause();
  }
    if (step === 5) {
    hbd1.currentTime = 0;
    hbd1.play().catch(() => {});
  } else {
    hbd1.pause();
  }

    // ⬆️ PAKSA SCROLL KE ATAS
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
}

function pauseAllAudio() {
  // pause semua audio step
  if (typeof lagu !== "undefined") lagu.pause();
  if (typeof page1 !== "undefined") page1.pause();
  if (typeof gmusic !== "undefined") gmusic.pause();
  if (typeof hbd !== "undefined") hbd.pause();

  // pause audio music-card
  if (currentAudio) {
    currentAudio.pause();
    if (currentBtn) currentBtn.textContent = "▶️";
    currentAudio = null;
    currentBtn = null;
  }
}


let currentAudio = null;
let currentBtn = null;

document.querySelectorAll(".music-card").forEach(card => {
  const audio = card.querySelector("audio");
  const playBtn = card.querySelector(".playBtn");
  const progress = card.querySelector(".progress");
  const progressContainer = card.querySelector(".progress-container");

  playBtn.addEventListener("click", () => {

    // stop lagu lain
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentBtn.textContent = "▶️";
    }

    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸️";
      currentAudio = audio;
      currentBtn = playBtn;
    } else {
      audio.pause();
      playBtn.textContent = "▶️";
    }
  });

  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
  });

  progressContainer.addEventListener("click", e => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  });

  audio.addEventListener("ended", () => {
    playBtn.textContent = "▶️";
    progress.style.width = "0%";
  });
});



function openMail(btn) {
  // ubah button jadi gambar
  btn.classList.add("opened");
  bomsound.play();

  // delay biar keliatan animasinya
  setTimeout(() => {
    goToStep(1);
  }, 700);
}


/*game*/
const symbols = ["💖","💔","😍","😘","🥰","😆","💘","🤍"];
let cards = [...symbols, ...symbols]; // 16 kartu
let firstCard = null;
let lock = false;
let matched = 0;
let chances = 10;

const grid = document.getElementById("memoryGrid");
const chanceEl = document.getElementById("chance");
const winImg = document.getElementById("winImg");
const wintext1 = document.getElementById("winText");
const wintext2 = document.getElementById("winText");
const nextBtn = document.getElementById("nextBtn");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startMemoryGame() {
  grid.innerHTML = "";
  matched = 0;
  chances = 10;
  chanceEl.textContent = chances;
  winImg.classList.add("hidden");
  winText1.classList.add("hidden");
  winText2.classList.add("hidden");
  nextBtn.classList.add("hidden");

  shuffle(cards).forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.card = symbol;
    card.textContent = "❓";
    grid.appendChild(card);

    card.addEventListener("click", () => handleCard(card));
  });
}

function handleCard(card) {
  if (lock || card.classList.contains("open")) return;

  card.classList.add("open");
  card.textContent = card.dataset.card;

  if (!firstCard) {
    firstCard = card;
  } else {
    lock = true;

    if (firstCard.dataset.card === card.dataset.card) {
      matched += 2;
      firstCard = null;
      lock = false;

      if (matched === 6) {
        winImg.classList.remove("hidden"); // 🎉 MENANG
        nextBtn.classList.remove("hidden");
        winText1.classList.remove("hidden");
        winText2.classList.remove("hidden");
      }
    } else {
      chances--;
      chanceEl.textContent = chances;

      setTimeout(() => {
        firstCard.textContent = "❓";
        card.textContent = "❓";
        firstCard.classList.remove("open");
        card.classList.remove("open");
        firstCard = null;
        lock = false;

        if (chances === 0) {
          alert("💔 Kalah… coba lagi ya!");
          startMemoryGame();
        }
      }, 700);
    }
  }
}

window.addEventListener("beforeunload", function () {
  const iframe = document.querySelector("iframe");
  if (iframe) {
    iframe.src = iframe.src; // reload iframe → stop audio
  }
});