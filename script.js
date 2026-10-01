const transitionOverlay = document.querySelector('.page-transition-overlay');

document.addEventListener('DOMContentLoaded', () => {
  const pageShell = document.querySelector('.page-shell');

  if (pageShell) {
    pageShell.style.opacity = '0';
    pageShell.style.transform = 'translateY(14px) scale(0.985)';
    pageShell.style.transition = 'opacity 480ms ease, transform 480ms ease';

    requestAnimationFrame(() => {
      pageShell.style.opacity = '1';
      pageShell.style.transform = 'translateY(0) scale(1)';
    });
  }

  if (transitionOverlay) {
    transitionOverlay.classList.remove('active');
  }

  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetHref = link.getAttribute('href');
      if (!targetHref || targetHref.startsWith('#')) return;

      event.preventDefault();

      if (transitionOverlay) {
        transitionOverlay.classList.add('active');
      }

      document.body.classList.add('is-transitioning');

      setTimeout(() => {
        window.location.href = targetHref;
      }, 430);
    });
  });
});

const particleContainer = document.getElementById('particles');

if (particleContainer) {
  const particleCount = 18;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';

    const size = (Math.random() * 6 + 4).toFixed(2) + 'px';
    const left = (Math.random() * 100).toFixed(2) + '%';
    const top = (Math.random() * 100).toFixed(2) + '%';
    const duration = (Math.random() * 12 + 10).toFixed(2) + 's';

    particle.style.setProperty('--size', size);
    particle.style.left = left;
    particle.style.top = top;
    particle.style.setProperty('--duration', duration);
    particle.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';

    particleContainer.appendChild(particle);
  }
}

function showMessage(messageElement, text, type) {
  if (!messageElement) return;

  messageElement.textContent = text;
  messageElement.classList.remove('error', 'success');
  messageElement.classList.add(type);
  messageElement.classList.add('show');
}

function clearMessage(messageElement) {
  if (!messageElement) return;

  messageElement.textContent = '';
  messageElement.classList.remove('show', 'error', 'success');
}

function setFieldError(fieldWrap, hasError) {
  if (fieldWrap) {
    fieldWrap.classList.toggle('error', hasError);
  }
}

function validateEmailFormat(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}

function getStoredAccounts() {
  try {
    const savedAccounts = localStorage.getItem('registeredAccounts');
    const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
    const validAccounts = Array.isArray(accounts)
      ? accounts.filter((account) => account && typeof account.email === 'string' && typeof account.password === 'string')
      : [];
    const legacyAccount = localStorage.getItem('registeredUser');

    if (legacyAccount) {
      const account = JSON.parse(legacyAccount);
      if (account && typeof account.email === 'string' && typeof account.password === 'string'
        && !validAccounts.some((saved) => saved.email.toLowerCase() === account.email.toLowerCase())) {
        validAccounts.push(account);
      }
    }

    return validAccounts;
  } catch (error) {
    return [];
  }
}

function getStoredAccount(email) {
  const accounts = getStoredAccounts();
  if (!email) return accounts[0] || null;

  return accounts.find((account) => account.email.toLowerCase() === email.toLowerCase()) || null;
}

function saveStoredAccount(account) {
  const accounts = getStoredAccounts();
  if (accounts.some((saved) => saved.email.toLowerCase() === account.email.toLowerCase())) return false;

  accounts.push(account);
  localStorage.setItem('registeredAccounts', JSON.stringify(accounts));
  return true;
}

function syncPasswordSpotlight() {
  const visibleInputs = Array.from(document.querySelectorAll('.password-input-wrap input[type="text"]'));
  const spotlightInput = visibleInputs.find((input) => document.activeElement === input) || visibleInputs[0];
  const wrappers = document.querySelectorAll('.password-input-wrap');
  const pageShell = document.querySelector('.page-shell');

  wrappers.forEach((wrapper) => {
    wrapper.classList.toggle('is-focused', Boolean(spotlightInput && wrapper.contains(spotlightInput)));
  });
  document.body.classList.toggle('password-focus-mode', Boolean(spotlightInput));

  if (!spotlightInput || !pageShell) return;

  const rect = spotlightInput.closest('.password-input-wrap').getBoundingClientRect();
  pageShell.style.setProperty('--password-focus-x', `${rect.left + rect.width / 2}px`);
  pageShell.style.setProperty('--password-focus-y', `${rect.top + rect.height / 2}px`);
  pageShell.style.setProperty('--password-focus-radius-x', `${rect.width / 2 + 34}px`);
  pageShell.style.setProperty('--password-focus-radius-y', `${rect.height / 2 + 28}px`);
}

function bindPasswordToggle(button, input) {
  if (!button || !input) return;

  button.addEventListener('click', () => {
    const shouldShowPassword = input.type === 'password';
    input.type = shouldShowPassword ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(shouldShowPassword));
    const toggleText = button.querySelector('.toggle-icon');

    if (toggleText) {
      toggleText.textContent = shouldShowPassword ? 'Hide' : 'Show';
    }

    if (shouldShowPassword) {
      requestAnimationFrame(() => {
        input.focus();
      });
    } else {
      input.blur();
    }

    syncPasswordSpotlight();
  });
}

function bindPasswordFocusEffects(input) {
  if (!input) return;

  if (!input.closest('.password-input-wrap')) return;

  input.addEventListener('focus', syncPasswordSpotlight);
  input.addEventListener('blur', syncPasswordSpotlight);
  input.addEventListener('input', syncPasswordSpotlight);
  window.addEventListener('resize', syncPasswordSpotlight);
  window.addEventListener('scroll', syncPasswordSpotlight, { passive: true });
}

const loginForm = document.getElementById('loginForm');
const rememberMe = document.getElementById('rememberMe');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const loginMessage = document.getElementById('formMessage');
const userFieldWrap = document.getElementById('userFieldWrap');
const passwordFieldWrap = document.getElementById('passwordFieldWrap');
const passwordToggle = document.querySelector('.password-toggle');

if (loginForm) {
  const loadRememberedUser = () => {
    const savedEmail = localStorage.getItem('rememberedEmail');

    if (savedEmail && usernameInput) {
      usernameInput.value = savedEmail;
      if (rememberMe) rememberMe.checked = true;
    }
  };

  const saveRememberedUser = () => {
    if (!usernameInput) return;

    const emailValue = usernameInput.value.trim();

    if (rememberMe && rememberMe.checked && emailValue) {
      localStorage.setItem('rememberedEmail', emailValue);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const resetButtonState = () => {
    if (loginButton) {
      loginButton.classList.remove('is-loading');
      loginButton.disabled = false;
    }
  };

  const validateLoginForm = () => {
    const usernameValue = usernameInput ? usernameInput.value.trim() : '';
    const passwordValue = passwordInput ? passwordInput.value.trim() : '';
    let isValid = true;

    setFieldError(userFieldWrap, false);
    setFieldError(passwordFieldWrap, false);
    clearMessage(loginMessage);

    if (!usernameValue) {
      showMessage(loginMessage, 'Please enter your email or username.', 'error');
      setFieldError(userFieldWrap, true);
      isValid = false;
    } else if (usernameValue.includes('@') && !validateEmailFormat(usernameValue)) {
      showMessage(loginMessage, 'Please enter a valid email address.', 'error');
      setFieldError(userFieldWrap, true);
      isValid = false;
    }

    if (!passwordValue) {
      showMessage(loginMessage, 'Please enter your password.', 'error');
      setFieldError(passwordFieldWrap, true);
      isValid = false;
    }

    return isValid;
  };

  bindPasswordToggle(passwordToggle, passwordInput);
  bindPasswordFocusEffects(passwordInput);

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    const storedAccounts = getStoredAccounts();

    if (storedAccounts.length === 0) {
      showMessage(loginMessage, 'You must register first before logging in.', 'error');
      setTimeout(() => {
        window.location.href = 'create-account.html';
      }, 1200);
      return;
    }

    const enteredEmail = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const enteredPassword = passwordInput ? passwordInput.value.trim() : '';
    const storedAccount = getStoredAccount(enteredEmail);

    if (!storedAccount || enteredPassword !== storedAccount.password) {
      showMessage(loginMessage, 'Incorrect email or password. Please try again.', 'error');
      setFieldError(userFieldWrap, true);
      setFieldError(passwordFieldWrap, true);
      return;
    }

    if (loginButton) {
      loginButton.classList.add('is-loading');
      loginButton.disabled = true;
    }

    showMessage(loginMessage, 'Checking your credentials...', 'success');

    setTimeout(() => {
      saveRememberedUser();

      if (loginButton) {
        loginButton.classList.remove('is-loading');
        loginButton.classList.add('is-success');
        loginButton.disabled = true;
      }

      showMessage(loginMessage, 'Login successful! Welcome back.', 'success');
      sessionStorage.setItem('vaultUserEmail', storedAccount.email.toLowerCase());
      document.body.classList.add('is-transitioning');
      if (transitionOverlay) transitionOverlay.classList.add('active');

      setTimeout(() => {
        window.location.href = 'vault.html';
      }, 650);
    }, 1100);
  });

  loadRememberedUser();
}

const forgotForm = document.getElementById('forgotForm');
const forgotEmailInput = document.getElementById('forgotEmail');
const forgotMessage = document.getElementById('forgotMessage');
const forgotFieldWrap = document.getElementById('forgotFieldWrap');

if (forgotForm) {
  const validateForgotForm = () => {
    const emailValue = forgotEmailInput ? forgotEmailInput.value.trim() : '';
    setFieldError(forgotFieldWrap, false);
    clearMessage(forgotMessage);

    if (!emailValue) {
      showMessage(forgotMessage, 'Please enter your email address.', 'error');
      setFieldError(forgotFieldWrap, true);
      return false;
    }

    if (!validateEmailFormat(emailValue)) {
      showMessage(forgotMessage, 'Please enter a valid email address.', 'error');
      setFieldError(forgotFieldWrap, true);
      return false;
    }

    return true;
  };

  forgotForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateForgotForm()) {
      return;
    }

    showMessage(forgotMessage, 'Email delivery is not configured, so no reset email was sent.', 'error');
  });
}

const signupForm = document.getElementById('signupForm');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupConfirm = document.getElementById('signupConfirm');
const signupButton = document.getElementById('signupButton');
const signupMessage = document.getElementById('signupMessage');
const signupToggle = document.querySelector('[data-password-toggle="signup"]');
const confirmToggle = document.querySelector('[data-password-toggle="confirm"]');

if (signupForm) {
  const validateSignupForm = () => {
    const nameValue = signupName ? signupName.value.trim() : '';
    const emailValue = signupEmail ? signupEmail.value.trim() : '';
    const passwordValue = signupPassword ? signupPassword.value.trim() : '';
    const confirmValue = signupConfirm ? signupConfirm.value.trim() : '';

    const nameWrap = document.getElementById('signupNameWrap');
    const emailWrap = document.getElementById('signupEmailWrap');
    const passwordWrap = document.getElementById('signupPasswordWrap');
    const confirmWrap = document.getElementById('signupConfirmWrap');

    clearMessage(signupMessage);
    setFieldError(nameWrap, false);
    setFieldError(emailWrap, false);
    setFieldError(passwordWrap, false);
    setFieldError(confirmWrap, false);

    if (!nameValue) {
      showMessage(signupMessage, 'Please enter your full name.', 'error');
      setFieldError(nameWrap, true);
      return false;
    }

    if (!emailValue) {
      showMessage(signupMessage, 'Please enter your email address.', 'error');
      setFieldError(emailWrap, true);
      return false;
    }

    if (!validateEmailFormat(emailValue)) {
      showMessage(signupMessage, 'Please enter a valid email address.', 'error');
      setFieldError(emailWrap, true);
      return false;
    }

    if (getStoredAccount(emailValue)) {
      showMessage(signupMessage, 'An account with this email already exists. Please sign in instead.', 'error');
      setFieldError(emailWrap, true);
      return false;
    }

    if (passwordValue.length < 8) {
      showMessage(signupMessage, 'Password must be at least 8 characters long.', 'error');
      setFieldError(passwordWrap, true);
      return false;
    }

    if (confirmValue !== passwordValue) {
      showMessage(signupMessage, 'Passwords do not match.', 'error');
      setFieldError(confirmWrap, true);
      return false;
    }

    return true;
  };

  bindPasswordToggle(signupToggle, signupPassword);
  bindPasswordToggle(confirmToggle, signupConfirm);
  bindPasswordFocusEffects(signupPassword);
  bindPasswordFocusEffects(signupConfirm);

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateSignupForm()) {
      return;
    }

    if (signupButton) {
      signupButton.classList.add('is-loading');
      signupButton.disabled = true;
    }

    showMessage(signupMessage, 'Creating your account...', 'success');

    setTimeout(() => {
      const accountData = {
        name: signupName ? signupName.value.trim() : '',
        email: signupEmail ? signupEmail.value.trim().toLowerCase() : '',
        password: signupPassword ? signupPassword.value.trim() : ''
      };

      saveStoredAccount(accountData);

      if (signupButton) {
        signupButton.classList.remove('is-loading');
        signupButton.classList.add('is-success');
        signupButton.disabled = true;
      }

      showMessage(signupMessage, 'Account saved. Email notifications are not configured, so no email was sent.', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    }, 1000);
  });
}

function openPhotoVaultDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('nebulaPhotoVault', 1);

    request.onupgradeneeded = () => {
      const photoStore = request.result.createObjectStore('photos', { keyPath: 'id' });
      photoStore.createIndex('owner', 'owner', { unique: false });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function awaitDatabaseRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function initializePhotoVault() {
  const vaultPage = document.getElementById('vaultPage');
  if (!vaultPage) return;

  const owner = sessionStorage.getItem('vaultUserEmail');
  const account = getStoredAccount(owner);

  if (!owner || !account || owner !== account.email.toLowerCase()) {
    window.location.replace('index.html');
    return;
  }

  const accountName = account.name || owner;
  const nameElement = document.getElementById('accountName');
  const avatarElement = document.getElementById('accountAvatar');
  const photoInput = document.getElementById('photoInput');
  const photoGrid = document.getElementById('photoGrid');
  const videoGrid = document.getElementById('videoGrid');
  const photosSection = document.getElementById('photosSection');
  const videosSection = document.getElementById('videosSection');
  const photosCount = document.getElementById('photosCount');
  const videosCount = document.getElementById('videosCount');
  const noPhotosState = document.getElementById('noPhotosState');
  const noVideosState = document.getElementById('noVideosState');
  const photoSearch = document.getElementById('photoSearch');
  const photoSort = document.getElementById('photoSort');
  const photoCount = document.getElementById('photoCount');
  const emptyState = document.getElementById('emptyState');
  const dropzone = document.getElementById('uploadDropzone');
  const status = document.getElementById('vaultStatus');
  const photoDialog = document.getElementById('photoDialog');
  const viewerImage = document.getElementById('viewerImage');
  const viewerVideo = document.getElementById('viewerVideo');
  const viewerTitle = document.getElementById('viewerTitle');
  const viewerDate = document.getElementById('viewerDate');
  const maxImageSize = 25 * 1024 * 1024;
  const maxVideoSize = 250 * 1024 * 1024;
  let database;
  let memories = [];
  const tileObjectUrls = [];
  let currentPhoto = null;
  let currentPhotoUrl = '';

  nameElement.textContent = accountName;
  avatarElement.textContent = accountName.trim().charAt(0).toUpperCase() || 'N';

  const tutorialDialog = document.getElementById('guidedTour');
  const tutorialWelcome = document.getElementById('tourWelcome');
  const tutorialWelcomeName = document.getElementById('tourWelcomeName');
  const tutorialCard = document.getElementById('tourCard');
  const tutorialShade = document.getElementById('tourShade');
  const tutorialSpotlight = document.getElementById('tourSpotlight');
  const tutorialTitle = document.getElementById('tourTitle');
  const tutorialCopy = document.getElementById('tourCopy');
  const tutorialStepCount = document.getElementById('tourStepCount');
  const tutorialProgress = document.getElementById('tourProgressDots');
  const tutorialPrevious = document.getElementById('previousTourStep');
  const tutorialNext = document.getElementById('nextTourStep');
  const tutorialSeenKey = `orbitMemoriesTutorialSeen:${owner}`;
  const tutorialSteps = [
    {
      target: '#vaultHeading',
      title: 'Welcome to your photo orbit',
      copy: 'This is your personal collection. Your photos and videos are saved in this browser on this device.'
    },
    {
      target: '#uploadButton',
      title: 'Add photos and videos',
      copy: 'Choose Add media to select photos or MP4/WebM videos, or drop media files into the upload area.'
    },
    {
      target: '.photo-tile',
      title: 'Open, play, and download again',
      copy: 'Click a photo to preview it or a video to play it. Use Download again to save another copy.'
    },
    {
      target: '#videosHeading',
      title: 'Videos have their own section',
      copy: 'MP4 and WebM videos appear here, separate from your Photos. Click a video to open its player, then use the playback controls.'
    },
    {
      target: '#photoSearch',
      title: 'Find a memory',
      copy: 'Search by filename to quickly find a photo in your collection.'
    },
    {
      target: '#photoSort',
      title: 'Choose the order',
      copy: 'Sort your photos by newest, oldest, or filename.'
    },
    {
      target: '#switchAccountButton',
      title: 'Switch accounts',
      copy: 'Return to login and sign in with another registered account. Your photos stay separated by account.'
    },
    {
      target: '#logoutButton',
      title: 'Sign out',
      copy: 'End this session and return to the login screen. Sign out does not delete your saved photos.'
    }
  ];
  let tutorialIndex = 0;

  const tutorialTarget = () => {
    const step = tutorialSteps[tutorialIndex];
    const target = document.querySelector(step.target);
    if ((tutorialIndex === 2 || tutorialIndex === 3) && (!target || target.getClientRects().length === 0)) {
      return document.getElementById('uploadButton');
    }
    return target || document.getElementById('vaultHeading');
  };

  const positionTutorial = () => {
    if (!tutorialDialog.open || !tutorialWelcome.hidden) return;

    const target = tutorialTarget();
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const padding = 8;
    const spotlightTop = Math.max(5, rect.top - padding);
    const spotlightLeft = Math.max(5, rect.left - padding);
    const spotlightWidth = Math.min(window.innerWidth - spotlightLeft - 5, rect.width + padding * 2);
    const spotlightHeight = Math.min(window.innerHeight - spotlightTop - 5, rect.height + padding * 2);
    const radius = Math.ceil(Math.hypot(spotlightWidth / 2, spotlightHeight / 2) + 8);

    tutorialSpotlight.style.top = `${spotlightTop}px`;
    tutorialSpotlight.style.left = `${spotlightLeft}px`;
    tutorialSpotlight.style.width = `${spotlightWidth}px`;
    tutorialSpotlight.style.height = `${spotlightHeight}px`;
    tutorialShade.style.setProperty('--tour-x', `${rect.left + rect.width / 2}px`);
    tutorialShade.style.setProperty('--tour-y', `${rect.top + rect.height / 2}px`);
    tutorialShade.style.setProperty('--tour-radius', `${radius}px`);

    const cardRect = tutorialCard.getBoundingClientRect();
    const roomBelow = window.innerHeight - rect.bottom - 24;
    const roomAbove = rect.top - 24;
    let cardTop = roomBelow >= cardRect.height || roomAbove < cardRect.height
      ? rect.bottom + 16
      : rect.top - cardRect.height - 16;
    cardTop = Math.max(12, Math.min(cardTop, window.innerHeight - cardRect.height - 12));
    const cardLeft = Math.max(16, Math.min(
      rect.left + rect.width / 2 - cardRect.width / 2,
      window.innerWidth - cardRect.width - 16
    ));

    tutorialCard.style.top = `${cardTop}px`;
    tutorialCard.style.left = `${cardLeft}px`;
  };

  const renderTutorialStep = () => {
    const step = tutorialSteps[tutorialIndex];
    const hasMemories = memories.length > 0;

    tutorialTitle.textContent = tutorialIndex === 2 && !hasMemories
      ? 'Open, play, and download your memories'
      : step.title;
    tutorialCopy.textContent = tutorialIndex === 2 && !hasMemories
      ? 'Add a photo or video first. Click a photo to preview it or a video to play it, then use Download again to save another copy.'
      : step.copy;
    if (tutorialIndex === 3 && Number(videosCount.textContent) === 0) {
      tutorialCopy.textContent = 'Your MP4 and WebM videos will appear here, in their own section separate from Photos. Use Add media to upload a video, then click its tile to open the player.';
    }
    tutorialStepCount.textContent = `STEP ${tutorialIndex + 1} OF ${tutorialSteps.length}`;
    tutorialPrevious.hidden = tutorialIndex === 0;
    tutorialNext.textContent = tutorialIndex === tutorialSteps.length - 1 ? 'Finish tour' : 'Next step';
    tutorialProgress.replaceChildren();

    tutorialSteps.forEach((_, index) => {
      const dot = document.createElement('span');
      if (index === tutorialIndex) dot.classList.add('is-current');
      tutorialProgress.append(dot);
    });

    const target = tutorialTarget();
    const targetRect = target.getBoundingClientRect();
    const targetScrollTop = Math.max(
      0,
      window.scrollY + targetRect.top - (window.innerHeight - targetRect.height) / 2
    );

    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, targetScrollTop);
    positionTutorial();
    requestAnimationFrame(() => {
      document.documentElement.style.removeProperty('scroll-behavior');
      positionTutorial();
    });
  };

  const closeTutorial = () => {
    localStorage.setItem(tutorialSeenKey, 'true');
    if (tutorialDialog.open) tutorialDialog.close();
  };

  const openWelcome = () => {
    tutorialWelcomeName.textContent = account.name || 'traveler';
    tutorialWelcome.hidden = false;
    tutorialShade.hidden = true;
    tutorialSpotlight.hidden = true;
    tutorialCard.hidden = true;
    tutorialDialog.setAttribute('aria-labelledby', 'tourWelcomeTitle');
    tutorialDialog.showModal();
    tutorialWelcome.scrollTop = 0;
  };

  const openTutorial = () => {
    tutorialIndex = 0;
    tutorialWelcome.hidden = true;
    tutorialShade.hidden = false;
    tutorialSpotlight.hidden = false;
    tutorialCard.hidden = false;
    tutorialDialog.setAttribute('aria-labelledby', 'tourTitle');
    if (!tutorialDialog.open) tutorialDialog.showModal();
    renderTutorialStep();
  };

  document.getElementById('openTutorial').addEventListener('click', openTutorial);
  document.getElementById('startTutorial').addEventListener('click', openTutorial);
  document.getElementById('closeWelcome').addEventListener('click', closeTutorial);
  document.getElementById('closeTutorial').addEventListener('click', closeTutorial);
  document.getElementById('skipTutorial').addEventListener('click', closeTutorial);
  tutorialPrevious.addEventListener('click', () => {
    if (tutorialIndex > 0) {
      tutorialIndex -= 1;
      renderTutorialStep();
    }
  });
  tutorialNext.addEventListener('click', () => {
    if (tutorialIndex === tutorialSteps.length - 1) {
      closeTutorial();
      return;
    }
    tutorialIndex += 1;
    renderTutorialStep();
  });
  tutorialDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeTutorial();
  });
  tutorialDialog.addEventListener('click', (event) => {
    if (event.target === tutorialDialog) closeTutorial();
  });
  tutorialDialog.addEventListener('close', () => {
    tutorialSpotlight.removeAttribute('style');
    tutorialShade.removeAttribute('style');
    tutorialCard.removeAttribute('style');
  });
  window.addEventListener('resize', positionTutorial);
  window.addEventListener('scroll', positionTutorial, { passive: true });

  const maybeOpenFirstRunTutorial = () => {
    if (localStorage.getItem(tutorialSeenKey) !== 'true') openWelcome();
  };

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  };

  const formatDate = (timestamp) => new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(timestamp);

  const isVideoMemory = (memory) => memory.type.startsWith('video/') || /\.(mp4|webm)$/i.test(memory.name);

  const loadPhotos = async () => {
    const request = database
      .transaction('photos', 'readonly')
      .objectStore('photos')
      .index('owner')
      .getAll(owner);
    memories = await awaitDatabaseRequest(request);
    renderPhotos();
  };

  const renderPhotos = () => {
    tileObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    tileObjectUrls.length = 0;
    photoGrid.replaceChildren();
    videoGrid.replaceChildren();
    const query = photoSearch.value.trim().toLocaleLowerCase();
    const sortMode = photoSort.value;
    const visibleMemories = memories
      .filter((photo) => photo.name.toLocaleLowerCase().includes(query))
      .sort((first, second) => {
        if (sortMode === 'oldest') return first.createdAt - second.createdAt;
        if (sortMode === 'name') return first.name.localeCompare(second.name);
        return second.createdAt - first.createdAt;
      });
    const visiblePhotos = visibleMemories.filter((memory) => !isVideoMemory(memory));
    const visibleVideos = visibleMemories.filter(isVideoMemory);
    const allPhotos = memories.filter((memory) => !isVideoMemory(memory));
    const allVideos = memories.filter(isVideoMemory);

    photoCount.textContent = memories.length;
    photosCount.textContent = allPhotos.length;
    videosCount.textContent = allVideos.length;
    emptyState.hidden = memories.length > 0;
    photosSection.hidden = memories.length === 0;
    videosSection.hidden = memories.length === 0;
    dropzone.hidden = memories.length > 0;
    photoGrid.hidden = visiblePhotos.length === 0;
    videoGrid.hidden = visibleVideos.length === 0;
    noPhotosState.hidden = visiblePhotos.length > 0;
    noVideosState.hidden = visibleVideos.length > 0;
    noPhotosState.textContent = query ? 'No photos match this search.' : 'No photos here yet. Add media to start this collection.';
    noVideosState.textContent = query ? 'No videos match this search.' : 'No videos here yet. Add media to start this collection.';

    if (memories.length > 0 && visibleMemories.length === 0) {
      setStatus('No memories match that search.');
      return;
    }

    if (status.textContent.startsWith('No memories match')) setStatus('');

    const createMediaTile = (photo, index) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'photo-tile';
      tile.style.setProperty('--tile-index', index);
      tile.setAttribute('aria-label', `View ${photo.name}`);

      const previewUrl = URL.createObjectURL(photo.blob);
      tileObjectUrls.push(previewUrl);
      const media = document.createElement(isVideoMemory(photo) ? 'video' : 'img');
      media.src = previewUrl;
      media.className = 'photo-tile-media';

      if (isVideoMemory(photo)) {
        media.muted = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.addEventListener('loadedmetadata', () => {
          if (media.duration > 0) media.currentTime = Math.min(0.1, media.duration / 2);
        }, { once: true });
        media.addEventListener('seeked', () => media.pause(), { once: true });
      } else {
        media.alt = photo.name;
        media.loading = 'lazy';
      }

      const caption = document.createElement('span');
      caption.className = 'photo-tile-caption';

      const title = document.createElement('strong');
      title.textContent = photo.name;

      const date = document.createElement('span');
      date.textContent = formatDate(photo.createdAt);

      if (isVideoMemory(photo)) {
        const videoBadge = document.createElement('span');
        videoBadge.className = 'media-type-badge';
        videoBadge.textContent = 'VIDEO';
        tile.append(media, videoBadge, caption);
      } else {
        tile.append(media, caption);
      }

      caption.append(title, date);
      tile.addEventListener('click', () => openPhoto(photo));
      return tile;
    };

    const photoFragment = document.createDocumentFragment();
    visiblePhotos.forEach((photo, index) => photoFragment.append(createMediaTile(photo, index)));
    photoGrid.append(photoFragment);

    const videoFragment = document.createDocumentFragment();
    visibleVideos.forEach((video, index) => videoFragment.append(createMediaTile(video, index)));
    videoGrid.append(videoFragment);
  };

  const openPhoto = (photo) => {
    currentPhoto = photo;
    if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
    currentPhotoUrl = URL.createObjectURL(photo.blob);
    viewerVideo.pause();
    viewerVideo.removeAttribute('src');
    viewerVideo.hidden = true;
    viewerImage.hidden = isVideoMemory(photo);
    viewerImage.removeAttribute('src');

    if (isVideoMemory(photo)) {
      viewerVideo.src = currentPhotoUrl;
      viewerVideo.hidden = false;
      viewerVideo.setAttribute('aria-label', `Play ${photo.name}`);
      viewerVideo.load();
    } else {
      viewerImage.src = currentPhotoUrl;
      viewerImage.alt = photo.name;
    }

    viewerTitle.textContent = photo.name;
    viewerDate.textContent = formatDate(photo.createdAt);
    photoDialog.showModal();
  };

  const savePhotos = async (files) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.length === 0) return;

    const acceptedFiles = selectedFiles.filter((file) => {
      const isVideoFile = ['video/mp4', 'video/webm'].includes(file.type) || /\.(mp4|webm)$/i.test(file.name);
      const isImageFile = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(file.type);
      const maxFileSize = isVideoFile ? maxVideoSize : maxImageSize;
      const supportedType = isImageFile || isVideoFile;

      if (!supportedType) setStatus(`${file.name} is not a supported photo or video format.`, true);
      else if (file.size > maxFileSize) setStatus(`${file.name} exceeds the ${isVideoFile ? '250 MB video' : '25 MB photo'} limit.`, true);
      return supportedType && file.size <= maxFileSize;
    });

    if (acceptedFiles.length === 0) return;

    let savedCount = 0;
    try {
      for (const file of acceptedFiles) {
        const record = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          owner,
          name: file.name,
          type: file.type || (/\.(mp4|webm)$/i.test(file.name) ? 'video/mp4' : 'application/octet-stream'),
          createdAt: Date.now(),
          blob: file
        };
        const request = database.transaction('photos', 'readwrite').objectStore('photos').add(record);
        await awaitDatabaseRequest(request);
        savedCount += 1;
      }

      await loadPhotos();
      setStatus(`${savedCount} ${savedCount === 1 ? 'memory' : 'memories'} added to your archive.`);
    } catch (error) {
      setStatus('Could not save this media. Your browser storage may be full.', true);
      console.error('Photo vault save failed:', error);
    }
  };

  document.getElementById('uploadButton').addEventListener('click', () => photoInput.click());
  document.getElementById('emptyUploadButton').addEventListener('click', () => photoInput.click());
  dropzone.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', async () => {
    await savePhotos(photoInput.files);
    photoInput.value = '';
  });
  photoSearch.addEventListener('input', renderPhotos);
  photoSort.addEventListener('change', renderPhotos);

  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('is-dragging');
  });
  dropzone.addEventListener('dragleave', (event) => {
    if (!dropzone.contains(event.relatedTarget)) dropzone.classList.remove('is-dragging');
  });
  dropzone.addEventListener('drop', async (event) => {
    event.preventDefault();
    dropzone.classList.remove('is-dragging');
    await savePhotos(event.dataTransfer.files);
  });

  document.getElementById('closeViewer').addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('close', () => {
    viewerImage.removeAttribute('src');
    viewerImage.hidden = false;
    viewerVideo.pause();
    viewerVideo.removeAttribute('src');
    viewerVideo.hidden = true;
    viewerVideo.load();
    if (currentPhotoUrl) URL.revokeObjectURL(currentPhotoUrl);
    currentPhotoUrl = '';
    currentPhoto = null;
  });
  photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });

  document.getElementById('downloadPhoto').addEventListener('click', () => {
    if (!currentPhoto || !currentPhotoUrl) return;
    const downloadLink = document.createElement('a');
    downloadLink.href = currentPhotoUrl;
    downloadLink.download = currentPhoto.name;
    downloadLink.click();
  });

  document.getElementById('deletePhoto').addEventListener('click', async () => {
    if (!currentPhoto || !window.confirm(`Delete "${currentPhoto.name}" from this archive?`)) return;
    try {
      const request = database.transaction('photos', 'readwrite').objectStore('photos').delete(currentPhoto.id);
      await awaitDatabaseRequest(request);
      photoDialog.close();
      await loadPhotos();
      setStatus('Photo removed from your archive.');
    } catch (error) {
      setStatus('Could not delete this photo. Please try again.', true);
    }
  });

  document.getElementById('switchAccountButton').addEventListener('click', () => {
    sessionStorage.removeItem('vaultUserEmail');
    localStorage.removeItem('rememberedEmail');
    window.location.href = 'index.html';
  });

  document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem('vaultUserEmail');
    window.location.href = 'index.html';
  });

  if (!('indexedDB' in window)) {
    setStatus('This browser does not support local photo storage.', true);
    return;
  }

  openPhotoVaultDatabase()
    .then((openedDatabase) => {
      database = openedDatabase;
      return loadPhotos();
    })
    .then(maybeOpenFirstRunTutorial)
    .catch((error) => {
      setStatus('Could not open this browser’s photo storage.', true);
      console.error('Photo vault database failed:', error);
      maybeOpenFirstRunTutorial();
    });
}

initializePhotoVault();
