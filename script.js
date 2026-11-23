// Prevent Safari from restoring an old scroll position on reload.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
// Fully random selection, no saved order or cache-busting URLs.
    const backgrounds = [
      { type: "image", src: "media/image1.jpg" },
      { type: "image", src: "media/image2.jpg" },
      { type: "image", src: "media/image3.jpg" },
      { type: "image", src: "media/image4.jpg" },
      { type: "image", src: "media/image5.jpg" },
      { type: "image", src: "media/image7.jpg" },
      { type: "video", src: "media/video1.mp4" }
    ];
    const selected = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const background = document.getElementById("background");
	if (selected.type === "image") {
  background.innerHTML = `<img src="${selected.src}" alt="">`;
	} else {
  background.innerHTML = `
    <video autoplay muted loop playsinline webkit-playsinline preload="auto">
      <source src="${selected.src}" type="video/mp4">
    </video>
  `;

  const video = background.querySelector("video");

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  video.play().catch(error => {
    console.log("Video autoplay unavailable:", error);
  });
}

    const translations = {
      en: {
        pageTitle: "021_BUERO — Architecture & Hospitality",
        intro: "021_BUERO inquires into the conditions of living together.",
        about: "The collective of similar minds plays across transdisciplinary fields of action. It balances conception, reflection and operation within spatial practices, text, image and hospitality.",
        navEntries: "Journal", navAbout: "About", navContact: "Contact", aboutHeading: "About", contactHeading: "Contact",
        aboutDetail: "021_BUERO is a collective working across architecture, text, image and hospitality.",
        bakeryHours: "Wed–Sat 08:00 until sold out",
        qualificationArchitecture: "MSc Architecture ETH",
        bioDario: "He studied at EHL Lausanne and the Basque Culinary Center, and developed research methodologies in the field of gastronomy at Mater/Central in Lima. He worked as a chef at various Michelin-starred restaurants and in concept development and project management at Slowness in Berlin.",
        bioMajella: "She works as a project manager at H. Rüetschi AG and its affiliate Kunstbetrieb AG. There, she oversees various projects, from conceptualization and execution to supporting artists and site development in Aarau and Basel-Land.",
        bioRobin: "After graduating from ETH Zurich with a degree in architecture, he turned his attention back to cycling. As a professional long-distance cyclist, he combines his athletic experiences from around the world with his interest in urban living.",
        bioSamuel: "His apprenticeship as architectural draftsman was followed by a degree in architecture. After earning his independent master’s degree, he received the ETH Medal and the Theo Hotz Award. He then taught at the CUHK in Hong Kong and currently teaches at ETH Zurich at the chair COMTE/MEUWLY.",
		contactArchitecture: "ARCHITECTURE",
		contactProduction: "PRODUCTION",
		contactHospitality: "HOSPITALITY",
		contactText: "Text",
		contactImage: "Image",
		contactSourdough: "SOURDOUGH",
		contactCoffee: "COFFEE",      
      },
      de: {
        pageTitle: "021_BUERO — Architektur & Hospitality",
        intro: "021_BUERO untersucht die Bedingungen des Zusammenlebens.",
        about: "Das Kollektiv aus Gleichdenkenden bespielt Aktionsräume in transdisziplinärer Methodik. Im Umgang mit Architektur, Gastlichkeit, Text und Bild balanciert es Konzeption, Reflexion und Operatives.",
        navEntries: "Journal", navAbout: "Über uns", navContact: "Kontakt", aboutHeading: "Über uns", contactHeading: "Kontakt",
        aboutDetail: "021_BUERO ist ein Kollektiv, das in Architektur, Gastlichkeit, Text und Bild arbeitet.",
        bakeryHours: "Mi–Sa 08:00 bis fertig",
        qualificationArchitecture: "MSc Architektur ETH",
        bioDario: "Er studierte an der EHL Lausanne, dem Basque Culinary Center und entwickelte bei Mater/Central in Lima Forschungsmethodiken für die Gastronomie. Er arbeitete in diversen Sternerestaurants als Koch und bei Slowness in der Konzeption und Projektmanagement.",
        bioMajella: "Sie arbeitete als Projektleiterin in der H. Rüetschi AG und der angegliederten Kunstbetrieb AG. Dort erarbeitet sie verschiedene Projekte von Konzeption, Ausführung, über Betreuung von Kunstschaffenden bis zur Arealentwicklung des Standorts Aarau.",
        bioRobin: "Nach seinem Abschluss an der ETH Zürich in Architektur fokussierte er sich wieder auf das Radfahren. Als professioneller Langdistanz–Radfahrer verbindet er sportliche Erfahrungen aus aller Welt mit Interessen für urbanes Zusammenleben.",
        bioSamuel: "Auf die Hochbauzeichnerlehre folgte das Architekturstudium. Er erhielt nach seinem freien Master-Diplom die ETH-Medaille sowie den Theo Hotz Förderpreis. Darauf unterrichtete er an der CUHK in Hong Kong und aktuell an der ETH Zürich bei der Professur COMTE/MEUWLY.",
		contactArchitecture: "ARCHITEKTUR",
		contactProduction: "PRODUKTION",
		contactHospitality: "Gastlichkeit",
		contactText: "Text",
		contactImage: "Bild", 
		contactSourdough: "SAUERTEIG",
		contactCoffee: "KAFFEE",    
      }
    };

    // JOURNAL: The article list lives in journal.json, not in HTML.
    // Entries are sorted by date (newest first), and both menu and page use the same list.
    let articles = [];
    let journalRequest = 0;
    let activeLanguage = "en";

    function rememberViewport() {
      // Keep the element under the middle of the viewport in place during translation.
      const y = window.innerHeight * 0.5;
      const candidates = [document.getElementById("opening"), document.getElementById("journal-section"),
        ...document.querySelectorAll("#journal-articles .article"),
        ...["about-section", "about-content", "contact-section", "contact-content"].map(id => document.getElementById(id))];
      const visible = candidates.filter(Boolean).find(el => {
        const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y;
      });
      return { element: visible, offset: visible ? visible.getBoundingClientRect().top : 0, scrollY: window.scrollY };
    }
    function restoreViewport(position) {
      const top = position.element && position.element.isConnected
        ? window.scrollY + position.element.getBoundingClientRect().top - position.offset
        : position.scrollY;
      window.scrollTo({ top, behavior: "instant" });
    }

    function renderMarkdown(markdown, articleId) {
      // Intentionally restricted to plain paragraphs, images and image captions.
      // Article text is inserted as textContent, never as executable HTML.
      const container = document.createDocumentFragment();
      const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
      let paragraph = [], lastFigure = null;
      function flushParagraph() {
        if (!paragraph.length) return;
        const p = document.createElement("p");
        p.textContent = paragraph.join(" ");
        container.append(p);
        paragraph = []; lastFigure = null;
      }
      for (const raw of lines) {
        const line = raw.trim();
        if (!line) { flushParagraph(); continue; }
        const picture = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (picture) {
          flushParagraph();
          const filename = picture[2].trim();
          if (!/^[\w.-]+\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) throw new Error(`Invalid image: ${filename}`);
          const figure = document.createElement("figure");
          figure.className = "article-figure";
          const img = document.createElement("img");
          img.src = `media/${articleId}/${filename}`;
          img.alt = picture[1]; img.loading = "lazy";
          figure.append(img); container.append(figure);
          lastFigure = figure;
          continue;
        }
        const caption = line.match(/^\*(.+)\*$/);
        if (caption && lastFigure) {
          // Captions in existing Markdown are intentionally not displayed.
          lastFigure = null;
          continue;
        }
        if (line.startsWith("# ")) { flushParagraph(); continue; }
        paragraph.push(line);
      }
      flushParagraph();
      return container;
    }

    function buildJournal() {
      const list = document.getElementById("journal-articles");
      const submenu = document.getElementById("journalSubmenu");
      list.replaceChildren(); submenu.replaceChildren();
      for (const item of articles) {
        const section = document.createElement("article");
        section.className = "article"; section.id = `article-${item.id}`;
        const inner = document.createElement("div"); inner.className = "article-inner";
        const title = document.createElement("h3"); title.textContent = item.title;
        const date = document.createElement("time"); date.className = "article-date";
        date.dateTime = item.date;
        const [year, month, day] = item.date.split("-");
        date.textContent = `${day}.${month}.${year}`;
        const body = document.createElement("div"); body.className = "journal-body";
        body.textContent = "…";
        inner.append(title, date, body); section.append(inner); list.append(section);
        const link = document.createElement("a");
        link.href = `#article-${item.id}`;
        link.textContent = item.title;
        submenu.append(link);
      }
      // The menu's existing delegated anchor listener also handles generated links.
    }

    async function initializeJournal() {
      try {
        const response = await fetch("journal.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.articles)) throw new Error("journal.json: articles must be an array");
        const ids = new Set();
        articles = data.articles.map(item => {
          if (!item || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) ||
              !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || typeof item.title !== "string" || !item.title.trim() || ids.has(item.id)) {
            throw new Error("Invalid or duplicate entry in journal.json");
          }
          ids.add(item.id);
          return item;
        }).sort((a,b) => b.date.localeCompare(a.date));
        buildJournal();
        await loadJournal(activeLanguage);
        // Direct links work even when the articles were added asynchronously.
        const hash = decodeURIComponent(location.hash.slice(1));
        if (hash.startsWith("article-") && document.getElementById(hash)) {
          document.getElementById(hash).scrollIntoView({behavior:"instant"});
        }
      } catch (error) {
        console.error("Journal index error:", error);
        document.getElementById("journal-articles").textContent = "Journal konnte nicht geladen werden. Bitte journal.json prüfen.";
      }
    }

    async function loadJournal(lang) {
      activeLanguage = lang;
      const request = ++journalRequest;
      if (!articles.length) return;
      const results = await Promise.all(articles.map(async item => {
        try {
          const response = await fetch(`media/${item.id}/artikel_${lang}.md`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return { id:item.id, content: renderMarkdown(await response.text(), item.id) };
        } catch (error) {
          console.error(`Article ${item.id}:`,error);
          const p = document.createElement("p");
          p.textContent = lang === "de" ? `Artikel konnte nicht geladen werden: ${item.id}` : `Could not load article: ${item.id}`;
          const fragment = document.createDocumentFragment(); fragment.append(p);
          return { id:item.id, content:fragment };
        }
      }));
      if (request !== journalRequest) return;
      const viewport = rememberViewport();
      // Keep old content until all translations are ready to prevent scroll jumps.
      for (const result of results) {
        const body = document.querySelector(`#article-${result.id} .journal-body`);
        if (body) body.replaceChildren(result.content);
      }
      restoreViewport(viewport);
      requestAnimationFrame(() => restoreViewport(viewport));
    }

    function setLanguage(lang) {
      const viewport = rememberViewport();
      const t = translations[lang] || translations.en;
      document.documentElement.lang = lang;
      document.title = t.pageTitle;
      document.getElementById("bakeryHours").textContent = t.bakeryHours;
      for (const key of [
 		 "contactArchitecture",
 		 "contactProduction",
 		 "contactSourdough",
 		 "contactCoffee"
	]) {
	  document.getElementById(key).textContent = t[key];
		}
      document.getElementById("introLine").textContent = t.intro;
      document.getElementById("aboutLine").textContent = t.about;
      for (const name of ["Dario", "Majella", "Robin", "Samuel"]) {
        document.getElementById("bio" + name).textContent = t["bio" + name];
      }
      for (const name of ["Majella", "Robin", "Samuel"]) {
        document.getElementById("qualification" + name).textContent = t.qualificationArchitecture;
      }
      for (const key of ["navEntries", "navAbout", "navContact", "aboutHeading", "contactHeading", "aboutDetail"]) {
        document.getElementById(key).textContent = t[key];
      }
      document.querySelectorAll("[data-language]").forEach(b => b.classList.toggle("active",b.dataset.language === lang));
      try { localStorage.setItem("language",lang); } catch(e) {}
      restoreViewport(viewport);
      loadJournal(lang);
    }
    document.querySelectorAll("[data-language]").forEach(b => b.addEventListener("click",() => setLanguage(b.dataset.language)));
    let savedLanguage;
    try { savedLanguage = localStorage.getItem("language"); } catch(e) {}
    setLanguage(savedLanguage === "de" || savedLanguage === "en" ? savedLanguage : (navigator.language.toLowerCase().startsWith("de") ? "de" : "en"));
    initializeJournal();

    const opening = document.getElementById("opening");
    const sticky = document.getElementById("openingSticky");
    function updateOpening() {
      const distance = Math.max(1,opening.offsetHeight - window.innerHeight);
      const progress = Math.min(1,Math.max(0,-opening.getBoundingClientRect().top / distance));
      // Transition is driven by scrolling, not by time or wheel event interception.
      const titleFade = Math.min(1,progress / .42);
      const introFade = Math.min(1,Math.max(0,(progress - .35) / .38));
      sticky.style.setProperty("--title-opacity",(1-titleFade).toFixed(3));
      sticky.style.setProperty("--title-up",`${Math.round(progress * 110)}px`);
      sticky.style.setProperty("--intro-opacity",introFade.toFixed(3));
      sticky.style.setProperty("--veil",(progress * .28).toFixed(3));
      document.getElementById("intro").style.pointerEvents = introFade > .9 ? "auto" : "none";
      document.getElementById("intro").classList.toggle("is-clickable", introFade > .9);
      document.getElementById("openIntro").style.pointerEvents = titleFade > .95 ? "none" : "auto";
    }
    let scheduled = false;
    window.addEventListener("scroll",() => {
      if (!scheduled) requestAnimationFrame(() => { updateOpening(); scheduled = false; });
      scheduled = true;
    },{passive:true});
    window.addEventListener("resize",updateOpening);
    document.getElementById("openIntro").addEventListener("click",() => {
      window.scrollTo({top:opening.offsetHeight - window.innerHeight,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    });
    // Clicking the introduction returns to the opening wordmark on the same image/video.
    function returnToWordmark() {
      window.scrollTo({top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    }
    const intro = document.getElementById("intro");
    intro.addEventListener("click", returnToWordmark);
    intro.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); returnToWordmark(); }
    });

    const menuToggle = document.getElementById("menuToggle");
    const menuPanel = document.getElementById("menuPanel");
    const journalMenuItem = document.getElementById("journalMenuItem");
    const journalMenuLink = document.getElementById("navEntries");
    function closeMenu() {
      menuPanel.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      journalMenuItem.classList.remove("submenu-open");
      journalMenuLink.setAttribute("aria-expanded", "false");
    }
    // On touchscreens, first tap Journal opens its submenu; second tap follows the section link.
    journalMenuLink.addEventListener("click", event => {
      if (window.matchMedia("(hover: none)").matches && !journalMenuItem.classList.contains("submenu-open")) {
        event.preventDefault();
        event.stopPropagation();
        journalMenuItem.classList.add("submenu-open");
        journalMenuLink.setAttribute("aria-expanded", "true");
      }
    });
    menuToggle.addEventListener("click", () => {
      const open = menuPanel.hidden;
      menuPanel.hidden = !open;
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    // Navigate explicitly on touch devices as well as desktop browsers.
    menuPanel.querySelectorAll("a[href^='#']").forEach(a => {
      a.addEventListener("click", event => {
        const target = document.getElementById(a.getAttribute("href").slice(1));
        if (!target) return;
        event.preventDefault();
        closeMenu();
        // Scroll after closing the panel; no dependency on Safari anchor handling.
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
    });
    document.addEventListener("click", e => { if (!e.target.closest(".site-menu")) closeMenu(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    updateOpening();
