const selectContainer = document.querySelector(".custom-select");
const selectArrow = document.querySelector(".select-arrow");
const selectMenu = document.querySelector(".custom-options");
const selected = document.querySelector(".selected");
const shiftInput = document.querySelector(".shift-input");
const alphabetInput = document.querySelector(".alphabet-input");
const shiftDisplayFirstLetter = document.querySelector(".first-letter");
const shiftDisplayToLetter = document.querySelector(".to-letter");
const submitBtn = document.querySelector(".submit-button");
const form = document.querySelector("form");
const originalInput = document.querySelector(".original-input");
const codedOutput = document.querySelector(".coded-output");
const encryptText = document.querySelector(".encrypt-text");
const decryptText = document.querySelector(".decrypt-text");
const changeCont = document.querySelector(".function-card--top");
const codedTitle = document.querySelector(".coded-title");
const originalCopyBtn = document.querySelector(".original-copy");
const codedCopyBtn = document.querySelector(".coded-copy");
class App {
  caesar = ["shift", "alphabet"];
  reverse = [];
  _type = "caesar";
  _mode = "encrypt";
  constructor() {
    this._innit();

    selectContainer.addEventListener("click", this.changeClick.bind(this));
    shiftInput.addEventListener("input", this._editShiftValue.bind(this));
    alphabetInput.addEventListener("input", this._changeAlpha.bind(this));
    form.addEventListener("submit", this._submit.bind(this));
    changeCont.addEventListener("click", this._changeMode.bind(this));
    originalCopyBtn.addEventListener("click", this._copyOg.bind(this));
    codedCopyBtn.addEventListener("click", this._copyCoded.bind(this));
  }
  _innit() {
    alphabetInput.value = "abcdefghijklmnopqrstuvwxyz";
  }
  changeClick(e) {
    if (e.target.closest(".custom-select--text")) {
      selectMenu.classList.toggle("hidden");
    }
    if (e.target.closest(".custom-options")) {
      selected.textContent = e.target.textContent;
      this._type = e.target.dataset.code;
      this._changeTo(this._type);
      selectMenu.classList.add("hidden");
    }
  }
  _changeTo(changeToType) {
    document.querySelectorAll(".selectives").forEach(selective => {
      selective.classList.add("hidden");
    });

    this[changeToType].forEach(type => {
      const module = document.querySelector(`.${type}-module`);
      module.classList.remove("hidden");
    });
    originalInput.value = codedOutput.textContent = "";
  }
  _editShiftValue(e) {
    if (!e.data) return;
    const alpha = alphabetInput.value;
    const firstLetter = alpha.slice(0, 1);
    const toLetter = alpha[e.data - 1];
    shiftDisplayFirstLetter.textContent = firstLetter;
    shiftDisplayToLetter.textContent = toLetter;
    console.log("Hi");
  }
  _changeAlpha() {
    const alpha = alphabetInput.value;
    console.log(alpha);
    if (!document.querySelector(".shift-module").classList.contains("hidden")) {
      const firstLetter = alpha.slice(0, 1);
      const toLetter = alpha[shiftInput.value - 1];
      shiftDisplayFirstLetter.textContent = firstLetter;
      shiftDisplayToLetter.textContent = toLetter;
    }
  }

  _encryptcaesar(str, shift) {
    const alpha = alphabetInput.value;
    const alphaUpper = alpha.toUpperCase();

    const shifted =
      alpha.replace(`${alpha.slice(0, shift - 1)}`, "") +
      alpha.slice(0, shift - 1);
    const shiftedUpper = shifted.toUpperCase();

    const encryptedStr = str
      .split("")
      .map(letter => {
        if (letter === " ") return " ";
        if (alphaUpper.includes(letter)) {
          return (letter = shiftedUpper[alphaUpper.indexOf(letter)]);
        }
        if (alpha.includes(letter)) {
          return (letter = shifted[alpha.indexOf(letter)]);
        }
        return letter;
      })
      .join("");
    return encryptedStr;
  }
  _decryptcaesar(str, shift) {
    const alpha = alphabetInput.value;
    const alphaUpper = alpha.toUpperCase();

    const shifted =
      alpha.replace(`${alpha.slice(0, shift - 1)}`, "") +
      alpha.slice(0, shift - 1);
    const shiftedUpper = shifted.toUpperCase();
    const decryptedStr = str
      .split("")
      .map(letter => {
        if (letter === " ") return " ";
        if (shifted.includes(letter)) {
          return (letter = alpha[shifted.indexOf(letter)]);
        }
        if (shiftedUpper.includes(letter)) {
          return (letter = alphaUpper[shiftedUpper.indexOf(letter)]);
        }
        return letter;
      })
      .join("");
    return decryptedStr;
  }

  _encryptreverse(str) {
    return str.split("").reverse().join("");
  }
  _decryptreverse(str) {
    return str.split("").reverse().join("");
  }
  _submit() {
    let encryptedMsg;
    if (!originalInput.value) return;
    if (this._type === "caesar") {
      if (this._mode === "encrypt") {
        encryptedMsg = this._encryptcaesar(
          originalInput.value,
          shiftInput.value
        );
      }
      if (this._mode === "decrypt") {
        encryptedMsg = this._decryptcaesar(
          originalInput.value,
          shiftInput.value
        );
      }
    }

    if (this._type === "reverse") {
      if (this._mode === "encrypt") {
        encryptedMsg = this._encryptreverse(originalInput.value);
      }
      if (this._mode === "decrypt") {
        encryptedMsg = this._decryptreverse(originalInput.value);
      }
    }

    codedOutput.textContent = encryptedMsg;
  }
  _changeMode(e) {
    if (
      !e.target.classList.contains("encrypt-text") &&
      !e.target.classList.contains("decrypt-text")
    )
      return;
    if (e.target.classList.contains("encrypt-text")) {
      document
        .querySelector(":root")
        .style.setProperty("--mode-color", "#00b29d");
      decryptText.classList.remove("text-active");
      encryptText.classList.add("text-active");
      codedTitle.textContent = "Encrypted";
      submitBtn.value = "Encrypt";
      this._mode = "encrypt";
    }
    if (e.target.classList.contains("decrypt-text")) {
      document
        .querySelector(":root")
        .style.setProperty("--mode-color", "#FFA31A");
      encryptText.classList.remove("text-active");
      decryptText.classList.add("text-active");
      codedTitle.textContent = "Decrypted";
      submitBtn.value = "Decrypt";
      this._mode = "decrypt";
    }
    originalInput.value = "";
    codedOutput.textContent = "";
  }

  _copyOg(e) {
    if (!originalInput.value) return;
    navigator.clipboard.writeText(originalInput.value).then(
      function () {
        originalCopyBtn.style.background = "#4BB543";
        setTimeout(() => {
          originalCopyBtn.style.background = "rgb(212, 212, 212)";
        }, 300);
      },
      function () {
        originalCopyBtn.style.background = "#FC100D";
        setTimeout(() => {
          originalCopyBtn.style.background = "rgb(212, 212, 212)";
        }, 300);
      }
    );
  }
  _copyCoded(e) {
    if (!codedOutput.textContent) return;
    navigator.clipboard.writeText(codedOutput.textContent).then(
      function () {
        codedCopyBtn.style.background = "#4BB543";
        setTimeout(() => {
          codedCopyBtn.style.background = "rgb(212, 212, 212)";
        }, 300);
      },
      function () {
        codedCopyBtn.style.background = "#FC100D";
        setTimeout(() => {
          codedCopyBtn.style.background = "rgb(212, 212, 212)";
        }, 300);
      }
    );
  }
}
const app = new App();
