import "./styles/main.css";

document.addEventListener("DOMContentLoaded", function () {
  const bgSlides = document.querySelectorAll(".hero__slide");
  const serviceCards = document.querySelectorAll(".service-card");
  const progressBars = document.querySelectorAll(".progress-bar");
  const progressFills = document.querySelectorAll(".progress-bar__fill");

  if (progressFills.length === 0) {
    return;
  }

  let currentIndex = 0;
  let timerInterval;
  let isTransitioning = false;
  let isPaused = false;
  let currentWidth = 0;
  let progressInterval = 40;
  let progressStep = 0.5;

  const mobileTitles = [
    "Ангел Concept — центр премиум-косметологии в Ставрополе",
    "Косметология: уходы, инъекции, лифтинг",
    "Коррекция фигуры и силуэта",
    "SPA и европейские массажи",
    "Велнес-программы и флотация",
    "Beauty услуги: волосы, ногти, макияж",
    "Тайские и балийские массажи",
  ];

  function updateMobileTitles(index) {
    const mobileHeroTitle = document.getElementById("mobile-hero-title");
    if (mobileHeroTitle && mobileTitles[index]) {
      mobileHeroTitle.innerHTML = mobileTitles[index];
    }
  }

  function switchToSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;

    bgSlides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add("exiting");
      }
    });

    setTimeout(() => {
      bgSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add("active");
          slide.classList.remove("exiting");
        } else {
          slide.classList.remove("active", "exiting");
        }
      });

      serviceCards.forEach((card, i) => {
        if (i === index) {
          card.classList.add("service-card--active");
          card.style.animation = "cardAppear 0.5s ease forwards";
        } else {
          card.classList.remove("service-card--active");
          card.style.animation = "cardDisappear 0.3s ease forwards";
        }
      });

      progressFills.forEach((bar, i) => {
        if (i !== index) {
          bar.classList.add("progress-bar__fill--inactive");
          bar.style.width = "100%";
        } else {
          bar.classList.remove("progress-bar__fill--inactive");

          bar.style.transition = "none";
          bar.style.width = "0%";

          setTimeout(() => {
            bar.style.transition = "width 0.1s linear";
          }, 10);
        }
      });
      currentWidth = 0;

      updateMobileTitles(index);

      setTimeout(() => {
        isTransitioning = false;
      }, 1200);
    }, 100);
  }

  function startProgress() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const currentProgressFill = progressFills[currentIndex];
    if (!currentProgressFill) {
      return;
    }

    if (!isPaused) {
      currentWidth = 0;
    }

    timerInterval = setInterval(() => {
      if (isPaused) return;

      currentWidth += progressStep;

      if (currentWidth >= 100) {
        currentWidth = 100;
        currentProgressFill.style.width = currentWidth + "%";

        clearInterval(timerInterval);

        currentIndex = (currentIndex + 1) % progressFills.length;
        switchToSlide(currentIndex);
        startProgress();
      } else {
        currentProgressFill.style.width = currentWidth + "%";
      }
    }, progressInterval);
  }

  function pauseProgress() {
    if (!isPaused && timerInterval) {
      isPaused = true;

      const currentProgressFill = progressFills[currentIndex];
      if (currentProgressFill) {
        currentWidth = parseFloat(currentProgressFill.style.width) || 0;
      }
    }
  }

  function resumeProgress() {
    if (isPaused) {
      isPaused = false;

      const currentProgressFill = progressFills[currentIndex];
      if (currentProgressFill) {
        currentProgressFill.style.width = currentWidth + "%";
      }
    }
  }

  serviceCards.forEach((card, index) => {
    card.addEventListener("click", function () {
      if (index !== currentIndex && !isTransitioning) {
        currentIndex = index;
        switchToSlide(currentIndex);

        clearInterval(timerInterval);
        setTimeout(() => {
          startProgress();
        }, 500);
      }
    });
  });

  const carousel = document.querySelector(".services-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      pauseProgress();
    });

    carousel.addEventListener("mouseleave", () => {
      resumeProgress();
    });
  }

  switchToSlide(0);
  startProgress();
  updateMobileTitles(0);
});
