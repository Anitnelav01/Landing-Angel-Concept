import "./styles/main.css";

document.addEventListener("DOMContentLoaded", function () {
  const bgSlides = document.querySelectorAll(".hero__slide");
  const serviceCards = document.querySelectorAll(".service-card");
  let progressBars = document.querySelectorAll(".progress-bar");
  let progressFills = document.querySelectorAll(".progress-bar__fill");
  const heroSection = document.querySelector(".hero");

  if (progressFills.length === 0) {
    console.error("Progress bars not found!");
    return;
  }

  let isMobile = window.innerWidth <= 1200;
  const desktopSlidesCount = 6;
  const mobileSlidesCount = 7;

  let activeSlidesCount = isMobile ? mobileSlidesCount : desktopSlidesCount;

  let currentIndex = 0;
  let timerInterval;
  let isTransitioning = false;
  let isPaused = false;
  let currentWidth = 0;
  let progressInterval = 40;
  let progressStep = 0.5;

  let touchStartX = 0;
  let touchEndX = 0;
  let minSwipeDistance = 50;

  const mobileTitles = [
    "Ангел Concept — центр премиум-косметологии в Ставрополе",
    "Косметология: уходы, инъекции, лифтинг",
    "Коррекция фигуры и силуэта",
    "SPA и европейские массажи",
    "Велнес-программы и флотация",
    "Beauty услуги: волосы, ногти, макияж",
    "Тайские и балийские массажи",
  ];

  function getVisibleElements() {
    const allSlides = document.querySelectorAll(".swiper-slide");
    const visibleSlides = [];
    const visibleProgressFills = [];
    const visibleCards = [];

    allSlides.forEach((slide, index) => {
      if (index < activeSlidesCount) {
        visibleSlides.push(slide);
        const fill = slide.querySelector(".progress-bar__fill");
        if (fill) visibleProgressFills.push(fill);

        const card = serviceCards[index];
        if (card) visibleCards.push(card);
      }
    });

    return { visibleSlides, visibleProgressFills, visibleCards };
  }

  function updateSlidesCount() {
    const newIsMobile = window.innerWidth <= 1200;
    const newCount = newIsMobile ? mobileSlidesCount : desktopSlidesCount;

    if (newCount !== activeSlidesCount) {
      activeSlidesCount = newCount;
      isMobile = newIsMobile;

      if (currentIndex >= activeSlidesCount) {
        currentIndex = activeSlidesCount - 1;
        switchToSlide(currentIndex);
        restartProgress();
      }

      updateSlidesVisibility();
    }
  }

  function updateSlidesVisibility() {
    const swiperSlides = document.querySelectorAll(".swiper-slide");

    swiperSlides.forEach((slide, index) => {
      if (index < activeSlidesCount) {
        slide.style.display = "block";
        slide.style.opacity = "1";
        slide.style.visibility = "visible";
      } else {
        slide.style.display = "none";
        slide.style.opacity = "0";
        slide.style.visibility = "hidden";
      }
    });

    progressFills = document.querySelectorAll(
      '.swiper-slide:not([style*="display: none"]) .progress-bar__fill',
    );
  }

  function updateMobileTitles(index) {
    const mobileHeroTitle = document.getElementById("mobile-hero-title");
    if (mobileHeroTitle && mobileTitles[index] && index < mobileTitles.length) {
      mobileHeroTitle.innerHTML = mobileTitles[index];
    }
  }

  function switchToSlide(index) {
    if (isTransitioning) return;

    if (index >= activeSlidesCount) {
      index = 0;
    }

    isTransitioning = true;

    bgSlides.forEach((slide, i) => {
      slide.classList.remove("active", "exiting");
      if (i === index) {
        slide.classList.add("active");
      } else if (i === currentIndex) {
        slide.classList.add("exiting");
      }
    });

    serviceCards.forEach((card, i) => {
      if (i >= activeSlidesCount) return;

      card.classList.remove("service-card--active");
      if (i === index) {
        card.classList.add("service-card--active");
        card.style.animation = "cardAppear 0.5s ease forwards";
      } else {
        card.style.animation = "cardDisappear 0.3s ease forwards";
      }
    });

    const { visibleProgressFills } = getVisibleElements();

    visibleProgressFills.forEach((bar, i) => {
      if (i !== index) {
        bar.classList.add("progress-bar__fill--inactive");
        bar.style.transition = "none";
        bar.style.width = "100%";
      }
    });

    const activeProgressFill = visibleProgressFills[index];
    if (activeProgressFill) {
      activeProgressFill.classList.remove("progress-bar__fill--inactive");
      activeProgressFill.style.transition = "none";
      activeProgressFill.style.width = "0%";

      void activeProgressFill.offsetHeight;

      setTimeout(() => {
        activeProgressFill.style.transition = "width 0.1s linear";
      }, 20);
    } else {
      console.error("Progress fill not found for index:", index);
    }

    currentWidth = 0;

    if (isMobile) {
      updateMobileTitles(index);
    }

    currentIndex = index;

    setTimeout(() => {
      isTransitioning = false;
    }, 1200);
  }

  function nextSlide() {
    if (!isTransitioning) {
      const nextIndex = (currentIndex + 1) % activeSlidesCount;
      switchToSlide(nextIndex);
      restartProgress();
    }
  }

  function prevSlide() {
    if (!isTransitioning) {
      const prevIndex =
        (currentIndex - 1 + activeSlidesCount) % activeSlidesCount;
      switchToSlide(prevIndex);
      restartProgress();
    }
  }

  function restartProgress() {
    clearInterval(timerInterval);
    setTimeout(() => {
      startProgress();
    }, 500);
  }

  function startProgress() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    if (currentIndex >= activeSlidesCount) {
      currentIndex = 0;
    }

    const { visibleProgressFills } = getVisibleElements();
    const currentProgressFill = visibleProgressFills[currentIndex];

    if (!currentProgressFill) {
      console.error("Current progress fill not found for index:", currentIndex);
      return;
    }

    currentProgressFill.classList.remove("progress-bar__fill--inactive");
    currentProgressFill.style.transition = "none";
    currentProgressFill.style.width = "0%";

    void currentProgressFill.offsetHeight;

    setTimeout(() => {
      currentProgressFill.style.transition = "width 0.1s linear";
    }, 10);

    if (!isPaused) {
      currentWidth = 0;
    }

    timerInterval = setInterval(() => {
      if (isPaused || isTransitioning) return;

      currentWidth += progressStep;

      if (currentWidth >= 100) {
        currentWidth = 100;
        currentProgressFill.style.width = "100%";

        clearInterval(timerInterval);

        const nextIndex = (currentIndex + 1) % activeSlidesCount;
        switchToSlide(nextIndex);
        startProgress();
      } else {
        currentProgressFill.style.width = currentWidth + "%";
      }
    }, progressInterval);
  }

  function pauseProgress() {
    if (!isPaused && timerInterval) {
      isPaused = true;

      const { visibleProgressFills } = getVisibleElements();
      const currentProgressFill = visibleProgressFills[currentIndex];

      if (currentProgressFill) {
        currentWidth = parseFloat(currentProgressFill.style.width) || 0;
      }
    }
  }

  function resumeProgress() {
    if (isPaused) {
      isPaused = false;
    }
  }

  serviceCards.forEach((card, index) => {
    card.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      if (
        index < activeSlidesCount &&
        index !== currentIndex &&
        !isTransitioning
      ) {
        serviceCards.forEach((c) => {
          c.style.pointerEvents = "none";
        });

        switchToSlide(index);
        restartProgress();

        setTimeout(() => {
          serviceCards.forEach((c) => {
            c.style.pointerEvents = "auto";
          });
        }, 600);
      }
    });

    card.setAttribute("data-slide-index", index);
  });

  const carousel = document.querySelector(".services-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", pauseProgress);
    carousel.addEventListener("mouseleave", resumeProgress);
  }

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    pauseProgress();
  }

  function handleTouchMove(e) {
    if (Math.abs(e.changedTouches[0].screenX - touchStartX) > 10) {
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();

    setTimeout(() => {
      resumeProgress();
    }, 300);
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
  }

  const swipeElements = [
    heroSection,
    document.querySelector(".hero__slides"),
    document.querySelector(".hero__content"),
    document.querySelector(".hero__content-mobile"),
  ];

  swipeElements.forEach((element) => {
    if (element) {
      element.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      element.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      element.addEventListener("touchend", handleTouchEnd, { passive: false });
    }
  });

  serviceCards.forEach((card) => {
    card.addEventListener("touchstart", handleTouchStart, { passive: false });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd, { passive: false });
  });

  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlidesCount();
    }, 100);
  });

  updateSlidesVisibility();

  setTimeout(() => {
    switchToSlide(0);
    startProgress();

    if (isMobile) {
      updateMobileTitles(0);
    }
  }, 100);
});
