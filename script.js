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
const keyInput = document.querySelector(".key-input");
class App {
  caesar = ["shift", "alphabet"];
  reverse = [];
  vigenere = ["key"];
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
    keyInput.addEventListener("input", this._editKey.bind(this));
  }
  _innit() {
    alphabetInput.value = "abcdefghijklmnopqrstuvwxyz";
    this._changeTo(this._type);
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
    if (!shiftInput.value) return;
    const shiftArr = shiftInput.value.split("").map(val => {
      if (Number.isFinite(+val)) {
        return +val;
      }
      return val;
    });
    shiftArr.forEach(valu => {
      if (!Number.isFinite(valu)) {
        alert("Only Numbers are allowed as a shift!");
        shiftInput.value = shiftArr
          .filter(val => Number.isFinite(val))
          .join("");
      }
    });
    this._calcAlpha();
  }
  _calcAlpha() {
    const alpha = alphabetInput.value;
    const firstLetter = alpha.slice(0, 1);
    const toLetter = alpha[shiftInput.value - 1];
    shiftDisplayFirstLetter.textContent = firstLetter;
    shiftDisplayToLetter.textContent = toLetter;
  }
  _changeAlpha(e) {
    const alpha = alphabetInput.value;
    const validInput = function (letter) {
      return (
        alpha
          .replace(letter, "")
          // restore the alpha before adding letter
          .split("")
          .every(alph => alph !== letter)
      ); // check if it exists in the previous alpha; if no then true; if yes then false
    };
    if (!e.data) return;
    if (!validInput(e.data)) {
      // if hv duplicated letters
      alert("No duplicated letters are allowed in the alphabet");
      // remove the duplicated letter
      alphabetInput.value = [...new Set(alpha.split(""))].join("");
      // alpha.split make into array of letters in alpha
      // new Set makes the arr have no duplicates
      // [...] destructures the set to become an array of the letters (no dupes now)
      // .join joins the array back to a string (with no dupes)
      return;
    }
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

    const shifted = this._genShiftedAlphaCaesar(alpha, shift);
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
  _genShiftedAlphaCaesar(alpha, shift) {
    const shifted =
      alpha.replace(`${alpha.slice(0, shift - 1)}`, "") +
      alpha.slice(0, shift - 1);
    return shifted;
  }
  _genShiftedAlphaVigenere(alpha, shift) {
    const shifted =
      alpha.replace(`${alpha.slice(0, shift)}`, "") + alpha.slice(0, shift);
    return shifted;
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
  _findKey(str) {
    const alpha = alphabetInput.value;
    const alphaUpper = alpha.toUpperCase();
    const alphaUpperArr = alphaUpper.split("");
    const alphaArr = alpha.split("");
    const key = str.split("").map(val => {
      if (alphaArr.includes(val)) {
        return alphaArr.findIndex(alph => alph === val);
      }
      if (alphaUpperArr.includes(val)) {
        return alphaUpperArr.findIndex(alph => alph === val);
      }
      return val;
    });
    return key;
  }
  _encryptVigenere(str, key) {
    if (!key) return;
    if (!keyInput.value) return alert("Please enter in a key.");
    const alpha = "abcdefghijklmnopqrstuvwxyz";

    const copiedKey = str.split("").map((_, i) => key[i % key.length]);
    /*repeat key (an array of numbers) each number one by one on every 
    character in str and ultimately get key the same length as str*/

    alphabetInput.value = "abcdefghijklmnopqrstuvwxyz";

    const rows = copiedKey.map(num => {
      return this._genShiftedAlphaVigenere(alpha, num);
    });

    const encryptedStr = rows
      .map((row, i) => {
        if (alpha.toUpperCase().includes(str[i]))
          return row.toUpperCase()[
            alpha
              .toUpperCase()
              .split("")
              .findIndex(letter => letter === str[i])
          ];
        if (!alpha.includes(str[i]) || Number.isFinite(+str[i])) return str[i];

        return row[alpha.split("").findIndex(letter => letter === str[i])];
      })
      .join("");
    return encryptedStr;
  }
  _decryptVigenere(str, key) {
    if (!key) return;
    const alpha = "abcdefghijklmnopqrstuvwxyz";

    const copiedKey = str.split("").map((_, i) => key[i % key.length]);
    /*repeat key (an array of numbers) each number one by one on every 
    character in str and ultimately get key the same length as str*/

    const rows = copiedKey.map(num => {
      return this._genShiftedAlphaVigenere(alpha, num);
    });
    const decryptedStr = rows
      .map((row, i) => {
        if (alpha.toUpperCase().includes(str[i]))
          return alpha.toUpperCase()[
            row
              .toUpperCase()
              .split("")
              .findIndex(letter => letter === str[i])
          ];
        if (!alpha.includes(str[i]) || Number.isFinite(+str[i])) return str[i];

        return alpha[row.split("").findIndex(letter => letter === str[i])];
      })
      .join("");
    return decryptedStr;
  }
  _editKey(e) {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const validInput = function (char) {
      return alpha.includes(char);
    };
    if (!e.data) return;
    if (!validInput(e.data)) {
      keyInput.value = keyInput.value
        .split("")
        .filter(char => validInput(char))
        .join("");
      alert("Key can only be lowercase English Characters");
    }
  }
  _submit() {
    let encryptedMsg;

    if (+shiftInput.value < 1 || +shiftInput.value > 26) {
      alert("Shift value must be including within 1 and 26");
      shiftInput.value = 4;
      shiftInput.focus();
      this._calcAlpha();
      return;
    }
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

    if (this._type === "vigenere") {
      if (this._mode === "encrypt") {
        encryptedMsg = this._encryptVigenere(
          originalInput.value,
          this._findKey(keyInput.value)
        );
      }
      if (this._mode === "decrypt") {
        encryptedMsg = this._decryptVigenere(
          originalInput.value,
          this._findKey(keyInput.value)
        );
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
