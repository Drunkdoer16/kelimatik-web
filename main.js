import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const root = document.getElementById("app");
root.innerHTML = `
  <h1 style="text-align:center;">📘 Kelimatik</h1>
  <div style="text-align:center;">
    <input id="eng" placeholder="English word" />
    <input id="tr" placeholder="Türkçe karşılığı" />
    <button id="saveBtn">Kaydet</button>
  </div>
  <div id="wordList" style="margin-top:20px;text-align:center;"></div>
`;

const engInput = document.getElementById("eng");
const trInput = document.getElementById("tr");
const saveBtn = document.getElementById("saveBtn");
const wordList = document.getElementById("wordList");

async function renderWords() {
  wordList.innerHTML = "<p>Yükleniyor...</p>";
  const querySnapshot = await getDocs(collection(db, "words"));
  let html = "";
  querySnapshot.forEach((doc) => {
    const w = doc.data();
    html += `<p>🇬🇧 ${w.eng} → 🇹🇷 ${w.tr}</p>`;
  });
  wordList.innerHTML = html || "<p>Henüz kelime yok.</p>";
}

saveBtn.addEventListener("click", async () => {
  const eng = engInput.value.trim();
  const tr = trInput.value.trim();
  if (!eng || !tr) return alert("İki alanı da doldur.");
  await addDoc(collection(db, "words"), { eng, tr });
  engInput.value = "";
  trInput.value = "";
  renderWords();
});

renderWords();
