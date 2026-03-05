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

      progressFills.forEach((bar) => {
        bar.style.width = "0%";
      });

      setTimeout(() => {
        isTransitioning = false;
      }, 500);
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

    let width = 0;
    const step = 0.5;
    const interval = 50;

    timerInterval = setInterval(() => {
      width += step;

      if (width >= 100) {
        width = 100;
        currentProgressFill.style.width = width + "%";

        clearInterval(timerInterval);

        currentIndex = (currentIndex + 1) % progressFills.length;
        switchToSlide(currentIndex);
        startProgress();
      } else {
        currentProgressFill.style.width = width + "%";
      }
    }, interval);
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

    card.addEventListener("mouseleave", function () {
      card.style.transform = "scale(1)";
    });
  });

  const carousel = document.querySelector(".services-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    });

    carousel.addEventListener("mouseleave", () => {
      startProgress();
    });
  }

  switchToSlide(0);
  startProgress();
});
