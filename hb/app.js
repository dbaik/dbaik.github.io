const APP_COPY = window.APP_COPY ?? {};
const LANGUAGE_STORAGE_KEY = 'frontendBirthdayLanguage';

let currentLanguage = 'en';

const card = document.querySelector('.card');
const particles = document.getElementById('particles');
const cursorFx = document.getElementById('cursorFx');
const cursorComet = document.getElementById('cursorComet');
const toastStack = document.getElementById('toastStack');
const topControls = document.getElementById('topControls');
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = document.getElementById('themeToggleIcon');
const themeToggleLabel = document.getElementById('themeToggleLabel');
const languageToggle = document.getElementById('languageToggle');
const languageToggleIcon = document.getElementById('languageToggleIcon');
const languageToggleLabel = document.getElementById('languageToggleLabel');
const soundToggle = document.getElementById('soundToggle');
const soundToggleIcon = document.getElementById('soundToggleIcon');
const soundToggleLabel = document.getElementById('soundToggleLabel');
const mobileIntro = document.getElementById('mobileIntro');
const mobileIntroTitle = document.getElementById('mobileIntroTitle');
const mobileIntroText = document.getElementById('mobileIntroText');
const mobileIntroClose = document.getElementById('mobileIntroClose');
const eggCounter = document.getElementById('eggCounter');
const eggCounterValue = document.getElementById('eggCounterValue');
const secretModal = document.getElementById('secretModal');
const secretModalClose = document.querySelector('[data-close-secret]');
const secretModalEyebrow = document.getElementById('secretModalEyebrow');
const secretModalTitle = document.getElementById('secretModalTitle');
const secretModalText = document.getElementById('secretModalText');
const secretModalProgress = document.getElementById('secretModalProgress');
const secretModalRestart = document.getElementById('secretModalRestart');
const codeModal = document.getElementById('codeModal');
const codeModalTitle = document.getElementById('codeModalTitle');
const codeModalClose = document.querySelector('[data-close-code]');
const audioModal = document.getElementById('audioModal');
const audioModalClose = document.getElementById('audioModalClose');
const audioModalEyebrow = document.getElementById('audioModalEyebrow');
const audioModalTitle = document.getElementById('audioModalTitle');
const audioModalText = document.getElementById('audioModalText');
const audioModalConfirm = document.getElementById('audioModalConfirm');
const audioModalCancel = document.getElementById('audioModalCancel');
const commandPanel = document.getElementById('commandPanel');
const commandPanelBody = document.getElementById('commandPanelBody');
const commandPanelTitle = document.getElementById('commandPanelTitle');
const commandInput = document.getElementById('commandInput');
const commandLog = document.getElementById('commandLog');
const bgIcons = document.getElementById('bgIcons');
const legendaryStage = document.getElementById('legendaryStage');
const birthdayCodeLive = document.getElementById('birthdayCodeLive');
const footerCopy = document.getElementById('footerCopy');
const body = document.body;
const pageTitle = document.getElementById('cardTitle');
const eggCounterLabel = document.getElementById('eggCounterLabel');
const profileTopTitle = document.getElementById('profileTopTitle');
const profileRoleLabel = document.getElementById('profileRoleLabel');
const profileRoleValue = document.getElementById('profileRoleValue');
const profileStackLabel = document.getElementById('profileStackLabel');
const profileStackValue = document.getElementById('profileStackValue');
const profileCodingSinceLabel = document.getElementById('profileCodingSinceLabel');
const profileCodingSinceValue = document.getElementById('profileCodingSinceValue');
const codeBadgeLabel = document.getElementById('codeBadgeLabel');
const codeTitleLabel = document.getElementById('codeTitleLabel');
const birthdayTitleText = document.getElementById('birthdayTitleText');
const birthdayTitleAccent = document.getElementById('birthdayTitleAccent');
const birthdaySubtext = document.getElementById('birthdaySubtext');
const mobileIntroEyebrow = document.getElementById('mobileIntroEyebrow');
const colors = ['#00ffcc', '#ff00ff', '#ffff00', '#00ff88'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactViewportQuery = window.matchMedia('(max-width: 639px)');
const bodyModeTimers = new Map();
let birthdayCodePreludeHoldMs = 700;
let birthdayCodePreCodePauseMs = 180;
let birthdayCodeAsideBlinkMs = 1000;
let birthdayCodeCommentPlain = '';
let birthdayCodePreludePlain = '';
let birthdayCodePlain = '';
let birthdayCodeFinalHtml = '';
let BIRTHDAY_CODE = null;
let EGG_CATALOG = null;
let EGG_HINTS = null;
let PAGE_COPY = null;
let UI_COPY = null;
let birthdayCodeTimer = null;
let birthdayCodeRun = 0;
let matrixRainTimer = null;
let matrixModeTimer = null;
let legendaryModeTimer = null;
let legendarySpawnTimer = null;
let completionTimer = null;
let finalEggsModalTimer = null;
let commandActivationTimer = null;
let audioContext = null;
let masterGain = null;
let soundEnabled = false;
let soundSettingsReady = false;
let currentThemePreference = null;
let ambientParticleTimer = null;
let isCompactViewport = compactViewportQuery.matches;
let temporaryThemeTimer = null;

    let typedBuffer = '';
    let konamiIndex = 0;
    let clickCombo = 0;
    let clickComboTimer = null;
    let longPressTimer = null;
    let longPressTriggered = false;
    let idleHintTimer = null;
    let idleHintCursor = 0;
    let emptyCommandCopyCursor = 0;
    let unknownCommandCopyCursor = 0;
    let modalRestoreFocus = null;

const eggStorageKey = 'frontendBirthdayFoundEggs';
const mobileIntroSeenKey = 'frontendBirthdayMobileIntroSeen';
const themeStorageKey = 'frontendBirthdayThemePreference';
const soundStorageKey = 'frontendBirthdaySoundEnabled';
const soundWarningSeenKey = 'frontendBirthdaySoundWarningSeen';
const idleHintDelay = 30000;
let eggCatalog = null;
let eggHints = null;
const eggIds = [];
const eggIdSet = new Set();

const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a'
    ];

let foundEggs = new Set();
const commandHintList = ['deploy', 'bugfix', 'brew', 'party', 'matrix', 'legendary', 'zaebal', 'clear'];

function renderCommandHints(commandsList) {
  return [
    '<div class="command-hint-row">',
    ...commandsList.map((command) => `<button type="button" class="command-hint-chip" data-command="${command}">${command}</button>`),
    '</div>'
  ].join('');
}

function getRotatingCopy(items, cursor) {
  if (!Array.isArray(items) || items.length === 0) {
    return { value: '', nextCursor: cursor };
  }

  return {
    value: items[cursor % items.length],
    nextCursor: cursor + 1
  };
}

function getPreferredLanguage() {
  const storedLanguage = readStorageItem(LANGUAGE_STORAGE_KEY);

  if (storedLanguage === 'ru' || storedLanguage === 'en') {
    return storedLanguage;
  }

  const timeZone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      return '';
    }
  })();

  const russianTimeZones = new Set([
    'Europe/Warsaw',
    'Europe/Kyiv',
    'Europe/Kiev'
  ]);

  if (timeZone.startsWith('America/') || timeZone.startsWith('US/')) {
    return 'en';
  }

  if (russianTimeZones.has(timeZone)) {
    return 'ru';
  }

  return 'en';
}

function updateLanguageToggle() {
  if (!UI_COPY) return;

  languageToggle?.classList.toggle('is-active', currentLanguage === 'ru');
  languageToggle?.setAttribute('aria-pressed', String(currentLanguage === 'ru'));
  languageToggle?.setAttribute('aria-label', currentLanguage === 'ru'
    ? UI_COPY.languageToggleToEnglish
    : UI_COPY.languageToggleToRussian);

  if (languageToggleIcon) {
    languageToggleIcon.textContent = currentLanguage === 'ru'
      ? UI_COPY.languageToggleLabelRussian
      : UI_COPY.languageToggleLabelEnglish;
  }

  if (languageToggleLabel) {
    languageToggleLabel.textContent = currentLanguage === 'ru'
      ? UI_COPY.languageToggleLabelRussian
      : UI_COPY.languageToggleLabelEnglish;
  }

  topControls?.setAttribute('aria-label', currentLanguage === 'ru'
    ? 'Кнопки темы, языка и звука'
    : 'Theme, language, and sound controls');
}

function syncLanguageCopy() {
  const pack = APP_COPY[currentLanguage] ?? APP_COPY.en ?? {
    PAGE_COPY: {},
    BIRTHDAY_CODE: {},
    EGG_CATALOG: {},
    EGG_HINTS: {},
    UI_COPY: {}
  };
  PAGE_COPY = pack.PAGE_COPY;
  BIRTHDAY_CODE = pack.BIRTHDAY_CODE;
  EGG_CATALOG = pack.EGG_CATALOG;
  EGG_HINTS = pack.EGG_HINTS;
  UI_COPY = pack.UI_COPY;
  eggCatalog = EGG_CATALOG;
  eggHints = EGG_HINTS;

  eggIds.splice(0, eggIds.length, ...Object.keys(eggCatalog));
  eggIdSet.clear();
  eggIds.forEach((eggId) => eggIdSet.add(eggId));

  birthdayCodeCommentPlain = BIRTHDAY_CODE.commentPlain;
  birthdayCodePreludePlain = BIRTHDAY_CODE.preludePlain;
  birthdayCodePlain = BIRTHDAY_CODE.plain;
  birthdayCodeFinalHtml = BIRTHDAY_CODE.finalHtml;
}

function applyPageCopy() {
  document.documentElement.lang = currentLanguage;
  document.title = PAGE_COPY.pageTitle;

  document.querySelector('meta[name="description"]')?.setAttribute('content', PAGE_COPY.metaDescription);

  if (pageTitle) pageTitle.textContent = PAGE_COPY.cardTitle;
  if (eggCounterLabel) eggCounterLabel.textContent = PAGE_COPY.eggCounterLabel;
  if (profileTopTitle) profileTopTitle.textContent = PAGE_COPY.profileTopTitle;
  if (profileRoleLabel) profileRoleLabel.textContent = PAGE_COPY.profileRoleLabel;
  if (profileRoleValue) profileRoleValue.textContent = PAGE_COPY.profileRoleValue;
  if (profileStackLabel) profileStackLabel.textContent = PAGE_COPY.profileStackLabel;
  if (profileStackValue) profileStackValue.textContent = PAGE_COPY.profileStackValue;
  if (profileCodingSinceLabel) profileCodingSinceLabel.textContent = PAGE_COPY.profileCodingSinceLabel;
  if (profileCodingSinceValue) profileCodingSinceValue.textContent = PAGE_COPY.profileCodingSinceValue;
  if (codeBadgeLabel) codeBadgeLabel.textContent = PAGE_COPY.codeBadgeLabel;
  if (codeTitleLabel) codeTitleLabel.textContent = PAGE_COPY.codeTitleLabel;
  if (birthdayTitleText) birthdayTitleText.innerHTML = PAGE_COPY.birthdayTitleHtml;
  if (birthdayTitleAccent) birthdayTitleAccent.textContent = PAGE_COPY.birthdayTitleAccent;
  if (birthdaySubtext) birthdaySubtext.innerHTML = PAGE_COPY.birthdaySubtextHtml;
  if (commandPanelTitle) commandPanelTitle.textContent = PAGE_COPY.commandPanelTitle;
  if (commandLog) commandLog.innerHTML = PAGE_COPY.commandLogIntroHtml;
  if (footerCopy) footerCopy.innerHTML = PAGE_COPY.footerCopyHtml;
  if (mobileIntroEyebrow) mobileIntroEyebrow.textContent = PAGE_COPY.mobileIntroEyebrow;
  if (mobileIntroTitle) mobileIntroTitle.textContent = PAGE_COPY.mobileIntroTitle;
  if (mobileIntroText) mobileIntroText.innerHTML = PAGE_COPY.mobileIntroTextHtml;
  if (mobileIntroClose) mobileIntroClose.textContent = PAGE_COPY.mobileIntroClose;
  if (secretModalEyebrow) secretModalEyebrow.textContent = PAGE_COPY.secretModalEyebrow;
  if (secretModalTitle) secretModalTitle.textContent = PAGE_COPY.secretModalTitle;
  if (secretModalText) secretModalText.textContent = PAGE_COPY.secretModalText;
  if (secretModalRestart) secretModalRestart.textContent = PAGE_COPY.secretModalRestart;
  if (codeModalTitle) codeModalTitle.textContent = PAGE_COPY.codeModalTitle;
  if (audioModalEyebrow) audioModalEyebrow.textContent = PAGE_COPY.audioModalEyebrow;
  if (audioModalTitle) audioModalTitle.textContent = PAGE_COPY.audioModalTitle;
  if (audioModalText) audioModalText.textContent = PAGE_COPY.audioModalText;
  if (audioModalConfirm) audioModalConfirm.textContent = PAGE_COPY.audioModalConfirm;
  if (audioModalCancel) audioModalCancel.textContent = PAGE_COPY.audioModalCancel;

  eggCounter?.setAttribute(
    'aria-label',
    currentLanguage === 'ru'
      ? 'Показать подсказку по скрытым взаимодействиям'
      : 'Show hidden interactions hint'
  );
  themeToggle?.setAttribute(
    'aria-label',
    body.dataset.theme === 'light' ? UI_COPY.themeToggleToDark : UI_COPY.themeToggleToLight
  );
  soundToggle?.setAttribute(
    'aria-label',
    soundEnabled ? UI_COPY.soundToggleDisable : UI_COPY.soundToggleEnable
  );
  secretModalClose?.setAttribute('aria-label', currentLanguage === 'ru' ? 'Закрыть окно' : 'Close dialog');
  codeModalClose?.setAttribute('aria-label', currentLanguage === 'ru' ? 'Закрыть код' : 'Close code view');
  audioModalClose?.setAttribute('aria-label', currentLanguage === 'ru' ? 'Закрыть окно' : 'Close dialog');
  commandInput?.setAttribute('aria-label', currentLanguage === 'ru' ? 'Секретная команда' : 'Secret command input');
}

function setLanguage(language, options = {}) {
  const { persist = false } = options;
  currentLanguage = APP_COPY[language] ? language : 'en';
  syncLanguageCopy();
  updateLanguageToggle();
  applyPageCopy();
  updateThemeToggle(body.dataset.theme || 'dark');
  if (soundSettingsReady) {
    updateSoundToggle();
  }

  if (persist) {
    writeStorageItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }
}

syncLanguageCopy();
currentLanguage = getPreferredLanguage();
setLanguage(currentLanguage);
foundEggs = new Set(loadFoundEggs());

function toggleLanguage() {
  setLanguage(currentLanguage === 'en' ? 'ru' : 'en', { persist: true });
  playSoundCue('ui');
}

    function escapeHtml(value) {
      return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function readStorageItem(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    }

    function writeStorageItem(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Ignore storage failures in private mode or restricted browsers.
      }
    }

    function hasSeenSoundWarning() {
      return readStorageItem(soundWarningSeenKey) === '1';
    }

    function setSoundWarningSeen(seen) {
      writeStorageItem(soundWarningSeenKey, seen ? '1' : '0');
    }

    function updateThemeColor(theme) {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

      themeColorMeta?.setAttribute('content', theme === 'light' ? '#f5f7ff' : '#050510');
      colorSchemeMeta?.setAttribute('content', theme);
      document.documentElement.style.colorScheme = theme;
    }

    function updateThemeToggle(theme) {
      themeToggle?.classList.toggle('is-active', theme === 'light');
      themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
      themeToggle?.setAttribute('aria-label', theme === 'light' ? UI_COPY.themeToggleToDark : UI_COPY.themeToggleToLight);

      if (themeToggleIcon) {
        themeToggleIcon.textContent = theme === 'light' ? '☀' : '☾';
      }

      if (themeToggleLabel) {
        themeToggleLabel.textContent = theme === 'light'
          ? UI_COPY.themeToggleLabelLight
          : UI_COPY.themeToggleLabelDark;
      }
    }

    function applyTheme(theme, options = {}) {
      const { persist = false } = options;
      body.dataset.theme = theme;
      updateThemeColor(theme);
      updateThemeToggle(theme);

      if (persist) {
        currentThemePreference = theme;
        writeStorageItem(themeStorageKey, theme);
      } else if (theme === 'dark' && currentThemePreference !== null) {
        currentThemePreference = theme;
      }
    }

    function getResolvedTheme() {
      const storedTheme = readStorageItem(themeStorageKey);

      if (storedTheme === 'dark') {
        currentThemePreference = storedTheme;
        return storedTheme;
      }

      if (storedTheme === 'light') {
        currentThemePreference = null;
        writeStorageItem(themeStorageKey, 'dark');
        return 'dark';
      }

      currentThemePreference = null;
      return 'dark';
    }

    function toggleTheme() {
      if (temporaryThemeTimer) {
        window.clearTimeout(temporaryThemeTimer);
        temporaryThemeTimer = null;
      }

      if (body.dataset.theme === 'light') {
        applyTheme('dark', { persist: true });
        playSoundCue('theme');
        showToast(UI_COPY.darkModeBackToast);
        return;
      }

      applyTheme('light', { persist: false });
      playSoundCue('theme');
      showToast(UI_COPY.lightModeVisitingToast);

      temporaryThemeTimer = window.setTimeout(() => {
        applyTheme('dark', { persist: true });
        playSoundCue('theme');
        showToast(UI_COPY.darkModeRestoredToast);
        temporaryThemeTimer = null;
      }, 4000);
    }

    function updateSoundToggle() {
      soundToggle?.classList.toggle('is-muted', !soundEnabled);
      soundToggle?.classList.toggle('is-active', soundEnabled);
      soundToggle?.setAttribute('aria-pressed', String(soundEnabled));
      soundToggle?.setAttribute('aria-label', soundEnabled ? UI_COPY.soundToggleDisable : UI_COPY.soundToggleEnable);

      if (soundToggleIcon) {
        soundToggleIcon.textContent = soundEnabled ? '🔊' : '🔇';
      }

      if (soundToggleLabel) {
        soundToggleLabel.textContent = soundEnabled
          ? UI_COPY.soundToggleLabelOn
          : UI_COPY.soundToggleLabelOff;
      }
    }

    function getAudioContext() {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return null;

      if (!audioContext) {
        audioContext = new AudioContextCtor();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.24;
        masterGain.connect(audioContext.destination);
      }

      return audioContext;
    }

    function midiToFrequency(midi) {
      return 440 * (2 ** ((midi - 69) / 12));
    }

    function scheduleTone(ctx, {
      start,
      frequency,
      type = 'square',
      duration = 0.12,
      gain = 0.12,
      attack = 0.004,
      release = 0.05,
      detune = 0,
      filterStart = 2400,
      filterEnd = 900
    }) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const amp = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, start);
      osc.detune.setValueAtTime(detune, start);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterStart, start);
      filter.frequency.exponentialRampToValueAtTime(filterEnd, start + duration);

      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(gain, start + attack);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(filter);
      filter.connect(amp);
      amp.connect(masterGain);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    }

    function scheduleNoise(ctx, {
      start,
      duration = 0.06,
      gain = 0.08,
      filterFrequency = 1700
    }) {
      const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let index = 0; index < length; index += 1) {
        data[index] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const amp = ctx.createGain();

      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(filterFrequency, start);
      filter.Q.value = 8;
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      source.connect(filter);
      filter.connect(amp);
      amp.connect(masterGain);

      source.start(start);
      source.stop(start + duration + 0.02);
    }

    function playArpeggio(pattern, {
      root = 440,
      type = 'square',
      gain = 0.08,
      noteDuration = 0.09,
      delay = 0,
      step = 0.085,
      detune = 0,
      filterStart = 2400,
      filterEnd = 1100
    } = {}) {
      if (!soundEnabled) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const start = ctx.currentTime + delay;

      pattern.forEach((offset, index) => {
        scheduleTone(ctx, {
          start: start + index * step,
          frequency: midiToFrequency(69 + offset) / 440 * root,
          type,
          duration: noteDuration,
          gain,
          detune,
          filterStart,
          filterEnd
        });
      });
    }

    function playPhrase(steps, {
      root = 440,
      type = 'square',
      gain = 0.08,
      noteDuration = 0.12,
      step = 0.12,
      leadIn = 0,
      filterStart = 2600,
      filterEnd = 900
    } = {}) {
      if (!soundEnabled) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const start = ctx.currentTime + 0.02 + leadIn;

      steps.forEach((item, index) => {
        if (typeof item === 'number') {
          scheduleTone(ctx, {
            start: start + index * step,
            frequency: midiToFrequency(69 + item) / 440 * root,
            type,
            duration: noteDuration,
            gain,
            filterStart,
            filterEnd
          });
          return;
        }

        scheduleTone(ctx, {
          start: start + (item.offset ?? index) * step,
          frequency: midiToFrequency(69 + (item.note ?? 0)) / 440 * root,
          type: item.type ?? type,
          duration: item.duration ?? noteDuration,
          gain: item.gain ?? gain,
          filterStart: item.filterStart ?? filterStart,
          filterEnd: item.filterEnd ?? filterEnd
        });
      });
    }

    function playSoundCue(cue) {
      if (!soundEnabled) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime + 0.02;

      switch (cue) {
        case 'ui':
          scheduleTone(ctx, {
            start: now,
            frequency: 932,
            type: 'square',
            duration: 0.05,
            gain: 0.06,
            filterStart: 2800,
            filterEnd: 1200
          });
          scheduleNoise(ctx, {
            start: now,
            duration: 0.03,
            gain: 0.025,
            filterFrequency: 2600
          });
          break;
        case 'ui-long':
          playPhrase([0, 4, 7, 12, 7, 4], {
            root: 262,
            type: 'triangle',
            gain: 0.08,
            noteDuration: 0.12,
            step: 0.11,
            filterStart: 2500,
            filterEnd: 900
          });
          scheduleNoise(ctx, {
            start: now + 0.02,
            duration: 0.06,
            gain: 0.028,
            filterFrequency: 1800
          });
          break;
        case 'terminal':
          playPhrase([
            { note: 0, offset: 0, duration: 0.14 },
            { note: 4, offset: 1, duration: 0.14 },
            { note: 7, offset: 2, duration: 0.14 },
            { note: 12, offset: 3, duration: 0.18 },
            { note: 16, offset: 4, duration: 0.15 },
            { note: 12, offset: 5, duration: 0.14 },
            { note: 7, offset: 6, duration: 0.14 },
            { note: 11, offset: 7, duration: 0.15 },
            { note: 16, offset: 8, duration: 0.18 },
            { note: 19, offset: 9, duration: 0.22 }
          ], {
            root: 294,
            type: 'square',
            gain: 0.07,
            step: 0.13,
            filterStart: 2800,
            filterEnd: 1000
          });
          scheduleNoise(ctx, {
            start: now + 0.03,
            duration: 0.09,
            gain: 0.03,
            filterFrequency: 2400
          });
          break;
        case 'terminal-command':
          playPhrase([
            { note: 0, offset: 0, duration: 0.14 },
            { note: 7, offset: 1, duration: 0.14 },
            { note: 4, offset: 2, duration: 0.14 },
            { note: 12, offset: 3, duration: 0.18 },
            { note: 7, offset: 5, duration: 0.14 },
            { note: 16, offset: 6, duration: 0.2 },
            { note: 12, offset: 8, duration: 0.16 },
            { note: 19, offset: 9, duration: 0.22 },
            { note: 16, offset: 11, duration: 0.16 },
            { note: 23, offset: 12, duration: 0.22 },
            { note: 19, offset: 14, duration: 0.18 },
            { note: 24, offset: 15, duration: 0.42 }
          ], {
            root: 262,
            type: 'triangle',
            gain: 0.045,
            step: 0.14,
            filterStart: 2300,
            filterEnd: 850
          });
          break;
        case 'help-pop':
          scheduleTone(ctx, {
            start: now,
            frequency: 1046,
            type: 'square',
            duration: 0.045,
            gain: 0.06,
            filterStart: 3200,
            filterEnd: 1400
          });
          scheduleNoise(ctx, {
            start: now + 0.01,
            duration: 0.025,
            gain: 0.02,
            filterFrequency: 2900
          });
          break;
        case 'clear-wipe':
          scheduleTone(ctx, {
            start: now,
            frequency: 392,
            type: 'triangle',
            duration: 0.09,
            gain: 0.055,
            filterStart: 2000,
            filterEnd: 500
          });
          scheduleTone(ctx, {
            start: now + 0.05,
            frequency: 196,
            type: 'triangle',
            duration: 0.12,
            gain: 0.05,
            filterStart: 1400,
            filterEnd: 280
          });
          scheduleNoise(ctx, {
            start: now + 0.015,
            duration: 0.08,
            gain: 0.028,
            filterFrequency: 1200
          });
          break;
        case 'party-command':
          playPhrase([
            { note: 0, offset: 0, duration: 0.07 },
            { note: 7, offset: 1, duration: 0.07 },
            { note: 12, offset: 2, duration: 0.08 },
            { note: 19, offset: 3, duration: 0.1 },
            { note: 24, offset: 4, duration: 0.12 }
          ], {
            root: 330,
            type: 'square',
            gain: 0.075,
            step: 0.055,
            filterStart: 3200,
            filterEnd: 1300
          });
          scheduleTone(ctx, {
            start: now + 0.01,
            frequency: 620,
            type: 'triangle',
            duration: 0.14,
            gain: 0.045,
            filterStart: 1700,
            filterEnd: 650
          });
          break;
        case 'matrix-command':
          playPhrase([
            { note: 0, offset: 0, duration: 0.05 },
            { note: -2, offset: 1, duration: 0.05 },
            { note: 0, offset: 2, duration: 0.05 },
            { note: -5, offset: 3, duration: 0.05 },
            { note: 0, offset: 4, duration: 0.05 },
            { note: 2, offset: 5, duration: 0.05 }
          ], {
            root: 176,
            type: 'square',
            gain: 0.05,
            step: 0.04,
            filterStart: 1200,
            filterEnd: 320
          });
          scheduleNoise(ctx, {
            start: now + 0.005,
            duration: 0.12,
            gain: 0.03,
            filterFrequency: 900
          });
          break;
        case 'beer-command':
        case 'brew-command':
          scheduleTone(ctx, {
            start: now,
            frequency: 659,
            type: 'triangle',
            duration: 0.11,
            gain: 0.06,
            filterStart: 2400,
            filterEnd: 900
          });
          scheduleTone(ctx, {
            start: now + 0.08,
            frequency: 784,
            type: 'triangle',
            duration: 0.11,
            gain: 0.055,
            filterStart: 2200,
            filterEnd: 800
          });
          scheduleNoise(ctx, {
            start: now + 0.03,
            duration: 0.05,
            gain: 0.02,
            filterFrequency: 2800
          });
          break;
        case 'bugfix-command':
          playPhrase([
            { note: 7, offset: 0, duration: 0.06 },
            { note: 4, offset: 1, duration: 0.06 },
            { note: 2, offset: 2, duration: 0.06 },
            { note: 0, offset: 3, duration: 0.08 },
            { note: -2, offset: 4, duration: 0.08 }
          ], {
            root: 294,
            type: 'sawtooth',
            gain: 0.055,
            step: 0.055,
            filterStart: 2200,
            filterEnd: 520
          });
          scheduleNoise(ctx, {
            start: now + 0.01,
            duration: 0.09,
            gain: 0.034,
            filterFrequency: 1500
          });
          break;
        case 'deploy-command':
          scheduleTone(ctx, {
            start: now,
            frequency: 132,
            type: 'triangle',
            duration: 0.12,
            gain: 0.07,
            filterStart: 900,
            filterEnd: 180
          });
          scheduleTone(ctx, {
            start: now + 0.07,
            frequency: 98,
            type: 'square',
            duration: 0.16,
            gain: 0.055,
            filterStart: 1100,
            filterEnd: 260
          });
          scheduleNoise(ctx, {
            start: now + 0.01,
            duration: 0.11,
            gain: 0.03,
            filterFrequency: 700
          });
          break;
        case 'legendary-command':
          playPhrase([
            { note: 0, offset: 0, duration: 0.08 },
            { note: 7, offset: 1, duration: 0.08 },
            { note: 12, offset: 2, duration: 0.1 },
            { note: 16, offset: 3, duration: 0.12 },
            { note: 19, offset: 4, duration: 0.14 }
          ], {
            root: 262,
            type: 'square',
            gain: 0.07,
            step: 0.065,
            filterStart: 2800,
            filterEnd: 900
          });
          break;
        case 'frontend-command':
          playPhrase([
            { note: 0, offset: 0, duration: 0.06 },
            { note: 4, offset: 1, duration: 0.06 },
            { note: 7, offset: 2, duration: 0.07 },
            { note: 12, offset: 3, duration: 0.09 }
          ], {
            root: 330,
            type: 'square',
            gain: 0.06,
            step: 0.05,
            filterStart: 2800,
            filterEnd: 1000
          });
          scheduleNoise(ctx, {
            start: now + 0.01,
            duration: 0.035,
            gain: 0.022,
            filterFrequency: 2100
          });
          break;
        case 'birthday-command':
          playPhrase([
            { note: 0, offset: 0, duration: 0.08 },
            { note: 4, offset: 1, duration: 0.08 },
            { note: 7, offset: 2, duration: 0.09 },
            { note: 12, offset: 3, duration: 0.1 },
            { note: 16, offset: 4, duration: 0.12 }
          ], {
            root: 349,
            type: 'triangle',
            gain: 0.07,
            step: 0.065,
            filterStart: 2600,
            filterEnd: 900
          });
          break;
        case 'coffee-command':
          scheduleTone(ctx, {
            start: now,
            frequency: 523,
            type: 'triangle',
            duration: 0.11,
            gain: 0.055,
            filterStart: 1800,
            filterEnd: 600
          });
          scheduleTone(ctx, {
            start: now + 0.08,
            frequency: 659,
            type: 'square',
            duration: 0.08,
            gain: 0.04,
            filterStart: 2200,
            filterEnd: 720
          });
          break;
        case 'zaebal-command':
          playArpeggio([0, 4, 7, 4, 0], {
            root: 294,
            type: 'triangle',
            gain: 0.06,
            noteDuration: 0.06,
            step: 0.05,
            filterStart: 2000,
            filterEnd: 700
          });
          break;
        case 'typewriter-key':
          scheduleTone(ctx, {
            start: now,
            frequency: 1760,
            type: 'square',
            duration: 0.025,
            gain: 0.04,
            filterStart: 4200,
            filterEnd: 1800
          });
          scheduleNoise(ctx, {
            start: now + 0.002,
            duration: 0.018,
            gain: 0.014,
            filterFrequency: 3200
          });
          break;
        case 'typewriter-space':
          scheduleTone(ctx, {
            start: now,
            frequency: 1180,
            type: 'triangle',
            duration: 0.018,
            gain: 0.018,
            filterStart: 3000,
            filterEnd: 1600
          });
          break;
        case 'typewriter-return':
          scheduleTone(ctx, {
            start: now,
            frequency: 880,
            type: 'square',
            duration: 0.04,
            gain: 0.05,
            filterStart: 2600,
            filterEnd: 900
          });
          scheduleTone(ctx, {
            start: now + 0.045,
            frequency: 196,
            type: 'triangle',
            duration: 0.08,
            gain: 0.035,
            filterStart: 1200,
            filterEnd: 320
          });
          scheduleNoise(ctx, {
            start: now + 0.01,
            duration: 0.03,
            gain: 0.02,
            filterFrequency: 1800
          });
          break;
        case 'croak':
          scheduleTone(ctx, {
            start: now,
            frequency: 186,
            type: 'triangle',
            duration: 0.09,
            gain: 0.055,
            filterStart: 1400,
            filterEnd: 240
          });
          scheduleTone(ctx, {
            start: now + 0.03,
            frequency: 138,
            type: 'square',
            duration: 0.07,
            gain: 0.04,
            filterStart: 1100,
            filterEnd: 180
          });
          scheduleNoise(ctx, {
            start: now + 0.01,
            duration: 0.04,
            gain: 0.02,
            filterFrequency: 1000
          });
          break;
        case 'executed':
          playPhrase([
            { note: 0, offset: 0, duration: 0.06 },
            { note: 7, offset: 1, duration: 0.08 },
            { note: 12, offset: 2, duration: 0.12 }
          ], {
            root: 392,
            type: 'triangle',
            gain: 0.075,
            step: 0.08,
            filterStart: 3200,
            filterEnd: 1200
          });
          scheduleTone(ctx, {
            start: now + 0.01,
            frequency: 1046,
            type: 'square',
            duration: 0.05,
            gain: 0.04,
            filterStart: 3600,
            filterEnd: 1400
          });
          break;
        case 'theme':
          scheduleTone(ctx, {
            start: now,
            frequency: 392,
            type: 'sawtooth',
            duration: 0.16,
            gain: 0.08,
            filterStart: 1800,
            filterEnd: 500
          });
          scheduleTone(ctx, {
            start: now + 0.07,
            frequency: 523,
            type: 'square',
            duration: 0.14,
            gain: 0.07,
            filterStart: 2200,
            filterEnd: 800
          });
          break;
        case 'toggle-on':
          playArpeggio([0, 4, 7, 12], {
            root: 262,
            type: 'square',
            gain: 0.075,
            noteDuration: 0.08,
            step: 0.075,
            filterStart: 2600,
            filterEnd: 900
          });
          break;
        case 'keyboard-frontend':
          playPhrase([
            { note: 0, offset: 0 },
            { note: 7, offset: 1 },
            { note: 12, offset: 2 },
            { note: 16, offset: 3 },
            { note: 12, offset: 4 },
            { note: 7, offset: 5 },
            { note: 4, offset: 6 }
          ], {
            root: 330,
            type: 'square',
            gain: 0.08,
            noteDuration: 0.11,
            step: 0.09,
            filterStart: 2600,
            filterEnd: 1000
          });
          break;
        case 'keyboard-birthday':
          playPhrase([
            { note: 0, offset: 0 },
            { note: 4, offset: 1 },
            { note: 7, offset: 2 },
            { note: 12, offset: 3 },
            { note: 19, offset: 4 },
            { note: 12, offset: 5 },
            { note: 7, offset: 6 },
            { note: 4, offset: 7 }
          ], {
            root: 349,
            type: 'triangle',
            gain: 0.08,
            noteDuration: 0.11,
            step: 0.09,
            filterStart: 2500,
            filterEnd: 900
          });
          break;
        case 'toggle-off':
          scheduleTone(ctx, {
            start: now,
            frequency: 220,
            type: 'triangle',
            duration: 0.12,
            gain: 0.06,
            filterStart: 1300,
            filterEnd: 300
          });
          break;
        case 'confirm':
          playArpeggio([0, 5, 9, 12], {
            root: 329,
            type: 'square',
            gain: 0.08,
            noteDuration: 0.09,
            step: 0.08,
            filterStart: 2600,
            filterEnd: 1000
          });
          break;
        case 'success':
          playArpeggio([0, 4, 7, 11, 12], {
            root: 392,
            type: 'triangle',
            gain: 0.08,
            noteDuration: 0.1,
            step: 0.09,
            filterStart: 2200,
            filterEnd: 900
          });
          break;
        case 'warning':
          scheduleTone(ctx, {
            start: now,
            frequency: 160,
            type: 'square',
            duration: 0.14,
            gain: 0.08,
            filterStart: 1200,
            filterEnd: 400
          });
          scheduleTone(ctx, {
            start: now + 0.12,
            frequency: 120,
            type: 'square',
            duration: 0.12,
            gain: 0.07,
            filterStart: 1000,
            filterEnd: 240
          });
          break;
        case 'error':
          scheduleTone(ctx, {
            start: now,
            frequency: 246,
            type: 'square',
            duration: 0.08,
            gain: 0.08,
            filterStart: 1800,
            filterEnd: 500
          });
          scheduleTone(ctx, {
            start: now + 0.08,
            frequency: 196,
            type: 'square',
            duration: 0.14,
            gain: 0.08,
            filterStart: 1300,
            filterEnd: 360
          });
          break;
        case 'party':
          playArpeggio([0, 4, 7, 12, 16], {
            root: 294,
            type: 'square',
            gain: 0.08,
            noteDuration: 0.08,
            step: 0.065,
            filterStart: 2800,
            filterEnd: 1200
          });
          break;
        case 'party-long':
          playPhrase([
            { note: 0, offset: 0, duration: 0.14 },
            { note: 4, offset: 1, duration: 0.12 },
            { note: 7, offset: 2, duration: 0.12 },
            { note: 12, offset: 3, duration: 0.14 },
            { note: 16, offset: 4, duration: 0.12 },
            { note: 19, offset: 5, duration: 0.12 }
          ], {
            root: 294,
            type: 'sawtooth',
            gain: 0.075,
            step: 0.1,
            filterStart: 2800,
            filterEnd: 1000
          });
          break;
        case 'matrix':
          playArpeggio([0, -5, 0, 7], {
            root: 196,
            type: 'square',
            gain: 0.07,
            noteDuration: 0.09,
            step: 0.07,
            filterStart: 1400,
            filterEnd: 420
          });
          break;
        case 'coffee':
          playArpeggio([0, 4, 7, 14], {
            root: 330,
            type: 'sawtooth',
            gain: 0.075,
            noteDuration: 0.09,
            step: 0.07,
            filterStart: 2600,
            filterEnd: 900
          });
          break;
        case 'beer':
          playArpeggio([0, 5, 9, 12], {
            root: 262,
            type: 'triangle',
            gain: 0.07,
            noteDuration: 0.09,
            step: 0.08,
            filterStart: 2000,
            filterEnd: 700
          });
          break;
        case 'bugfix':
          playArpeggio([0, 2, 4, 7, 11], {
            root: 330,
            type: 'square',
            gain: 0.07,
            noteDuration: 0.08,
            step: 0.07,
            filterStart: 2400,
            filterEnd: 1000
          });
          break;
        case 'hearts':
          playArpeggio([0, 4, 7, 12, 16], {
            root: 294,
            type: 'triangle',
            gain: 0.07,
            noteDuration: 0.09,
            step: 0.075,
            filterStart: 2300,
            filterEnd: 800
          });
          break;
        case 'trophy':
          playArpeggio([0, 7, 12, 19, 24], {
            root: 262,
            type: 'square',
            gain: 0.085,
            noteDuration: 0.09,
            step: 0.08,
            filterStart: 2500,
            filterEnd: 1100
          });
          break;
        case 'legendary':
          playArpeggio([0, 4, 7, 12, 16, 19], {
            root: 330,
            type: 'square',
            gain: 0.085,
            noteDuration: 0.09,
            step: 0.07,
            filterStart: 2600,
            filterEnd: 1200
          });
          break;
        case 'legendary-fanfare':
          playPhrase([
            { note: 0, offset: 0, duration: 0.22 },
            { note: 7, offset: 0, duration: 0.22, gain: 0.05 },
            { note: 12, offset: 2, duration: 0.24 },
            { note: 16, offset: 2, duration: 0.24, gain: 0.05 },
            { note: 19, offset: 4, duration: 0.26 },
            { note: 24, offset: 6, duration: 0.3 },
            { note: 19, offset: 9, duration: 0.2 },
            { note: 24, offset: 10, duration: 0.22 },
            { note: 28, offset: 12, duration: 0.24 },
            { note: 31, offset: 14, duration: 0.3 },
            { note: 16, offset: 17, duration: 0.55, gain: 0.045 },
            { note: 21, offset: 17, duration: 0.55, gain: 0.05 },
            { note: 28, offset: 17, duration: 0.55 }
          ], {
            root: 262,
            type: 'square',
            gain: 0.07,
            step: 0.13,
            filterStart: 2900,
            filterEnd: 1200
          });
          playPhrase([
            { note: -12, offset: 0, duration: 0.34 },
            { note: -5, offset: 4, duration: 0.34 },
            { note: 0, offset: 8, duration: 0.38 },
            { note: 7, offset: 12, duration: 0.4 },
            { note: 0, offset: 17, duration: 0.58 },
            { note: 7, offset: 17, duration: 0.58, gain: 0.035 }
          ], {
            root: 262,
            type: 'triangle',
            gain: 0.04,
            step: 0.13,
            filterStart: 1800,
            filterEnd: 700
          });
          break;
        case 'deploy':
          playPhrase([
            { note: 0, offset: 0, duration: 0.18 },
            { note: 7, offset: 1, duration: 0.18 },
            { note: 12, offset: 2, duration: 0.2 },
            { note: 16, offset: 4, duration: 0.2 },
            { note: 19, offset: 5, duration: 0.22 },
            { note: 24, offset: 7, duration: 0.28 },
            { note: 19, offset: 10, duration: 0.18 },
            { note: 24, offset: 11, duration: 0.2 },
            { note: 28, offset: 13, duration: 0.22 },
            { note: 31, offset: 15, duration: 0.28 },
            { note: 19, offset: 18, duration: 0.56, gain: 0.045 },
            { note: 24, offset: 18, duration: 0.56, gain: 0.05 },
            { note: 31, offset: 18, duration: 0.56 }
          ], {
            root: 294,
            type: 'sawtooth',
            gain: 0.06,
            step: 0.13,
            filterStart: 2800,
            filterEnd: 1100
          });
          playPhrase([
            { note: -12, offset: 0, duration: 0.38 },
            { note: -5, offset: 5, duration: 0.38 },
            { note: 0, offset: 10, duration: 0.42 },
            { note: 7, offset: 15, duration: 0.4 },
            { note: 0, offset: 18, duration: 0.6 },
            { note: 7, offset: 18, duration: 0.6, gain: 0.032 }
          ], {
            root: 294,
            type: 'triangle',
            gain: 0.038,
            step: 0.13,
            filterStart: 1700,
            filterEnd: 680
          });
          break;
        default:
          scheduleTone(ctx, {
            start: now,
            frequency: 440,
            type: 'square',
            duration: 0.08,
            gain: 0.06,
            filterStart: 1800,
            filterEnd: 700
          });
      }
    }

    function getModeSoundCue(mode) {
      switch (mode) {
        case 'is-party':
          return 'party-long';
        case 'is-matrix':
          return 'matrix';
        case 'is-coffee':
          return 'coffee';
        case 'is-beer':
          return 'beer';
        case 'is-bugfix':
          return 'bugfix';
        case 'is-hearts':
          return 'hearts';
        case 'is-trophy':
          return 'trophy';
        case 'is-legendary':
          return 'legendary-fanfare';
        case 'is-deploy':
          return 'deploy';
        case 'is-keyboard-frontend':
          return 'keyboard-frontend';
        case 'is-keyboard-birthday':
          return 'keyboard-birthday';
        default:
          return 'success';
      }
    }

    function getCommandSoundCue(command) {
      switch (command) {
        case 'help':
          return 'help-pop';
        case 'clear':
          return 'clear-wipe';
        case 'party':
          return 'party-command';
        case 'matrix':
          return 'matrix-command';
        case 'beer':
        case 'brew':
          return 'beer-command';
        case 'bugfix':
          return 'bugfix-command';
        case 'deploy':
          return 'deploy-command';
        case 'legendary':
          return 'legendary-command';
        case 'frontend':
          return 'frontend-command';
        case 'birthday':
          return 'birthday-command';
        case 'coffee':
          return 'coffee-command';
        case 'zaebal':
          return 'zaebal-command';
        default:
          return 'terminal-command';
      }
    }

    async function setSoundEnabled(enabled, options = {}) {
      const { persist = true } = options;
      soundEnabled = enabled;
      updateSoundToggle();

      if (persist) {
        writeStorageItem(soundStorageKey, enabled ? '1' : '0');
      }

      if (!enabled) {
        return;
      }

      const ctx = getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          // Ignore browsers that refuse to resume without a stronger gesture.
        }
      }
    }

    function openAudioModal() {
      if (!audioModal) return;

      audioModal.classList.add('is-open');
      audioModal.setAttribute('aria-hidden', 'false');
      playSoundCue('warning');
      openOverlay(audioModalConfirm);
    }

    function closeAudioModal() {
      if (!audioModal) return;

      audioModal.classList.remove('is-open');
      audioModal.setAttribute('aria-hidden', 'true');
      closeOverlay();
    }

    function enableSoundWithWarning() {
      if (hasSeenSoundWarning()) {
        void setSoundEnabled(true);
        closeAudioModal();
        showToast(UI_COPY.soundAlreadyEnabledToast);
        return;
      }

      openAudioModal();
    }

    const commands = {
      help() {
        addCommandLog(`${UI_COPY.commandPanelHelpPrefix}${renderCommandHints(commandHintList)}`);
        showToast(UI_COPY.helpOpenedToast);
        burstFloatingText('?', 8);
      },
      party() {
        unlockEgg('party');
        partyMode();
        addCommandLog(UI_COPY.commandPartyLog);
        runTerminalResponse(UI_COPY.commandTerminalResponseParty);
      },
      deploy() {
        unlockEgg('deploy');
        deployBirthday(false);
        addCommandLog(UI_COPY.commandDeployLog);
        runTerminalResponse(UI_COPY.commandTerminalResponseDeploy, { gap: 760 });
      },
      matrix() {
        unlockEgg('matrix');
        matrixMode();
        addCommandLog(UI_COPY.commandMatrixLog);
        runTerminalResponse(UI_COPY.commandTerminalResponseMatrix);
      },
      legendary() {
        unlockEgg('legendary');
        legendaryMode(false);
        addCommandLog(UI_COPY.commandLegendaryLog);
        runTerminalResponse(UI_COPY.commandTerminalResponseLegendary);
      },
      coffee() {
        unlockEgg('coffee');
        coffeeMode(5000, false, UI_COPY.coffeeModeTitle, UI_COPY.coffeeModeText);
        addCommandLog(UI_COPY.commandCoffeeLog);
      },
      frontend() {
        unlockEgg('frontend');
        keyboardMode(
          'is-keyboard-frontend',
          14000,
          UI_COPY.frontendModeTitle,
          UI_COPY.frontendModeText,
          '{ }',
          42
        );
        addCommandLog(UI_COPY.commandFrontendLog);
      },
      birthday() {
        unlockEgg('birthday');
        keyboardMode(
          'is-keyboard-birthday',
          14000,
          UI_COPY.birthdayModeTitle,
          UI_COPY.birthdayModeText,
          '🎂',
          36
        );
        addCommandLog(UI_COPY.commandBirthdayLog);
      },
      brew() {
        unlockEgg('brew');
        beerMode(false);
        addCommandLog(UI_COPY.commandBrewLog);
      },
      bugfix() {
        unlockEgg('bugfix');
        bugfixMode(false);
        addCommandLog(UI_COPY.commandBugfixLog);
      },
      clear() {
        commandLog.innerHTML = '';
        addCommandLog(UI_COPY.commandClearLog);
        runTerminalResponse(UI_COPY.commandTerminalResponseClear);
        flashScreen();
      },
      zaebal() {
        heartMode();
        addCommandLog(UI_COPY.commandZaebalLog);
      }
    };

    function triggerFrontendEgg() {
      unlockEgg('frontend');
      keyboardMode(
        'is-keyboard-frontend',
        14000,
        UI_COPY.frontendModeTitle,
        UI_COPY.frontendModeText,
        '{ }',
        42
      );
    }

    function triggerBirthdayEgg() {
      unlockEgg('birthday');
      keyboardMode(
        'is-keyboard-birthday',
        14000,
        UI_COPY.birthdayModeTitle,
        UI_COPY.birthdayModeText,
        '🎂',
        36
      );
    }

    function triggerCoffeeEgg() {
      unlockEgg('coffee');
      coffeeMode(
        5000,
        false,
        UI_COPY.coffeeModeTitle,
        UI_COPY.coffeeModeText,
        UI_COPY.coffeeModeEggToast
      );
    }

    function loadFoundEggs() {
      try {
        const parsedEggs = JSON.parse(window.localStorage.getItem(eggStorageKey));
        const storedEggs = Array.isArray(parsedEggs) ? parsedEggs : [];
        const validEggs = [...new Set(storedEggs)].filter((id) => eggIdSet.has(id));

        if (validEggs.length !== storedEggs.length) {
          window.localStorage.setItem(eggStorageKey, JSON.stringify(validEggs));
        }

        return validEggs;
      } catch {
        return [];
      }
    }

    function hasSeenMobileIntro() {
      try {
        return window.localStorage.getItem(mobileIntroSeenKey) === '1';
      } catch {
        return false;
      }
    }

    function markMobileIntroSeen() {
      try {
        window.localStorage.setItem(mobileIntroSeenKey, '1');
      } catch {
        // Ignore storage failures in private mode or restricted browsers.
      }
    }

    function saveFoundEggs() {
      try {
        window.localStorage.setItem(eggStorageKey, JSON.stringify([...foundEggs]));
      } catch {
        showToast(UI_COPY.progressSavedToast);
      }
    }

    function resetBirthdayCode() {
      if (birthdayCodeTimer) {
        window.clearTimeout(birthdayCodeTimer);
        birthdayCodeTimer = null;
      }

      birthdayCodeRun += 1;

      if (birthdayCodeLive) {
        birthdayCodeLive.innerHTML = '';
        birthdayCodeLive.classList.remove('is-complete');
        birthdayCodeLive.classList.add('is-hidden');
      }

      closeCodeModal();
    }

    function openMobileIntro() {
      if (!mobileIntro) return;

      mobileIntro.classList.add('is-open');
      mobileIntro.setAttribute('aria-hidden', 'false');
      openOverlay(mobileIntroClose);
    }

    function closeMobileIntro() {
      if (!mobileIntro) return;

      mobileIntro.classList.remove('is-open');
      mobileIntro.setAttribute('aria-hidden', 'true');
      markMobileIntroSeen();
      closeOverlay();
    }

    function renderBirthdayCodeFrame(text, finished = false) {
      if (!birthdayCodeLive) return;

      if (finished) {
        birthdayCodeLive.innerHTML = birthdayCodeFinalHtml;
        birthdayCodeLive.classList.remove('is-hidden', 'is-complete');
        void birthdayCodeLive.offsetWidth;
        birthdayCodeLive.classList.add('is-complete');
        return;
      }

      const cursor = document.createElement('span');
      cursor.className = 'code-cursor';
      cursor.textContent = BIRTHDAY_CODE.cursorGlyph;

      birthdayCodeLive.classList.remove('is-hidden', 'is-complete');
      birthdayCodeLive.replaceChildren(document.createTextNode(text), cursor);
    }

    function renderBirthdayPreludeFrame(text, phase = 'typing') {
      if (!birthdayCodeLive) return;

      const prelude = document.createElement('span');
      prelude.className = 'code-prelude';

      const line = document.createElement('span');
      line.className = phase === 'strike'
        ? 'code-prelude__line code-prelude__line--strike'
        : phase === 'comment'
          ? 'code-prelude__line code-prelude__line--comment'
          : 'code-prelude__line';
      line.textContent = text;
      prelude.appendChild(line);

      if (phase === 'reaction' || phase === 'strike') {
        const aside = document.createElement('span');
        aside.className = phase === 'reaction'
          ? 'code-prelude__aside code-prelude__aside--blink'
          : 'code-prelude__aside';
        aside.textContent = BIRTHDAY_CODE.reactionAsideText;
        prelude.appendChild(aside);
        if (phase === 'reaction') {
          playSoundCue('croak');
        }
      } else {
        const cursor = document.createElement('span');
        cursor.className = 'code-cursor';
        cursor.textContent = BIRTHDAY_CODE.cursorGlyph;
        prelude.appendChild(cursor);
      }

      birthdayCodeLive.classList.remove('is-hidden', 'is-complete');
      birthdayCodeLive.replaceChildren(prelude);
    }

    function playBirthdayTypewriterCue(char) {
      if (!char) return;

      if (char === '\n') {
        playSoundCue('typewriter-return');
        return;
      }

      if (char === ' ') {
        playSoundCue('typewriter-space');
        return;
      }

      playSoundCue('typewriter-key');
    }

    function playBirthdayCode() {
      if (!birthdayCodeLive || !codeModal) return;

      resetBirthdayCode();
      codeModal.classList.add('is-open');
      codeModal.setAttribute('aria-hidden', 'false');
      openOverlay(codeModalClose);

      if (reduceMotion) {
        renderBirthdayCodeFrame('', true);
        return;
      }

      const runId = birthdayCodeRun;
      let commentIndex = 0;
      let preludeIndex = 0;

      const typeComment = () => {
        if (runId !== birthdayCodeRun) return;

        if (commentIndex < birthdayCodeCommentPlain.length) {
          const char = birthdayCodeCommentPlain[commentIndex];
          renderBirthdayPreludeFrame(birthdayCodeCommentPlain.slice(0, commentIndex + 1), 'comment');
          playBirthdayTypewriterCue(char);
          commentIndex += 1;
          birthdayCodeTimer = window.setTimeout(typeComment, commentIndex < 14 ? 35 : commentIndex < 28 ? 24 : 18);
          return;
        }

        birthdayCodeTimer = window.setTimeout(() => {
          if (runId !== birthdayCodeRun) return;
          renderBirthdayPreludeFrame(birthdayCodeCommentPlain, 'comment');

          birthdayCodeTimer = window.setTimeout(() => {
            if (runId !== birthdayCodeRun) return;
            typePrelude();
          }, birthdayCodePreCodePauseMs);
        }, birthdayCodePreludeHoldMs);
      };

      const typePrelude = () => {
        if (runId !== birthdayCodeRun) return;

        if (preludeIndex < birthdayCodePreludePlain.length) {
          const char = birthdayCodePreludePlain[preludeIndex];
          renderBirthdayPreludeFrame(birthdayCodePreludePlain.slice(0, preludeIndex + 1));
          playBirthdayTypewriterCue(char);
          preludeIndex += 1;
          birthdayCodeTimer = window.setTimeout(typePrelude, preludeIndex < 14 ? 35 : preludeIndex < 28 ? 24 : 18);
          return;
        }

        birthdayCodeTimer = window.setTimeout(() => {
          if (runId !== birthdayCodeRun) return;
          renderBirthdayPreludeFrame(birthdayCodePreludePlain, 'reaction');

          birthdayCodeTimer = window.setTimeout(() => {
            if (runId !== birthdayCodeRun) return;
            renderBirthdayPreludeFrame(birthdayCodePreludePlain, 'strike');

            birthdayCodeTimer = window.setTimeout(() => {
              if (runId !== birthdayCodeRun) return;
              let codeIndex = 0;

              const typeCode = () => {
                if (runId !== birthdayCodeRun) return;

                if (codeIndex < birthdayCodePlain.length) {
                  const char = birthdayCodePlain[codeIndex];
                  renderBirthdayCodeFrame(birthdayCodePlain.slice(0, codeIndex + 1));
                  playBirthdayTypewriterCue(char);
                  codeIndex += 1;
                  birthdayCodeTimer = window.setTimeout(typeCode, codeIndex < 14 ? 35 : codeIndex < 40 ? 22 : 14);
                  return;
                }

                birthdayCodeTimer = window.setTimeout(() => {
                  if (runId !== birthdayCodeRun) return;
                  renderBirthdayCodeFrame('', true);
                }, 120);
              };

              typeCode();
            }, birthdayCodePreCodePauseMs);
          }, birthdayCodeAsideBlinkMs);
        }, birthdayCodePreludeHoldMs);
      };

      typeComment();
    }

    function closeCodeModal() {
      if (!codeModal) return;

      codeModal.classList.remove('is-open');
      codeModal.setAttribute('aria-hidden', 'true');
      closeOverlay();
    }

    function clearBackgroundIcons() {
      if (!bgIcons) return;

      bgIcons.replaceChildren();
    }

    function clearLegendaryStage() {
      if (legendaryModeTimer) {
        window.clearTimeout(legendaryModeTimer);
        legendaryModeTimer = null;
      }

      if (legendarySpawnTimer) {
        window.clearInterval(legendarySpawnTimer);
        legendarySpawnTimer = null;
      }

      if (!legendaryStage) return;

      legendaryStage.replaceChildren();
    }

    function spawnLegendaryIcons(count = 14) {
      if (reduceMotion || !legendaryStage) return;

      const glyphs = ['★', '✦', '✺', '✧', '⚡', '👑'];
      const effectiveCount = isCompactViewport ? Math.max(6, Math.floor(count * 0.7)) : count;

      for (let index = 0; index < effectiveCount; index += 1) {
        const item = document.createElement('div');
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const startX = `${Math.random() * 100}vw`;
        const startY = `${Math.random() * 100}vh`;
        const size = `${Math.floor(20 + Math.random() * 24)}px`;
        const drift = `${(Math.random() - 0.5) * 24}vw`;
        const lift = `${(Math.random() - 0.5) * 18}vh`;

        item.className = 'legendary-sprite is-ghost';
        item.textContent = glyph;
        item.setAttribute('aria-hidden', 'true');
        item.style.left = startX;
        item.style.top = startY;
        item.style.fontSize = size;
        item.style.setProperty('--legendary-wobble', `${1.2 + Math.random() * 1.3}s`);
        item.style.setProperty('--legendary-spin', `${2.4 + Math.random() * 2.6}s`);
        item.style.setProperty('--start-x', startX);
        item.style.setProperty('--start-y', startY);
        item.style.setProperty('--end-x', drift);
        item.style.setProperty('--end-y', lift);

        legendaryStage.appendChild(item);
      }
    }

    function stopMatrixRain() {
      if (matrixModeTimer) {
        window.clearTimeout(matrixModeTimer);
        matrixModeTimer = null;
      }

      if (matrixRainTimer) {
        window.clearInterval(matrixRainTimer);
        matrixRainTimer = null;
      }

      clearBackgroundIcons();
    }

    function spawnMatrixRain() {
      if (reduceMotion || !bgIcons) return;

      const glyphs = ['0', '1', '0', '1', '⟡', '⟐', '░', '▒'];
      const density = isCompactViewport ? 12 : 22;

      for (let index = 0; index < density; index += 1) {
        const item = document.createElement('div');
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const startX = `${Math.random() * 100}vw`;
        const startY = `${-12 - Math.random() * 30}vh`;
        const driftX = `${(Math.random() - 0.5) * 10}vw`;
        const driftY = `${108 + Math.random() * 26}vh`;
        const size = `${Math.floor(14 + Math.random() * 20)}px`;
        const duration = `${2200 + Math.floor(Math.random() * 1800)}ms`;

        item.className = 'bg-icon';
        item.textContent = glyph;
        item.style.setProperty('--icon-color', '#00ff88');
        item.style.setProperty('--icon-size', size);
        item.style.setProperty('--icon-duration', duration);
        item.style.setProperty('--start-x', startX);
        item.style.setProperty('--start-y', startY);
        item.style.setProperty('--end-x', driftX);
        item.style.setProperty('--end-y', driftY);
        item.style.setProperty('--rotate', `${(Math.random() - 0.5) * 12}deg`);
        item.style.left = startX;
        item.style.top = startY;

        bgIcons.appendChild(item);

        window.setTimeout(() => {
          item.remove();
        }, parseInt(duration, 10) + 240);
      }
    }

    function spawnBackgroundIcons(icon, count, options = {}) {
      if (reduceMotion || !bgIcons) return;

      const colorPalette = options.colors ?? colors;
      const duration = options.duration ?? 9000;
      const sizeMin = options.sizeMin ?? 20;
      const sizeMax = options.sizeMax ?? 38;

      for (let index = 0; index < count; index += 1) {
        const item = document.createElement('div');
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const startX = `${Math.random() * 100}vw`;
        const startY = `${Math.random() * 100}vh`;
        const driftX = `${(Math.random() - 0.5) * 36}vw`;
        const driftY = `${-20 - Math.random() * 45}vh`;
        const rotate = `${(Math.random() - 0.5) * 40}deg`;
        const size = `${Math.floor(sizeMin + Math.random() * (sizeMax - sizeMin + 1))}px`;

        item.className = 'bg-icon';
        item.textContent = icon;
        item.style.setProperty('--icon-color', color);
        item.style.setProperty('--icon-size', size);
        item.style.setProperty('--icon-duration', `${duration}ms`);
        item.style.setProperty('--start-x', startX);
        item.style.setProperty('--start-y', startY);
        item.style.setProperty('--end-x', driftX);
        item.style.setProperty('--end-y', driftY);
        item.style.setProperty('--rotate', rotate);
        item.style.left = startX;
        item.style.top = startY;

        bgIcons.appendChild(item);

        window.setTimeout(() => {
          item.remove();
        }, duration + 400);
      }
    }

    function updateEggCounter() {
      const total = eggIds.length;
      const found = eggIds.filter((id) => foundEggs.has(id)).length;

      if (eggCounterValue) {
        eggCounterValue.textContent = `${found}/${total}`;
      }

      if (secretModalProgress) {
        secretModalProgress.textContent = '';
      }

      if (completionTimer) {
        window.clearTimeout(completionTimer);
        completionTimer = null;
      }

      if (finalEggsModalTimer) {
        window.clearTimeout(finalEggsModalTimer);
        finalEggsModalTimer = null;
      }

      if (found === total) {
        completionTimer = window.setTimeout(() => {
          if (secretModalProgress) {
            secretModalProgress.textContent = UI_COPY.everythingFoundProgress;
          }

          secretModalRestart?.classList.add('is-visible');
          eggCounter?.classList.add('is-complete');

          finalEggsModalTimer = window.setTimeout(() => {
            if (!secretModal) return;

            secretModal.classList.add('is-final');
            showModal(UI_COPY.everythingFoundTitle, UI_COPY.everythingFoundText, { updateCounter: false });
            burstParticles(160);
            burstFloatingText('100%', 26);
          }, 900);
        }, 4000);
      } else {
        eggCounter?.classList.toggle('is-complete', false);
        secretModalRestart?.classList.toggle('is-visible', false);
        secretModal?.classList.remove('is-final');
      }

      if (found !== total) {
        secretModalRestart?.classList.toggle('is-visible', false);
      }
    }

    function getMissingEggIds() {
      return eggIds.filter((id) => !foundEggs.has(id));
    }

    function showIdleEggHint() {
      const missingEggs = getMissingEggIds();

      if (missingEggs.length === 0) {
        idleHintTimer = null;
        return;
      }

      const eggId = missingEggs[idleHintCursor % missingEggs.length];
      idleHintCursor += 1;

      showToast(`${UI_COPY.eggHintPrefix}${eggHints[eggId]}`);
      resetIdleHintTimer();
    }

    function resetIdleHintTimer() {
      if (idleHintTimer) {
        window.clearTimeout(idleHintTimer);
      }

      if (getMissingEggIds().length === 0) {
        idleHintTimer = null;
        return;
      }

      idleHintTimer = window.setTimeout(showIdleEggHint, idleHintDelay);
    }

    function resetExperience() {
      foundEggs.clear();
      saveFoundEggs();
      typedBuffer = '';
      konamiIndex = 0;
      clickCombo = 0;
      window.clearTimeout(clickComboTimer);
      window.clearTimeout(longPressTimer);
      resetIdleHintTimer();
      if (completionTimer) {
        window.clearTimeout(completionTimer);
        completionTimer = null;
      }

      if (finalEggsModalTimer) {
        window.clearTimeout(finalEggsModalTimer);
        finalEggsModalTimer = null;
      }
      stopMatrixRain();
      clearLegendaryStage();
      resetBirthdayCode();

      for (const timer of bodyModeTimers.values()) {
        window.clearTimeout(timer);
      }
      bodyModeTimers.clear();

      body.classList.remove(
        'is-party',
        'is-matrix',
        'is-legendary',
        'is-deploy',
        'is-trophy',
        'is-beer',
        'is-bugfix',
        'is-hearts',
        'is-coffee',
        'is-keyboard-frontend',
        'is-keyboard-birthday'
      );
      card.classList.remove('is-party', 'is-matrix', 'is-legendary');
      eggCounter?.classList.remove('is-complete');
      secretModal?.classList.remove('is-final');

      closeModal();
      closeCommandPanel();
      updateEggCounter();
      showToast(UI_COPY.resetProgressToast);
    }

    function unlockEgg(id) {
      if (!eggCatalog[id] || foundEggs.has(id)) {
        updateEggCounter();
        return;
      }

      foundEggs.add(id);
      saveFoundEggs();
      updateEggCounter();
      resetIdleHintTimer();

      const total = eggIds.length;
      const found = eggIds.filter((eggId) => foundEggs.has(eggId)).length;
      showToast(`${UI_COPY.eggFoundPrefix}${eggCatalog[id]} (${found}/${total})`);
    }

    function createParticle() {
      if (reduceMotion || !particles || particles.childElementCount > 96) return;

      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.position = 'absolute';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.borderRadius = '50%';
      particle.style.background = color;
      particle.style.opacity = `${Math.random() * 0.8 + 0.4}`;
      particle.style.boxShadow = `0 0 12px ${color}`;

      particles.appendChild(particle);

      requestAnimationFrame(() => {
        particle.style.transition = 'transform 4s linear, opacity 4s linear';
        particle.style.transform = `translateY(-${window.innerHeight + 100}px)`;
        particle.style.opacity = '0';
      });

      window.setTimeout(() => {
        particle.remove();
      }, 4200);
    }

    function burstParticles(count = 60) {
      if (reduceMotion) return;

      const effectiveCount = isCompactViewport ? Math.max(6, Math.floor(count * 0.6)) : count;
      const spacing = isCompactViewport ? 12 : 8;

      for (let index = 0; index < effectiveCount; index += 1) {
        window.setTimeout(createParticle, index * spacing);
      }
    }

    function burstPartyConfetti(count = 90) {
      if (reduceMotion) return;

      const effectiveCount = isCompactViewport ? Math.max(18, Math.floor(count * 0.55)) : count;
      const palette = ['#00ffcc', '#ff00ff', '#ffdd57', '#00ff88', '#ffffff'];

      for (let index = 0; index < effectiveCount; index += 1) {
        window.setTimeout(() => {
          const item = document.createElement('div');
          const color = palette[Math.floor(Math.random() * palette.length)];
          const startX = `${Math.random() * 100}vw`;
          const startY = `${8 + Math.random() * 34}vh`;
          const endX = `${(Math.random() - 0.5) * 92}vw`;
          const endY = `${44 + Math.random() * 58}vh`;
          const duration = 1800 + Math.floor(Math.random() * 1200);

          item.className = 'party-confetti';
          item.style.setProperty('--start-x', startX);
          item.style.setProperty('--start-y', startY);
          item.style.setProperty('--end-x', endX);
          item.style.setProperty('--end-y', endY);
          item.style.setProperty('--rotate', `${360 + Math.random() * 900}deg`);
          item.style.setProperty('--confetti-w', `${4 + Math.random() * 8}px`);
          item.style.setProperty('--confetti-h', `${10 + Math.random() * 18}px`);
          item.style.setProperty('--confetti-color', color);
          item.style.setProperty('--confetti-duration', `${duration}ms`);

          document.body.appendChild(item);

          window.setTimeout(() => {
            item.remove();
          }, duration + 120);
        }, index * 10);
      }
    }

    function spawnCursorSparks(x, y, count = 10) {
      if (reduceMotion || !cursorFx || cursorFx.childElementCount > 72) return;

      for (let index = 0; index < count; index += 1) {
        const spark = document.createElement('span');
        const color = colors[(index + Math.floor(Math.random() * colors.length)) % colors.length];
        const angle = Math.random() * Math.PI * 2;
        const distance = 46 + Math.random() * 118;
        const size = 1.5 + Math.random() * 3;

        spark.className = 'cursor-spark';
        spark.style.setProperty('--spark-x', `${x}px`);
        spark.style.setProperty('--spark-y', `${y}px`);
        spark.style.setProperty('--spark-end-x', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--spark-end-y', `${Math.sin(angle) * distance}px`);
        spark.style.setProperty('--spark-size', `${size}px`);
        spark.style.setProperty('--spark-color', color);
        spark.style.setProperty('--spark-rotate', `${180 + Math.random() * 540}deg`);
        spark.style.setProperty('--spark-delay', `${index * 12}ms`);

        cursorFx.appendChild(spark);

        window.setTimeout(() => {
          spark.remove();
        }, 760);
      }
    }

    function initCursorEffects() {
      if (reduceMotion || !cursorFx || !cursorComet) return;

      let frame = null;
      let isActive = false;
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let currentX = targetX;
      let currentY = targetY;
      let lastSpawnX = targetX;
      let lastSpawnY = targetY;

      const renderCursorComet = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;

        cursorFx.style.setProperty('--cursor-x', `${currentX.toFixed(2)}px`);
        cursorFx.style.setProperty('--cursor-y', `${currentY.toFixed(2)}px`);

        const dx = currentX - lastSpawnX;
        const dy = currentY - lastSpawnY;
        const distance = Math.hypot(dx, dy);

        if (distance >= 10) {
          const steps = Math.min(6, Math.max(1, Math.floor(distance / 12)));
          const angle = Math.atan2(dy, dx);

          for (let index = 0; index < steps; index += 1) {
            const pixel = document.createElement('span');
            const travel = 10 + index * 7 + Math.random() * 5;
            const size = 4 + Math.random() * 4;
            const color = colors[index % colors.length];

            pixel.className = 'cursor-comet__pixel';
            pixel.style.setProperty('--pixel-x', `${currentX - Math.cos(angle) * travel}px`);
            pixel.style.setProperty('--pixel-y', `${currentY - Math.sin(angle) * travel}px`);
            pixel.style.setProperty('--pixel-size', `${size}px`);
            pixel.style.setProperty('--pixel-color', color);
            pixel.style.setProperty('--pixel-end-x', `${Math.cos(angle) * (18 + index * 10)}px`);
            pixel.style.setProperty('--pixel-end-y', `${Math.sin(angle) * (18 + index * 10)}px`);
            pixel.style.setProperty('--pixel-delay', `${index * 30}ms`);
            pixel.style.setProperty('--pixel-rotate', `${Math.random() > 0.5 ? 90 : 0}deg`);

            cursorFx.appendChild(pixel);

            window.setTimeout(() => {
              pixel.remove();
            }, 760 + index * 30);
          }

          lastSpawnX = currentX;
          lastSpawnY = currentY;
        }

        if (isActive || distance >= 0.5) {
          frame = window.requestAnimationFrame(renderCursorComet);
          return;
        }

        frame = null;
      };

      const requestCursorFrame = () => {
        if (frame === null) {
          frame = window.requestAnimationFrame(renderCursorComet);
        }
      };

      document.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;

        targetX = event.clientX;
        targetY = event.clientY;
        isActive = true;
        cursorFx.classList.add('is-visible');
        requestCursorFrame();
      }, { passive: true });

      document.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary) return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;

        spawnCursorSparks(event.clientX, event.clientY, event.pointerType === 'touch' ? 14 : 24);
      }, { passive: true });

      document.addEventListener('pointerleave', () => {
        isActive = false;
        cursorFx.classList.remove('is-visible');
      }, { passive: true });

      window.addEventListener('blur', () => {
        isActive = false;
        cursorFx.classList.remove('is-visible');
      });
    }

    function showToast(message) {
      if (!toastStack) return;

      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toastStack.appendChild(toast);

      window.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      }, 3200);

      window.setTimeout(() => {
        toast.remove();
      }, 3600);
    }

    function queueToasts(messages, gap = 720) {
      messages.forEach((message, index) => {
        window.setTimeout(() => showToast(message), index * gap);
      });
    }

    function runTerminalResponse(message, options = {}) {
      if (Array.isArray(message)) {
        queueToasts(message, options.gap ?? 720);
        return;
      }

      showToast(message);
    }

    function lockMainContent(locked) {
      if (!card) return;

      const backgroundSelectors = [
        '.card-header',
        '.card-content',
        '.card-footer'
      ];

      backgroundSelectors.forEach((selector) => {
        card.querySelector(selector)?.toggleAttribute('inert', locked);
      });
    }

    function openOverlay(focusTarget) {
      modalRestoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      lockMainContent(true);
      document.body.classList.add('modal-open');

      window.setTimeout(() => {
        focusTarget?.focus?.();
      }, 40);
    }

    function closeOverlay() {
      lockMainContent(false);
      document.body.classList.remove('modal-open');

      const restoreTarget = modalRestoreFocus;
      modalRestoreFocus = null;

      if (restoreTarget?.isConnected) {
        window.setTimeout(() => {
          restoreTarget.focus({ preventScroll: true });
        }, 0);
      }
    }

    function showModal(title, text, options = {}) {
      if (!secretModal || !secretModalTitle || !secretModalText) return;

      secretModalTitle.textContent = title;
      secretModalText.textContent = text;
      if (options.updateCounter !== false) {
        updateEggCounter();
      }
      secretModal.classList.add('is-open');
      secretModal.setAttribute('aria-hidden', 'false');
      openOverlay(secretModalClose);
      flashScreen();
    }

    function closeModal() {
      if (!secretModal) return;

      if (finalEggsModalTimer) {
        window.clearTimeout(finalEggsModalTimer);
        finalEggsModalTimer = null;
      }

      secretModal.classList.remove('is-open');
      secretModal.classList.remove('is-final');
      secretModal.setAttribute('aria-hidden', 'true');
      closeOverlay();
    }

    function openCommandPanel() {
      if (!commandInput) return;

      unlockEgg('terminal');
      playSoundCue('terminal');
      setCommandPanelExpanded(true);
      activateCommandPanel();
      window.setTimeout(() => commandInput.focus(), 40);
    }

    function closeCommandPanel() {
      commandInput?.blur();
      setCommandPanelExpanded(false);
    }

    async function shareBirthday() {
      const shareUrl = window.location.protocol === 'file:' ? 'https://dbaik.github.io/hb/' : window.location.href;
      const shareData = {
        title: UI_COPY.sharePageTitle,
        text: UI_COPY.sharePageText,
        url: shareUrl
      };

      unlockEgg('share');
      addCommandLog(UI_COPY.commandShareLog);

      try {
        if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
          await navigator.share(shareData);
          playSoundCue('success');
          showToast(UI_COPY.shareSentToast);
          burstFloatingText('↗', 12);
          return;
        }

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(`${shareData.text} ${shareUrl}`);
          playSoundCue('success');
          showToast(UI_COPY.shareCopiedToast);
          burstFloatingText('COPY', 8);
          return;
        }

        showModal(UI_COPY.shareFailedModalTitle, `${UI_COPY.shareFailedModalPrefix}${shareUrl}`);
        playSoundCue('warning');
      } catch (error) {
        if (error?.name === 'AbortError') {
          showToast(UI_COPY.shareCancelledToast);
          return;
        }

        playSoundCue('error');
        showToast(UI_COPY.shareFailedToast);
      }
    }

    function setCommandPanelExpanded(expanded) {
      commandPanel?.classList.toggle('is-open', expanded);
      commandPanel?.setAttribute('aria-expanded', String(expanded));

      if (expanded) {
        commandPanelBody?.removeAttribute('inert');
        commandPanelBody?.setAttribute('aria-hidden', 'false');
        commandInput?.removeAttribute('tabindex');
        return;
      }

      commandPanelBody?.setAttribute('inert', '');
      commandPanelBody?.setAttribute('aria-hidden', 'true');
      commandInput?.setAttribute('tabindex', '-1');
    }

    function activateCommandPanel() {
      if (!commandPanel) return;

      if (commandActivationTimer) {
        window.clearTimeout(commandActivationTimer);
      }

      commandPanel.classList.remove('is-activating');
      void commandPanel.offsetWidth;
      commandPanel.classList.add('is-activating');

      commandActivationTimer = window.setTimeout(() => {
        commandPanel.classList.remove('is-activating');
        commandActivationTimer = null;
      }, 760);
    }

    function addCommandLog(html) {
      if (!commandLog) return;

      const line = document.createElement('div');
      line.innerHTML = html;
      commandLog.appendChild(line);
      commandLog.scrollTop = commandLog.scrollHeight;
    }

    commandLog?.addEventListener('click', (event) => {
      const hint = event.target.closest('[data-command]');

      if (!hint) return;

      const command = hint.dataset.command;
      if (!command) return;

      runCommand(command);
    });

    function runCommand(rawCommand) {
      const command = rawCommand.trim().toLowerCase();

      if (!command) {
        const emptyCopy = getRotatingCopy(UI_COPY.emptyCommandHtmlVariants, emptyCommandCopyCursor);
        emptyCommandCopyCursor = emptyCopy.nextCursor;
        addCommandLog(emptyCopy.value);
        playSoundCue('help-pop');
        return;
      }

      const safeCommand = escapeHtml(command);

      addCommandLog(`${UI_COPY.terminalPrompt} <span>${safeCommand}</span>`);

      if (commands[command]) {
        playSoundCue(getCommandSoundCue(command));
        commands[command]();
        playSoundCue('executed');
        return;
      }

      const unknownCopy = getRotatingCopy(UI_COPY.commandUnknownHtmlVariants, unknownCommandCopyCursor);
      const rejectedToast = getRotatingCopy(UI_COPY.commandRejectedToastTemplates, unknownCommandCopyCursor);
      unknownCommandCopyCursor = unknownCopy.nextCursor;

      addCommandLog(unknownCopy.value.replace('{command}', safeCommand));
      playSoundCue('error');
      showToast(rejectedToast.value.replace('{command}', command));
      flashScreen();
      burstFloatingText('404', 6);
    }

    function flashScreen() {
      const flash = document.createElement('div');
      flash.className = 'screen-flash';
      card.appendChild(flash);

      window.setTimeout(() => {
        flash.remove();
      }, 340);
    }

    function setTimedBodyMode(mode, duration) {
      const existingTimer = bodyModeTimers.get(mode);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      body.classList.add(mode);

      const timer = window.setTimeout(() => {
        body.classList.remove(mode);
        bodyModeTimers.delete(mode);
      }, duration);

      bodyModeTimers.set(mode, timer);
    }

    function responsiveCount(mobileCount, desktopCount) {
      return window.innerWidth < 640 ? mobileCount : desktopCount;
    }

    function runIconMode({
      mode,
      duration = 5000,
      icons,
      particles = 60,
      floatingSymbol,
      floatingCount = 18
    }) {
      clearBackgroundIcons();
      setTimedBodyMode(mode, duration);
      playSoundCue(getModeSoundCue(mode));

      icons.forEach((iconConfig) => {
        spawnBackgroundIcons(iconConfig.symbol, iconConfig.count, {
          duration,
          sizeMin: iconConfig.sizeMin,
          sizeMax: iconConfig.sizeMax,
          colors: iconConfig.colors
        });
      });

      burstParticles(particles);

      if (floatingSymbol) {
        burstFloatingText(floatingSymbol, floatingCount);
      }
    }

    function partyMode() {
      clearBackgroundIcons();
      card.classList.add('is-party');
      setTimedBodyMode('is-party', 5000);
      playSoundCue('party');
      spawnBackgroundIcons('🍸', responsiveCount(24, 36), {
        duration: 6000,
        sizeMin: 20,
        sizeMax: 44
      });
      spawnBackgroundIcons('🥃', responsiveCount(18, 28), {
        duration: 6000,
        sizeMin: 20,
        sizeMax: 42
      });
      spawnBackgroundIcons('🍹', responsiveCount(12, 22), {
        duration: 6000,
        sizeMin: 18,
        sizeMax: 40
      });
      spawnBackgroundIcons('🥤', responsiveCount(12, 18), {
        duration: 6000,
        sizeMin: 18,
        sizeMax: 36
      });
      burstParticles(isCompactViewport ? 72 : 120);
      burstPartyConfetti(responsiveCount(44, 90));
      burstFloatingText('🎉', 28);
      showToast(UI_COPY.partyOnToast);

      window.setTimeout(() => {
        card.classList.remove('is-party');
      }, 5000);
    }

    function matrixMode() {
      if (matrixModeTimer) {
        window.clearTimeout(matrixModeTimer);
        matrixModeTimer = null;
      }

      const enabled = !body.classList.contains('is-matrix');

      if (!enabled) {
        body.classList.remove('is-matrix');
        card.classList.remove('is-matrix');
        stopMatrixRain();
        playSoundCue('toggle-off');
        showToast(UI_COPY.matrixOffToast);
        return;
      }

      card.classList.add('is-matrix');
      setTimedBodyMode('is-matrix', 5000);
      playSoundCue('matrix');
      stopMatrixRain();
      spawnMatrixRain();
      matrixRainTimer = window.setInterval(spawnMatrixRain, 420);
      matrixModeTimer = window.setTimeout(() => {
        card.classList.remove('is-matrix');
        stopMatrixRain();
      }, 5000);

      showToast(UI_COPY.matrixOnToast);
    }

    function coffeeMode(
      duration = 5000,
      showModalCopy = false,
      modeTitle = UI_COPY.coffeeModeTitle,
      modeText = UI_COPY.coffeeModeText,
      toastMessage = null
    ) {
      runIconMode({
        mode: 'is-coffee',
        duration,
        icons: [{
          symbol: '☕',
          count: responsiveCount(58, 96),
          sizeMin: 22,
          sizeMax: 54
        }],
        particles: 80,
        floatingSymbol: '☕',
        floatingCount: 24
      });
      showToast(toastMessage ?? (modeTitle === 'BREW MODE'
        ? UI_COPY.brewSpillToast
        : UI_COPY.coffeeSpillToast));

      if (showModalCopy) {
        showToast(modeText);
      }
    }

    function beerMode(showPopup = true) {
      runIconMode({
        mode: 'is-beer',
        duration: 6000,
        icons: [{
          symbol: '🍺',
          count: responsiveCount(48, 84),
          sizeMin: 22,
          sizeMax: 58
        }],
        particles: 70,
        floatingSymbol: '🍺',
        floatingCount: 20
      });
      showToast(UI_COPY.beerToast);
      if (showPopup) {
        showModal(UI_COPY.beerModeModalTitle, UI_COPY.beerModeModalText);
      }
    }

    function bugfixMode(showPopup = true) {
      runIconMode({
        mode: 'is-bugfix',
        duration: 6000,
        icons: [{
          symbol: '+',
          count: responsiveCount(80, 130),
          sizeMin: 18,
          sizeMax: 42
        }],
        particles: 48,
        floatingSymbol: '+',
        floatingCount: 30
      });
      showToast(UI_COPY.bugfixToast);
      if (showPopup) {
        showModal(UI_COPY.bugfixModalTitle, UI_COPY.bugfixModalText);
      }
    }

    function heartMode() {
      runIconMode({
        mode: 'is-hearts',
        duration: 6000,
        icons: [{
          symbol: '♥',
          count: responsiveCount(72, 116),
          sizeMin: 16,
          sizeMax: 40,
          colors: ['#ff5ab9', '#ff79c6', '#ff4fd8', '#ffdd57']
        }],
        particles: 42,
        floatingSymbol: '♥',
        floatingCount: 32
      });
      showToast(UI_COPY.heartToast);
    }

    function trophyMode() {
      runIconMode({
        mode: 'is-trophy',
        duration: 6000,
        icons: [{
          symbol: '🏆',
          count: responsiveCount(18, 28),
          sizeMin: 24,
          sizeMax: 52
        }],
        particles: 36,
        floatingSymbol: '👑',
        floatingCount: 6
      });
      burstFloatingText('★', 10);
      showToast(UI_COPY.trophyToast);
    }

    function legendaryMode(showPopup = true) {
      clearLegendaryStage();
      card.classList.add('is-legendary');
      setTimedBodyMode('is-legendary', 10000);
      playSoundCue('legendary-fanfare');
      burstParticles(isCompactViewport ? 48 : 90);
      spawnLegendaryIcons(isCompactViewport ? 8 : 18);
      legendarySpawnTimer = window.setInterval(() => spawnLegendaryIcons(isCompactViewport ? 3 : 6), isCompactViewport ? 1100 : 820);
      legendaryModeTimer = window.setTimeout(() => {
        card.classList.remove('is-legendary');
        clearLegendaryStage();
      }, 10000);
      if (showPopup) {
        showModal(UI_COPY.legendaryModalTitle, UI_COPY.legendaryModalText);
      }
    }

    function deployBirthday(showPopup = true) {
      if (showPopup) {
        playBirthdayCode();
      }

      setTimedBodyMode('is-deploy', 5000);
      playSoundCue('deploy');
      showToast(UI_COPY.deployToast);
      flashScreen();

      if (showPopup) {
        UI_COPY.deploySteps.forEach((step, index) => {
          window.setTimeout(() => showToast(step), 700 * (index + 1));
        });
      }

      window.setTimeout(() => {
        burstParticles(isCompactViewport ? 60 : 100);
        burstFloatingText('</>', 18);
      }, 2500);
    }

    function keyboardMode(mode, duration, title, text, symbol, count) {
      runIconMode({
        mode,
        duration,
        icons: [{
          symbol,
          count,
          sizeMin: 18,
          sizeMax: 40
        }],
        particles: Math.max(12, Math.floor(count / 2))
      });

      showToast(text);
    }

    function burstFloatingText(symbol, count = 18) {
      const cardRect = card.getBoundingClientRect();

      for (let index = 0; index < count; index += 1) {
        const item = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];

        item.className = 'floating-egg';
        item.textContent = symbol;
        item.style.color = color;
        item.style.left = `${Math.random() * cardRect.width}px`;
        item.style.top = `${Math.random() * cardRect.height}px`;

        card.appendChild(item);

        window.setTimeout(() => {
          item.remove();
        }, 1450);
      }
    }

    function cakeMode() {
      unlockEgg('cake');
      playSoundCue('success');
      burstParticles(18);
      burstFloatingText('♥', 12);
      window.setTimeout(() => burstFloatingText('🎂', 10), 120);
      window.setTimeout(() => burstFloatingText('🎉', 14), 220);
      showToast(UI_COPY.cakeToast);
    }

    function handleSecretTyping(key) {
      if (key.length !== 1) return;

      typedBuffer = `${typedBuffer}${key.toLowerCase()}`.slice(-24);

      if (typedBuffer.includes('frontend')) {
        typedBuffer = '';
        triggerFrontendEgg();
      }

      if (typedBuffer.includes('birthday')) {
        typedBuffer = '';
        triggerBirthdayEgg();
      }

      if (typedBuffer.includes('coffee')) {
        typedBuffer = '';
        triggerCoffeeEgg();
      }
    }

    function handleKonami(key) {
      const expectedKey = konamiCode[konamiIndex];

      if (key === expectedKey) {
        konamiIndex += 1;

        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          unlockEgg('legendary');
          legendaryMode();
        }

        return;
      }

      konamiIndex = key === konamiCode[0] ? 1 : 0;
    }

    function startAmbientParticles() {
      if (ambientParticleTimer || reduceMotion || isCompactViewport || document.hidden || !particles) {
        return;
      }

      ambientParticleTimer = window.setInterval(createParticle, 180);
    }

    function stopAmbientParticles() {
      if (!ambientParticleTimer) return;

      window.clearInterval(ambientParticleTimer);
      ambientParticleTimer = null;
    }

    function updateCompactViewportState(matches) {
      if (matches === isCompactViewport) return;

      isCompactViewport = matches;

      if (isCompactViewport) {
        stopAmbientParticles();
        return;
      }

      startAmbientParticles();
    }

    initCursorEffects();
    startAmbientParticles();

    if (typeof compactViewportQuery.addEventListener === 'function') {
      compactViewportQuery.addEventListener('change', (event) => {
        updateCompactViewportState(event.matches);
      });
    } else if (typeof compactViewportQuery.addListener === 'function') {
      compactViewportQuery.addListener((event) => {
        updateCompactViewportState(event.matches);
      });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAmbientParticles();
        return;
      }

      startAmbientParticles();
    });

    window.addEventListener('pagehide', stopAmbientParticles);

    card.addEventListener('click', (event) => {
      if (longPressTriggered) {
        longPressTriggered = false;
        return;
      }

      const target = event.target.closest('[data-easter]');

      clickCombo += 1;
      window.clearTimeout(clickComboTimer);
      clickComboTimer = window.setTimeout(() => {
        clickCombo = 0;
      }, 900);

      if (clickCombo >= 7) {
        clickCombo = 0;
        unlockEgg('combo');
        showModal(UI_COPY.comboModalTitle, UI_COPY.comboModalText);
        burstFloatingText('QA', 22);
      }

      if (!target) {
        burstParticles(12);
        return;
      }

      const action = target.dataset.easter;

      switch (action) {
        case 'cake':
          cakeMode();
          addCommandLog(UI_COPY.cakeLog);
          break;
        case 'hearts':
          unlockEgg('hearts');
          heartMode();
          addCommandLog(UI_COPY.heartsLog);
          showToast(UI_COPY.heartsToast);
          break;
        case 'portrait':
          unlockEgg('portrait');
          playSoundCue('ui');
          addCommandLog(UI_COPY.portraitLog);
          showToast(UI_COPY.portraitToast);
          burstFloatingText('OK', 10);
          burstParticles(24);
          break;
        case 'achievement':
          unlockEgg('trophy');
          trophyMode();
          break;
        case 'deploy':
          unlockEgg('deploy');
          deployBirthday();
          break;
        case 'terminal':
          openCommandPanel();
          break;
        case 'share':
          void shareBirthday();
          break;
        default:
          showToast(UI_COPY.unknownButtonToast);
      }
    });

    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('button, input')) return;

      window.clearTimeout(longPressTimer);
      longPressTimer = window.setTimeout(() => {
        longPressTriggered = true;
        unlockEgg('longPress');
        addCommandLog(UI_COPY.longPressLog);
        showToast(UI_COPY.longPressDetectedToast);
        burstFloatingText('?', 10);
      }, 700);
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach((eventName) => {
      card.addEventListener(eventName, () => {
        window.clearTimeout(longPressTimer);

        if (longPressTriggered) {
          window.setTimeout(() => {
            longPressTriggered = false;
          }, 400);
        }
      });
    });

    eggCounter?.addEventListener('click', () => {
      playSoundCue('ui');
      showModal(UI_COPY.secretHunterModalTitle, UI_COPY.secretHunterModalText);
    });

    document.addEventListener('keydown', (event) => {
      if (mobileIntro?.classList.contains('is-open')) {
        if (event.key === 'Escape') {
          closeMobileIntro();
        }

        return;
      }

      if (event.key === 'Escape') {
        if (audioModal?.classList.contains('is-open')) {
          closeAudioModal();
          return;
        }

        if (codeModal?.classList.contains('is-open')) {
          resetBirthdayCode();
          return;
        }

        closeModal();
        closeCommandPanel();
        return;
      }

      if (document.activeElement === commandInput) return;

      if (event.key === '/') {
        event.preventDefault();
        openCommandPanel();
        return;
      }

      handleKonami(event.key);
      handleSecretTyping(event.key);
    });

    commandInput?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;

      runCommand(commandInput.value);
      commandInput.value = '';
    });

    document.querySelector('[data-close-secret]')?.addEventListener('click', closeModal);
    document.querySelector('[data-close-code]')?.addEventListener('click', resetBirthdayCode);
    secretModalRestart?.addEventListener('click', resetExperience);
    mobileIntroClose?.addEventListener('click', closeMobileIntro);

    secretModal?.addEventListener('click', (event) => {
      if (event.target === secretModal) closeModal();
    });

    mobileIntro?.addEventListener('click', (event) => {
      if (event.target === mobileIntro) closeMobileIntro();
    });

    codeModal?.addEventListener('click', (event) => {
      if (event.target === codeModal) resetBirthdayCode();
    });

    applyTheme(getResolvedTheme(), { persist: false });
    soundEnabled = readStorageItem(soundStorageKey) === '1';
    updateSoundToggle();
    soundSettingsReady = true;

    themeToggle?.addEventListener('click', toggleTheme);
    languageToggle?.addEventListener('click', toggleLanguage);

    soundToggle?.addEventListener('click', () => {
      if (soundEnabled) {
        playSoundCue('toggle-off');
        void setSoundEnabled(false);
        closeAudioModal();
        showToast(UI_COPY.soundDisabledToast);
        return;
      }

      enableSoundWithWarning();
    });

    audioModalConfirm?.addEventListener('click', async () => {
      setSoundWarningSeen(true);
      await setSoundEnabled(true);
      closeAudioModal();
      playSoundCue('confirm');
      showToast(UI_COPY.soundEnabledToast);
    });

    audioModalCancel?.addEventListener('click', () => {
      setSoundWarningSeen(true);
      closeAudioModal();
      showToast(UI_COPY.silenceWonToast);
    });

    audioModalClose?.addEventListener('click', closeAudioModal);

    audioModal?.addEventListener('click', (event) => {
      if (event.target === audioModal) closeAudioModal();
    });

    ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((eventName) => {
      document.addEventListener(eventName, resetIdleHintTimer, {
        capture: true,
        passive: true
      });
    });

    updateEggCounter();
    resetIdleHintTimer();

    if (window.matchMedia('(max-width: 768px)').matches && !hasSeenMobileIntro()) {
      window.setTimeout(openMobileIntro, 450);
    }

    window.addEventListener('beforeunload', () => {
      stopAmbientParticles();

      if (idleHintTimer) {
        window.clearTimeout(idleHintTimer);
      }
    });
