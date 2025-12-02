document.addEventListener("DOMContentLoaded", () => {
  const blob = document.getElementById("protected").dataset.blob;
  const contentDiv = document.getElementById("content");
  const pwInput = document.getElementById("pw");
  const unlockBtn = document.getElementById("unlockBtn");

  // Check if we already cached plaintext for this exact blob
  const cachedBlob = localStorage.getItem("timelineBlob");
  const cachedPlaintext = localStorage.getItem("timelinePlaintext");

  if (cachedBlob === blob && cachedPlaintext) {
    contentDiv.innerHTML = cachedPlaintext;
    document.getElementById("unlock").style.display = "none";
    applyTimelineSort();
    return;
  } else {
    // Blob changed → clear old cache
    localStorage.removeItem("timelinePlaintext");
    localStorage.setItem("timelineBlob", blob);
  }

  // Attach unlock handler
  unlockBtn.addEventListener("click", () => {
    const pw = pwInput.value;
    if (!pw) {
      contentDiv.innerText = "Please enter the password.";
      return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(blob, pw);
      const plaintext = bytes.toString(CryptoJS.enc.Utf8);

      if (plaintext) {
        // Cache plaintext tied to this blob
        localStorage.setItem("timelinePlaintext", plaintext);
        localStorage.setItem("timelineBlob", blob);

        document.getElementById("unlock").style.display = "none";
        contentDiv.innerHTML = plaintext;
        applyTimelineSort();
      } else {
        contentDiv.innerText = "Wrong password";
      }
    } catch (e) {
      contentDiv.innerText = "Error decrypting";
    }
  });
});
