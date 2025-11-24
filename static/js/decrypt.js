function decrypt() {
  var pw = document.getElementById("pw").value;
  var blob = document.getElementById("protected").dataset.blob;
  try {
    var bytes = CryptoJS.AES.decrypt(blob, pw);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    if (plaintext) {
      // show the entire decrypted content
      document.getElementById("content").innerHTML = plaintext;
    } else {
      document.getElementById("content").innerText = "Wrong password";
    }
  } catch (e) {
    document.getElementById("content").innerText = "Error decrypting";
  }
}
