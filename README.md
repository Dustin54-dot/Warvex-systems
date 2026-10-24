<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#090909">
<title>WARVEX SYSTEMS</title>
<style>
:root{--red:#ff2638;--bg:#090909;--panel:#171717;--text:#fff;--muted:#aaa}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(ellipse at top,#351015,var(--bg) 65%);color:var(--text);font-family:system-ui,sans-serif;min-height:100vh}
header{padding:22px 14px;text-align:center;border-bottom:1px solid #452027;background:#090909}
.logo{font-size:clamp(23px,6vw,34px);font-weight:950;letter-spacing:2px}
.logo span,h1 span{color:var(--red)}
.status{color:#aaa;font-size:13px;margin-top:5px}
main{max-width:760px;margin:auto;padding:20px 14px 40px}
h1{font-size:clamp(27px,7vw,40px);line-height:1.15}
.panel{background:#151515;border:1px solid #382126;border-radius:15px;padding:17px;margin:14px 0}
button,input{font:inherit;border-radius:10px;padding:12px}
button{background:var(--red);border:0;color:white;font-weight:750;cursor:pointer}
button.secondary{background:#292929;border:1px solid #444}
input{background:#090909;border:1px solid #444;color:white;min-width:0;width:100%}
.row{display:flex;gap:8px;margin-top:10px}
.row button{flex-shrink:0}
#reply{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6}
.muted{color:var(--muted);font-size:14px;line-height:1.5}
.commands{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px}
.commands button{text-align:left}
#messages{max-height:350px;overflow:auto}
.msg{padding:10px 12px;border-radius:10px;background:#222;margin:8px 0;white-space:pre-wrap;overflow-wrap:anywhere}
.msg.user{border-left:3px solid var(--red)}
a{color:#ff7783}
footer{text-align:center;color:#888;padding:20px;font-size:12px}
</style>
</head>
<body>
<header>
  <div class="logo">WARVEX <span>SYSTEMS</span></div>
  <div class="status" id="status">● SYSTEM ONLINE · BROWSER-ASSISTENT</div>
</header>

<main>
  <h1>Dein digitaler<br><span>Assistent.</span></h1>
  <p class="muted">Stelle Fragen oder gib einen Befehl ein. Tippe auf einen Schnellbefehl, um ihn zu testen.</p>

  <section class="panel">
    <strong>💬 WARVEX CHAT</strong>
    <div id="messages" aria-live="polite">
      <div class="msg">WARVEX: System bereit. Tippe „Hilfe“, um meine Befehle zu sehen.</div>
    </div>
    <form id="form">
      <div class="row">
        <input id="input" placeholder="Gib einen Befehl ein …" autocomplete="off" maxlength="500" required>
        <button type="submit">Senden</button>
      </div>
    </form>
    <div class="row">
      <button class="secondary" id="mic">🎙️ Sprechen</button>
      <button class="secondary" id="speak">🔊 Vorlesen</button>
      <button class="secondary" id="clear">🗑️ Chat löschen</button>
    </div>
    <p class="muted" id="voiceStatus">Sprachsteuerung hängt von deinem Browser ab.</p>
  </section>

  <section class="panel">
    <strong>⚡ SCHNELLBEFEHLE</strong>
    <div class="commands" style="margin-top:12px">
      <button data-cmd="Wie viel Uhr haben wir?">🕒 Uhrzeit</button>
      <button data-cmd="Wie viel Akku habe ich?">🔋 Akku</button>
      <button data-cmd="Was kannst du?">🤖 Funktionen</button>
      <button data-cmd="Wer hat dich erschaffen?">ℹ️ Über WARVEX</button>
      <button data-cmd="Hilfe">❓ Hilfe</button>
      <button data-cmd="Öffne YouTube">▶️ YouTube öffnen</button>
    </div>
  </section>

  <section class="panel">
    <strong>🌐 WEB-SUCHE</strong>
    <p class="muted">Startet eine echte Suche im Browser.</p>
    <form id="searchForm">
      <div class="row">
        <input id="searchInput" placeholder="Zum Beispiel: Hardtekk" required>
        <button type="submit">Suchen</button>
      </div>
    </form>
  </section>

  <section class="panel">
    <strong>🔋 GERÄTESTATUS</strong>
    <p id="battery">Akkustand wird geprüft …</p>
    <p id="clock">Uhrzeit wird geladen …</p>
    <button class="secondary" id="refresh">Status aktualisieren</button>
  </section>

  <section class="panel">
    <strong>📱 WAS FUNKTIONIERT?</strong>
    <p class="muted">
      Diese Version führt eingebaute Befehle lokal aus, öffnet Websuchen,
      zeigt die Uhrzeit und versucht, den Akkustand auszulesen.
      Sie ist noch keine mit einer echten KI verbundene Plattform.
      Akku- und Mikrofonfunktionen sind vom Browser und seinen Berechtigungen abhängig.
    </p>
  </section>
</main>

<footer>© 2026 WARVEX SYSTEMS · Browser Edition</footer>

<script>
const $ = id => document.getElementById(id);
const messages = $("messages");
let lastAnswer = "System bereit.";

function addMessage(text, type="bot") {
  const div = document.createElement("div");
  div.className = "msg" + (type === "user" ? " user" : "");
  div.textContent = (type === "user" ? "DU: " : "WARVEX: ") + text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function currentTime() {
  return new Intl.DateTimeFormat("de-DE", {
    hour:"2-digit", minute:"2-digit", second:"2-digit",
    timeZone:"Europe/Berlin"
  }).format(new Date());
}

function currentDate() {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle:"full", timeZone:"Europe/Berlin"
  }).format(new Date());
}

async function getBatteryText() {
  if (!navigator.getBattery) {
    return "Dein Browser gibt den Akkustand nicht frei. Prüfe ihn bitte über die Statusleiste deines Handys.";
  }
  try {
    const battery = await navigator.getBattery();
    const percent = Math.round(battery.level * 100);
    return "Dein Akkustand beträgt " + percent + "%." +
      (battery.charging ? " Dein Handy wird gerade geladen." : " Dein Handy wird gerade nicht geladen.");
  } catch {
    return "Der Browser hat den Zugriff auf den Akkustand nicht erlaubt.";
  }
}

function helpText() {
  return [
    "Meine eingebauten Befehle:",
    "• Wie viel Uhr haben wir?",
    "• Welches Datum haben wir?",
    "• Wie viel Akku habe ich?",
    "• Was kannst du?",
    "• Wer hat dich erschaffen?",
    "• Öffne YouTube",
    "• Öffne Google",
    "• Suche nach [Suchbegriff]",
    "• Hilfe",
    "• Lösche den Chat",
    "",
    "Du kannst auch oben auf die Schnellbefehle tippen."
  ].join("\n");
}

async function executeCommand(raw) {
  const text = raw.trim();
  const q = text.toLocaleLowerCase("de-DE");

  if (!q) return "Bitte gib einen Befehl ein.";

  if (/\b(hilfe|befehle|was kann ich sagen)\b/.test(q)) {
    return helpText();
  }

  if (q.includes("wer hat dich erschaffen") ||
      q.includes("wer hat dich erstellt") ||
      q.includes("wer bist du")) {
    return "Ich bin WARVEX SYSTEMS, dein digitaler Browser-Assistent. Diese Version wurde als Web-App mit HTML, CSS und JavaScript erstellt. Ich bin noch nicht mit einer echten KI verbunden.";
  }

  if (q.includes("was kannst du") ||
      q.includes("deine funktionen") ||
      q.includes("was machst du")) {
    return "Ich kann eingebaute Befehle erkennen, die Uhrzeit und das Datum anzeigen, den Akkustand abfragen, Suchseiten öffnen und Antworten vorlesen. Mit kompatiblen Browsern kann ich auch Spracheingaben versuchen. Für freie KI-Gespräche brauche ich noch eine sichere KI-Verbindung.";
  }

  if (q.includes("wie viel uhr") ||
      q.includes("wie spät") ||
      q === "uhrzeit" ||
      q.includes("aktuelle zeit")) {
    return "In Deutschland ist es gerade " + currentTime() + " Uhr.";
  }

  if (q.includes("welches datum") ||
      q.includes("welcher tag") ||
      q.includes("heutiges datum") ||
      q.includes("wie ist das datum")) {
    return "Heute ist " + currentDate() + ".";
  }

  if (q.includes("wie viel akku") ||
      q.includes("akkustand") ||
      q.includes("batteriestand") ||
      q === "akku") {
    return await getBatteryText();
  }

  if (q.includes("öffne youtube") || q === "youtube") {
    window.open("https://www.youtube.com/", "_blank", "noopener");
    return "Ich habe versucht, YouTube in einem neuen Tab zu öffnen. Falls nichts passiert, erlaube Pop-ups oder öffne YouTube direkt.";
  }

  if (q.includes("öffne google") || q === "google") {
    window.open("https://www.google.com/", "_blank", "noopener");
    return "Ich habe versucht, Google in einem neuen Tab zu öffnen.";
  }

  if (q.startsWith("suche nach ") || q.startsWith("suche ")) {
    const term = text.replace(/^suche(\s+nach)?\s*/i, "").trim();
    if (!term) return "Welchen Begriff soll ich suchen?";
    window.open("https://www.google.com/search?q=" + encodeURIComponent(term), "_blank", "noopener");
    return 'Ich habe eine Google-Suche für "' + term + '" gestartet.';
  }

  if (q.includes("vorlesen")) {
    speak(lastAnswer);
    return "Ich lese die letzte Antwort vor, sofern die Sprachfunktion verfügbar ist.";
  }

  if (q.includes("lösche den chat") || q === "chat löschen") {
    messages.replaceChildren();
    lastAnswer = "Der Chat wurde gelöscht.";
    addMessage(lastAnswer);
    return null;
  }

  if (q.includes("hallo") || q.includes("guten tag") ||
      q.includes("guten morgen") || q.includes("hey")) {
    return "Hallo! WARVEX SYSTEMS ist bereit. Probiere „Hilfe“ oder frage nach der Uhrzeit.";
  }

  if (q.includes("danke")) {
    return "Gern! Welchen Befehl soll ich als Nächstes ausführen?";
  }

  return 'Diesen Befehl kenne ich noch nicht. Tippe „Hilfe“, um alle eingebauten Befehle zu sehen. Für eine freie Antwort wie bei ChatGPT fehlt noch die Verbindung zu einer echten KI.';
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    $("voiceStatus").textContent = "Vorlesen wird von deinem Browser nicht unterstützt.";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

async function handleCommand(raw) {
  if (!raw.trim()) return;
  addMessage(raw, "user");
  const answer = await executeCommand(raw);
  if (answer !== null) {
    lastAnswer = answer;
    addMessage(answer);
  }
}

$("form").addEventListener("submit", async event => {
  event.preventDefault();
  const value = $("input").value;
  $("input").value = "";
  await handleCommand(value);
});

document.querySelectorAll("[data-cmd]").forEach(button => {
  button.addEventListener("click", () => handleCommand(button.dataset.cmd));
});

$("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  const term = $("searchInput").value.trim();
  if (!term) return;
  window.open("https://www.google.com/search?q=" + encodeURIComponent(term), "_blank", "noopener");
  addMessage('Websuche gestartet: "' + term + '".');
  $("searchInput").value = "";
});

$("mic").addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("voiceStatus").textContent = "Spracherkennung ist in diesem Browser nicht verfügbar. Nutze die Tastatur oder probiere einen kompatiblen Browser.";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "de-DE";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  $("voiceStatus").textContent = "Ich versuche, dich zu verstehen …";
  recognition.onresult = async event => {
    const spoken = event.results[0][0].transcript;
    $("input").value = spoken;
    $("voiceStatus").textContent = "Erkannt: " + spoken;
    await handleCommand(spoken);
  };
  recognition.onerror = event => {
    $("voiceStatus").textContent = "Spracherkennung: " + event.error + ". Prüfe die Mikrofonberechtigung.";
  };
  recognition.onend = () => {};
  try { recognition.start(); }
  catch { $("voiceStatus").textContent = "Die Spracherkennung konnte nicht gestartet werden. Versuche es erneut."; }
});

$("speak").addEventListener("click", () => speak(lastAnswer));

$("clear").addEventListener("click", () => {
  messages.replaceChildren();
  lastAnswer = "Chat gelöscht.";
  addMessage("Chat gelöscht. System bereit.");
});

function updateClock() {
  $("clock").textContent = "Uhrzeit in Deutschland: " + currentTime() + " Uhr";
}
async function updateBattery() {
  $("battery").textContent = await getBatteryText();
}
$("refresh").addEventListener("click", () => {
  updateClock();
  updateBattery();
});
updateClock();
updateBattery();
setInterval(updateClock, 1000);
</script>
</body>
</html>
