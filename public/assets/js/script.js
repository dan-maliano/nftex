// Wallet Number (Name) Cut
let walletId = document.querySelectorAll('.cut-wallet');
let strId = walletId.length;
console.log(walletId['0'])
for (let i = 0; i < strId; i++) {
  let inIdText = walletId[i].innerText;
  
  if (inIdText.length > 12) {
    inIdText = inIdText.slice(0, 6) + '...' + inIdText.slice(-3);
  }
  walletId[i].innerText = inIdText;
}

