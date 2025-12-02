document.addEventListener("DOMContentLoaded", () => {
  const blob = document.getElementById("protected").dataset.blob;
  const contentDiv = document.getElementById("content");
  const pwInput = document.getElementById("pw");
  const unlockBtn = document.getElementById("unlockBtn");

  // If cached plaintext exists, show it immediately
  const cached = sessionStorage.getItem("timelinePlaintext");
  if (cached) {
    contentDiv.innerHTML = cached;
    document.getElementById("unlock").style.display = "none";
    return;
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
        // Cache plaintext for this session
        sessionStorage.setItem("timelinePlaintext", plaintext);

        // Hide unlock form and show content
        document.getElementById("unlock").style.display = "none";
        contentDiv.innerHTML = plaintext;
      } else {
        contentDiv.innerText = "Wrong password";
      }
    } catch (e) {
      contentDiv.innerText = "Error decrypting";
    }
  });
});
