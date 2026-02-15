document.addEventListener("DOMContentLoaded", () => {
  const blobEl = document.getElementById("protected");
  if (!blobEl) return;

  const blob = blobEl.dataset.blob;
  const contentDiv = document.getElementById("content");
  const unlockDiv = document.getElementById("unlock");
  const pwInput = document.getElementById("pw");
  const unlockBtn = document.getElementById("unlockBtn");

  function tryDecrypt(pw) {
    try {
      const bytes = CryptoJS.AES.decrypt(blob, pw);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);
      return plaintext || null;
    } catch {
      return null;
    }
  }

  const storedEncodedPw = localStorage.getItem("sitePassword");
  if (storedEncodedPw) {
    const storedPw = atob(storedEncodedPw);
    const decrypted = tryDecrypt(storedPw);

    if (decrypted) {
      unlockDiv.style.display = "none";
      contentDiv.innerHTML = decrypted;
      if (typeof applyTimelineSort === "function") applyTimelineSort();
      if (typeof applyTimelineGrouping === "function") applyTimelineGrouping();
      return;
    } else {
      localStorage.removeItem("sitePassword");
    }
  }

  unlockBtn.addEventListener("click", () => {
    const pw = pwInput.value.trim();
    if (!pw) {
      contentDiv.innerText = "Please enter the password.";
      return;
    }

    const decrypted = tryDecrypt(pw);
    if (!decrypted) {
      contentDiv.innerText = "Wrong password.";
      return;
    }

    localStorage.setItem("sitePassword", btoa(pw));

    unlockDiv.style.display = "none";
    contentDiv.innerHTML = decrypted;

    if (typeof applyTimelineSort === "function") applyTimelineSort();
    if (typeof applyTimelineGrouping === "function") applyTimelineGrouping();
  });
});
