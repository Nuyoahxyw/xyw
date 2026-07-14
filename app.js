(function () {
  "use strict";

  const STORAGE_KEY = "csharp-keyword-lab-v1";
  const levelNames = { 0: "全部难度", 1: "入门", 2: "进阶", 3: "深入" };
  const titles = {
    practice: ["DAILY PRACTICE", language => `今天，从一个 ${language} 关键词开始`],
    dictionary: ["KEYWORD DICTIONARY", language => `把 ${language} 语法，读懂也读准`],
    wrong: ["REVIEW QUEUE", () => "把错误变成下一次的直觉"]
  };

  const defaultProgress = {
    attempts: 0,
    correct: 0,
    byWord: {},
    wrong: {},
    sessions: 0
  };

  let currentLanguage = "csharp";
  activateLanguageBank(currentLanguage);
  let progress = loadProgress();
  let currentView = "practice";
  let settings = { category: "全部", kind: "全部类型", level: 0, count: 20, wrongOnly: false };
  let session = null;
  let dictionaryQuery = "";
  let dictionaryCategory = "全部";
  let dictionaryKind = "全部类型";
  let toastTimer = null;

  const app = document.getElementById("app");
  const sidebar = document.querySelector(".sidebar");
  const mobileMenu = document.getElementById("mobileMenu");

  function activeBank() {
    return window.LANGUAGE_BANKS[currentLanguage];
  }

  function activateLanguageBank(language) {
    const bank = window.LANGUAGE_BANKS[language];
    if (!bank) throw new Error(`Unknown language bank: ${language}`);
    window.KEYWORDS = bank.keywords;
    window.RESERVED_KEYWORDS = bank.reserved;
    window.CONTEXTUAL_KEYWORDS = bank.contextual;
    window.CATEGORIES = ["全部", ...new Set(bank.keywords.map(item => item.c))];
  }

  function progressStorageKey() {
    return currentLanguage === "csharp" ? STORAGE_KEY : `${STORAGE_KEY}-${currentLanguage}`;
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(progressStorageKey()));
      return saved && typeof saved === "object"
        ? { ...defaultProgress, ...saved, byWord: saved.byWord || {}, wrong: saved.wrong || {} }
        : structuredClone(defaultProgress);
    } catch (_) {
      return structuredClone(defaultProgress);
    }
  }

  function saveProgress() {
    localStorage.setItem(progressStorageKey(), JSON.stringify(progress));
    updateStats();
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getPool() {
    let pool = [...window.KEYWORDS];
    if (settings.wrongOnly) {
      pool = pool.filter(item => progress.wrong[item.w]);
    }
    if (settings.category !== "全部") {
      pool = pool.filter(item => item.c === settings.category);
    }
    if (settings.kind !== "全部类型") {
      pool = pool.filter(item => item.kind === settings.kind);
    }
    if (Number(settings.level) > 0) {
      pool = pool.filter(item => item.l === Number(settings.level));
    }
    return pool;
  }

  function makeQuestion(item, index) {
    const similar = window.KEYWORDS.filter(candidate => candidate.w !== item.w && candidate.c === item.c);
    const others = window.KEYWORDS.filter(candidate => candidate.w !== item.w && candidate.c !== item.c);
    const distractors = shuffle([...similar, ...shuffle(others)]).slice(0, 3);
    const type = index % 2 === 0 ? "meaning" : "keyword";
    const rawOptions = type === "meaning"
      ? [item, ...distractors].map(option => ({ key: option.w, label: option.summary }))
      : [item, ...distractors].map(option => ({ key: option.w, label: option.w }));

    return {
      item,
      type,
      prompt: type === "meaning"
        ? `“${item.w}” 最准确的含义是？`
        : `哪个关键词最符合这段描述：${item.summary}`,
      options: shuffle(rawOptions),
      answer: item.w
    };
  }

  function startSession(overrides) {
    settings = { ...settings, ...(overrides || {}) };
    const pool = getPool();
    if (!pool.length) {
      showToast(settings.wrongOnly ? "当前没有可复习的错题" : "这个筛选条件下没有题目");
      if (settings.wrongOnly) switchView("wrong");
      return;
    }

    const requested = settings.count === "all" ? pool.length : Number(settings.count);
    const selected = shuffle(pool).slice(0, Math.min(requested, pool.length));
    session = {
      questions: selected.map(makeQuestion),
      index: 0,
      answered: false,
      selected: null,
      sessionCorrect: 0,
      complete: false
    };
    currentView = "practice";
    syncViewChrome();
    render();
  }

  function answerQuestion(selected) {
    if (!session || session.answered || session.complete) return;
    const question = session.questions[session.index];
    const correct = selected === question.answer;
    session.answered = true;
    session.selected = selected;
    progress.attempts += 1;
    progress.byWord[question.item.w] = progress.byWord[question.item.w] || { attempts: 0, correct: 0 };
    progress.byWord[question.item.w].attempts += 1;

    if (correct) {
      progress.correct += 1;
      progress.byWord[question.item.w].correct += 1;
      session.sessionCorrect += 1;
      if (progress.wrong[question.item.w] && progress.byWord[question.item.w].correct >= 2) {
        delete progress.wrong[question.item.w];
      }
    } else {
      progress.wrong[question.item.w] = (progress.wrong[question.item.w] || 0) + 1;
    }
    saveProgress();
    renderPractice();
  }

  function nextQuestion() {
    if (!session || !session.answered) return;
    if (session.index >= session.questions.length - 1) {
      session.complete = true;
      progress.sessions += 1;
      saveProgress();
    } else {
      session.index += 1;
      session.answered = false;
      session.selected = null;
    }
    renderPractice();
  }

  function speak(word) {
    if (!("speechSynthesis" in window)) {
      showToast("当前浏览器不支持语音朗读，请参考页面音标");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => /^en-(US|GB)/i.test(voice.lang)) || null;
    utterance.lang = utterance.voice ? utterance.voice.lang : "en-US";
    utterance.rate = 0.72;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function renderPractice() {
    if (!session) {
      startSession();
      return;
    }

    if (session.complete) {
      const percent = Math.round((session.sessionCorrect / session.questions.length) * 100);
      app.innerHTML = `
        <div class="practice-layout">
          <section class="quiz-card session-complete">
            <p class="panel-kicker">SESSION COMPLETE</p>
            <div class="score">${percent}%</div>
            <h2>${percent >= 85 ? "这一轮很扎实" : percent >= 60 ? "知识正在连成线" : "错题已经替你标出来了"}</h2>
            <p>本轮答对 ${session.sessionCorrect} / ${session.questions.length} 题。掌握不是一次答对，而是隔一段时间仍然能认出来。</p>
            <div class="session-actions">
              <button class="primary-button" type="button" data-action="restart">再练一轮</button>
              <button class="secondary-button" type="button" data-action="review-wrong">复习错题</button>
            </div>
          </section>
          ${renderSessionPanel()}
        </div>`;
      bindPracticeEvents();
      return;
    }

    const question = session.questions[session.index];
    const item = question.item;
    const answerIndex = question.options.findIndex(option => option.key === question.answer);
    const wasCorrect = session.selected === question.answer;

    app.innerHTML = `
      <div class="practice-layout">
        <section class="quiz-card" data-testid="quiz-card">
          <div class="quiz-meta">
            <span class="question-count">QUESTION ${String(session.index + 1).padStart(2, "0")} / ${String(session.questions.length).padStart(2, "0")}</span>
            <div class="tag-row">
              <span class="tag kind-tag">${escapeHtml(item.kind)}</span>
              <span class="tag">${escapeHtml(item.c)}</span>
              <span class="tag level-${item.l}">${levelNames[item.l]}</span>
            </div>
          </div>

          <div class="word-line">
            <h2 class="keyword">${escapeHtml(item.w)}</h2>
            <button class="speak-button" type="button" data-speak="${escapeHtml(item.speech || item.w)}" aria-label="朗读 ${escapeHtml(item.w)}">PLAY</button>
          </div>
          <div class="pronunciation"><span>${escapeHtml(item.ipa)}</span><span>近似：${escapeHtml(item.cn)}</span></div>

          <p class="question-prompt">${escapeHtml(question.prompt)}</p>
          <div class="options">
            ${question.options.map((option, index) => {
              let className = "option";
              if (session.answered && option.key === question.answer) className += " is-correct";
              if (session.answered && option.key === session.selected && option.key !== question.answer) className += " is-wrong";
              return `<button class="${className}" type="button" data-answer="${escapeHtml(option.key)}" ${session.answered ? "disabled" : ""}>
                <span class="option-key">${index + 1}</span><span>${escapeHtml(option.label)}</span>
              </button>`;
            }).join("")}
          </div>

          ${session.answered ? `
            <section class="explanation">
              <div class="result-line ${wasCorrect ? "result-correct" : "result-wrong"}">
                <strong>${wasCorrect ? "回答正确" : "这题需要再见一次"}</strong>
                <span>正确答案是 ${answerIndex + 1}. ${escapeHtml(question.options[answerIndex].label)}</span>
              </div>
              <p>${escapeHtml(item.detail)}</p>
              <h3>最小示例</h3>
              <pre class="code-block"><code>${escapeHtml(item.code)}</code></pre>
              <h3>容易混淆</h3>
              <p class="tip">${escapeHtml(item.tip)}</p>
              <div class="next-row">
                <button class="primary-button" type="button" data-action="next">${session.index === session.questions.length - 1 ? "查看结果" : "下一题"}</button>
              </div>
            </section>` : ""}
        </section>
        ${renderSessionPanel()}
      </div>`;
    bindPracticeEvents();
  }

  function renderSessionPanel() {
    return `
      <aside class="session-panel" aria-label="练习设置">
        <p class="panel-kicker">PRACTICE SETTINGS</p>
        <p class="language-standard">${escapeHtml(activeBank().standard)}</p>
        <div class="field">
          <label for="categorySelect">分类</label>
          <select id="categorySelect">
            ${window.CATEGORIES.map(category => `<option value="${escapeHtml(category)}" ${settings.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="kindSelect">关键词类型</label>
          <select id="kindSelect">
            ${["全部类型", ...new Set(window.KEYWORDS.map(item => item.kind))].map(kind => `<option value="${escapeHtml(kind)}" ${settings.kind === kind ? "selected" : ""}>${escapeHtml(kind)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="levelSelect">难度</label>
          <select id="levelSelect">
            ${Object.entries(levelNames).map(([value, label]) => `<option value="${value}" ${Number(settings.level) === Number(value) ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label for="countSelect">题量</label>
          <select id="countSelect">
            <option value="10" ${String(settings.count) === "10" ? "selected" : ""}>10 题</option>
            <option value="20" ${String(settings.count) === "20" ? "selected" : ""}>20 题</option>
            <option value="all" ${settings.count === "all" ? "selected" : ""}>全部</option>
          </select>
        </div>
        <button class="primary-button" type="button" data-action="new-session">按此设置出题</button>
        <p class="session-note">数字键 1-4 作答，回车进入下一题。读音由本机浏览器语音包提供。</p>
      </aside>`;
  }

  function bindPracticeEvents() {
    app.querySelectorAll("[data-answer]").forEach(button => {
      button.addEventListener("click", () => answerQuestion(button.dataset.answer));
    });
    app.querySelectorAll("[data-speak]").forEach(button => {
      button.addEventListener("click", () => speak(button.dataset.speak));
    });

    const next = app.querySelector('[data-action="next"]');
    if (next) next.addEventListener("click", nextQuestion);

    const newSession = app.querySelector('[data-action="new-session"]');
    if (newSession) {
      newSession.addEventListener("click", () => {
        const category = document.getElementById("categorySelect").value;
        const kind = document.getElementById("kindSelect").value;
        const level = Number(document.getElementById("levelSelect").value);
        const countValue = document.getElementById("countSelect").value;
        startSession({ category, kind, level, count: countValue, wrongOnly: false });
      });
    }

    const restart = app.querySelector('[data-action="restart"]');
    if (restart) restart.addEventListener("click", () => startSession({ wrongOnly: false }));
    const reviewWrong = app.querySelector('[data-action="review-wrong"]');
    if (reviewWrong) reviewWrong.addEventListener("click", () => startSession({ category: "全部", level: 0, count: "all", wrongOnly: true }));
  }

  function renderDictionary() {
    const normalized = dictionaryQuery.trim().toLowerCase();
    const entries = window.KEYWORDS.filter(item => {
      const matchesCategory = dictionaryCategory === "全部" || item.c === dictionaryCategory;
      const matchesKind = dictionaryKind === "全部类型" || item.kind === dictionaryKind;
      const haystack = `${item.w} ${item.summary} ${item.detail} ${item.c} ${item.kind}`.toLowerCase();
      return matchesCategory && matchesKind && (!normalized || haystack.includes(normalized));
    });

    app.innerHTML = `
      <section class="dictionary-wrap">
        <div class="dictionary-toolbar">
          <input class="search-input" id="dictionarySearch" type="search" placeholder="搜索关键词或中文含义" value="${escapeHtml(dictionaryQuery)}" aria-label="搜索关键词">
          <select id="dictionaryCategory" aria-label="按分类筛选">
            ${window.CATEGORIES.map(category => `<option value="${escapeHtml(category)}" ${dictionaryCategory === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
          </select>
          <select id="dictionaryKind" aria-label="按关键词类型筛选">
            ${["全部类型", ...new Set(window.KEYWORDS.map(item => item.kind))].map(kind => `<option value="${escapeHtml(kind)}" ${dictionaryKind === kind ? "selected" : ""}>${escapeHtml(kind)}</option>`).join("")}
          </select>
        </div>
        <div class="result-summary"><span>${escapeHtml(activeBank().standard)} · 当前 ${entries.length} 项</span><span>点击条目展开完整解释</span></div>
        <div class="dictionary-list">
          ${entries.length ? entries.map(renderDictionaryEntry).join("") : `
            <div class="empty-state"><strong>没有找到匹配项</strong><p>试试英文拼写、中文含义，或把分类切回「全部」。</p></div>`}
        </div>
      </section>`;

    const search = document.getElementById("dictionarySearch");
    search.addEventListener("input", () => {
      dictionaryQuery = search.value;
      renderDictionary();
      const nextSearch = document.getElementById("dictionarySearch");
      nextSearch.focus();
      nextSearch.setSelectionRange(dictionaryQuery.length, dictionaryQuery.length);
    });
    document.getElementById("dictionaryCategory").addEventListener("change", event => {
      dictionaryCategory = event.target.value;
      renderDictionary();
    });
    document.getElementById("dictionaryKind").addEventListener("change", event => {
      dictionaryKind = event.target.value;
      renderDictionary();
    });
    app.querySelectorAll("[data-speak]").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        speak(button.dataset.speak);
      });
    });
  }

  function renderDictionaryEntry(item) {
    return `
      <details class="keyword-entry">
        <summary>
          <span class="entry-word">${escapeHtml(item.w)}</span>
          <span class="entry-summary">${escapeHtml(item.summary)}</span>
        </summary>
        <div class="entry-detail">
          <div class="entry-head">
            <div class="entry-pronounce"><strong>${escapeHtml(item.ipa)}</strong><br>中文近似：${escapeHtml(item.cn)}</div>
            <button class="small-speak" type="button" data-speak="${escapeHtml(item.speech || item.w)}">朗读</button>
          </div>
          <div class="tag-row"><span class="tag kind-tag">${escapeHtml(item.kind)}</span><span class="tag">${escapeHtml(item.c)}</span><span class="tag level-${item.l}">${levelNames[item.l]}</span></div>
          <h3>详细解释</h3><p>${escapeHtml(item.detail)}</p>
          <h3>代码示例</h3><pre class="code-block"><code>${escapeHtml(item.code)}</code></pre>
          <h3>容易混淆</h3><p class="tip">${escapeHtml(item.tip)}</p>
        </div>
      </details>`;
  }

  function renderWrong() {
    const entries = Object.keys(progress.wrong)
      .map(word => window.KEYWORDS.find(item => item.w === word))
      .filter(Boolean)
      .sort((a, b) => (progress.wrong[b.w] || 0) - (progress.wrong[a.w] || 0));

    app.innerHTML = `
      <section class="wrong-wrap">
        ${entries.length ? `
          <div class="wrong-head">
            <div><h2>${entries.length} 个关键词等待复习</h2><p>同一个关键词连续答对后会自动移出错题队列。</p></div>
            <button class="primary-button" type="button" data-action="start-wrong">开始错题练习</button>
          </div>
          <div class="wrong-grid">
            ${entries.map(item => `
              <article class="wrong-card">
                <h3>${escapeHtml(item.w)}</h3>
                <p>${escapeHtml(item.summary)}</p>
                <footer><span>累计答错 ${progress.wrong[item.w]} 次</span><button class="small-speak" type="button" data-speak="${escapeHtml(item.speech || item.w)}">朗读</button></footer>
              </article>`).join("")}
          </div>` : `
          <div class="empty-state">
            <strong>错题本还是空的</strong>
            <p>完成练习后，答错的关键词会自动来到这里；不需要手动整理。</p>
            <button class="primary-button" type="button" data-action="go-practice">开始一轮练习</button>
          </div>`}
      </section>`;

    const startWrong = app.querySelector('[data-action="start-wrong"]');
    if (startWrong) startWrong.addEventListener("click", () => startSession({ category: "全部", level: 0, count: "all", wrongOnly: true }));
    const goPractice = app.querySelector('[data-action="go-practice"]');
    if (goPractice) goPractice.addEventListener("click", () => switchView("practice"));
    app.querySelectorAll("[data-speak]").forEach(button => button.addEventListener("click", () => speak(button.dataset.speak)));
  }

  function updateStats() {
    const studied = Object.keys(progress.byWord).length;
    const mastered = Object.values(progress.byWord).filter(item => item.correct >= 2 && item.correct / item.attempts >= 0.67).length;
    const mastery = Math.round((mastered / window.KEYWORDS.length) * 100);
    const correctRate = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;
    document.getElementById("masteryPercent").textContent = `${mastery}%`;
    document.getElementById("masteryBar").style.width = `${mastery}%`;
    document.getElementById("seenCount").textContent = `${studied}/${window.KEYWORDS.length}`;
    document.getElementById("correctRate").textContent = `${correctRate}%`;
    document.getElementById("wrongCount").textContent = Object.keys(progress.wrong).length;
  }

  function syncViewChrome() {
    const [eyebrow, title] = titles[currentView];
    document.getElementById("viewEyebrow").textContent = `${activeBank().name} · ${eyebrow}`;
    document.getElementById("viewTitle").textContent = title(activeBank().name);
    document.getElementById("brandMark").textContent = activeBank().mark || activeBank().name;
    document.querySelectorAll(".nav-item").forEach(button => {
      button.classList.toggle("is-active", button.dataset.view === currentView);
    });
    document.querySelectorAll(".language-button").forEach(button => {
      button.classList.toggle("is-active", button.dataset.language === currentLanguage);
    });
  }

  function switchLanguage(language) {
    if (language === currentLanguage) return;
    currentLanguage = language;
    activateLanguageBank(language);
    progress = loadProgress();
    settings = { category: "全部", kind: "全部类型", level: 0, count: 20, wrongOnly: false };
    dictionaryQuery = "";
    dictionaryCategory = "全部";
    dictionaryKind = "全部类型";
    session = null;
    sidebar.classList.remove("is-open");
    mobileMenu.setAttribute("aria-expanded", "false");
    syncViewChrome();
    render();
    showToast(`已切换到 ${activeBank().name} 题库`);
  }

  function switchView(view) {
    currentView = view;
    sidebar.classList.remove("is-open");
    mobileMenu.setAttribute("aria-expanded", "false");
    syncViewChrome();
    render();
  }

  function render() {
    if (currentView === "dictionary") renderDictionary();
    else if (currentView === "wrong") renderWrong();
    else renderPractice();
    updateStats();
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelectorAll(".language-button").forEach(button => {
    button.addEventListener("click", () => switchLanguage(button.dataset.language));
  });

  mobileMenu.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    mobileMenu.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll("[data-reset-progress]").forEach(button => {
    button.addEventListener("click", () => {
      const shouldReset = window.confirm(`确定清空 ${activeBank().name} 的所有练习记录和错题吗？此操作无法撤销。`);
      if (!shouldReset) return;
      progress = structuredClone(defaultProgress);
      saveProgress();
      session = null;
      sidebar.classList.remove("is-open");
      mobileMenu.setAttribute("aria-expanded", "false");
      showToast(`${activeBank().name} 学习记录已重置`);
      render();
    });
  });

  document.addEventListener("keydown", event => {
    if (currentView !== "practice" || !session || session.complete) return;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    if (!session.answered && /^[1-4]$/.test(event.key)) {
      const question = session.questions[session.index];
      const option = question.options[Number(event.key) - 1];
      if (option) answerQuestion(option.key);
    } else if (session.answered && event.key === "Enter") {
      nextQuestion();
    }
  });

  updateStats();
  startSession();
})();
