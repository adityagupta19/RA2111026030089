const crypto = require('crypto');

//random 256-bit key for AES
const key = crypto.randomBytes(32);

//initialization vector (IV)
const iv = crypto.randomBytes(16);



function generateProductID(text, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let productID = cipher.update(text, 'utf8', 'hex');
  productID += cipher.final('hex');
  return productID;
}


function decryptProductID(productID, key, iv) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(productID, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports ={generateProductID,decryptProductID}