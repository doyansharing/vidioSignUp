/*** Script SIGN UP Vidio By Lanzz Store X Doyan Sharing.
 ** Thanks To :
 * Allah Swt.
 * Orang Tua
 * Teman-Teman
 * Dan Ilmu.
 *
 * Note :
 * Pembuatan script ini semata mata hanya untuk belajar. Gunakan dengan bijak
 * @xyzlanzz
 */

const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const axios = require('axios');
const readline = require('readline');
const { promisify } = require('util');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const questionAsync = promisify(rl.question).bind(rl);
//=========================================================//
    async function createName(){
        var nanya = await questionAsync("Berapa Banyak nama yang ingin di generate jika sudah membuat sebelumnya maka enter saja. : ");
        console.log(nanya)
        var isi = fs.readFileSync('nama.txt', 'utf-8').trim();
        if(nanya === "" && isi.length !== 0) return await vidioSignup();
        nanya = Number(nanya);
        for(let i = 0; i < nanya; i++){
          var url = await axios.get("https://api.namefake.com/indonesian-indonesia/random");
          url = url.data;
          console.log("DEBUG : " + url.name)
          
           // Baca file dan tambahkan nama baru ke dalamnya
           const currentNames = fs.readFileSync('nama.txt', 'utf8').trim();
           const updatedNames = currentNames.length > 0 ? `${currentNames}, ${url.name}` : url.name;
           fs.writeFileSync('nama.txt', updatedNames);
           await new Promise(resolve => setTimeout(resolve, 5000));
        }
       console.log("Pengisian Nama Selesai!....")
      vidioSignup()
       
      
      }
//=========================================================//
    function getRandomNameFromFile() {
        const names = fs.readFileSync('nama.txt', 'utf8').split(',');
        const randomIndex = Math.floor(Math.random() * names.length);
        return names[randomIndex].trim();
      }
      function getRandomNameFromFileVidio() {
        const names = fs.readFileSync('nama.txt', 'utf8').split(',');
        const randomIndex = Math.floor(Math.random() * names.length);
        const randomNameWithoutSpaces = names[randomIndex].replace(/\s/g, ''); // Menghapus semua spasi
        return randomNameWithoutSpaces;
      }
      function randomGender() {
        // Generate a random number between 0 and 1
        const randomNumber = Math.random();
      
        // If randomNumber is less than 0.5, return 'laki-laki', otherwise return 'perempuan'
        return randomNumber < 0.5 ? 'user_gender_male' : 'user_gender_female';
      }
      
      async function getValidCode() {
        let kode;
      
        while (true) {
          kode = await questionAsync('Masukkan Kode: ');
          if (kode.length === 6) {
            break; // Keluar dari loop jika kode sudah 6 digit
          } else {
            console.log("[!] Kode harus 6 digit. Silakan coba lagi.");
          }
        }
      
        return kode;
      }
//==================   main func   ==========================//
      async function vidioSignup(){
        puppeteer.use(stealthPlugin());
        let validCode = await getValidCode();
        const emailName1 = getRandomNameFromFileVidio();
        const emailName2 = getRandomNameFromFileVidio();
        const emailRandomNumber = Math.floor(Math.random() * 1000).toString().padStart(4, 'z');
        const email = `${emailName1}${emailRandomNumber}@gmail.com`; // Ganti Domain
        const password = "vidioLanzzStore" // ganti kalau mau
        //const extensionPath = path.join(__dirname, 'capsolver');
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--disable-gpu',
                '--disable-features=site-per-process',
                '--disable-features=NetworkService',
                '--disable-features=NetworkServiceInProcess',
                '--disable-infobars',
                '--disable-notifications',
                '--disable-popup-blocking',
                '--disable-hang-monitor',
                '--disable-breakpad',
                '--disable-cloud-import',
                '--disable-component-extensions-with-background-pages',
                '--disable-datasaver-prompt',
                '--disable-desktop-notifications',
                '--disable-ipc-flooding-protection',
                '--disable-renderer-backgrounding',
                '--enable-automation',
                '--force-dark-mode',
                '--hide-scrollbars',
                '--ignore-gpu-blocklist',
                '--lang=en',
                '--mute-audio',
                '--no-pings',
                '--no-zygote',
                '--use-gl=swiftshader',
                '--incognito', // Open the browser in incognito mode
            ],
        });
        const url = 'https://www.vidio.com/users/sign_up?user_return_to=https%3A%2F%2Fwww.vidio.com%2F';
      
      
        try {
        const page = await browser.newPage();
          await page.goto(url);
          await page.waitForTimeout(3000);
          console.log('[?] Opening Vidio.com Website');
          // BUAT EMAIL DAN PASS
          try {
            console.log('[+] Membuat Email....');
          await page.type('#onboarding-register-email', email);
          await page.type('#onboarding-register-password', password);
         
          console.log('[+] Still Trying to Sign Up...');
          await page.click('input[name="commit"]');
          } catch(e){
            return console.log("[-] Ada masalah pada laman penginputan password")
          }
          await page.waitForTimeout(4000);
          const failMail = await page.$('.onboarding-form__error');
          if(failMail !== null) {
             console.log("[!] Email Anda DiTolak! ")
             console.log("[?] Membuat ulang..")
             await browser.close();
            return vidioSignup()
          }
          console.log(failMail)
          await page.waitForSelector(".age-gender-modal__section");

          // PENGISIAN NAMA
          try {
            console.log('[+] Memasukan Nama....');
          await page.type('.age-gender-modal__form-input--display-name', getRandomNameFromFile());
          console.log('[+] Memasukan Tanggal Lahir....');
          await page.select('.age-gender-modal__form-input--age',"2000");
          const randomGen =  randomGender();
          console.log(`[+] Memilih Gender ${randomGen == "user_gender_male" ? "Laki-Laki" : "Perempuan" } ....`);
          await page.click(`label[for="${randomGen}"]`);
          await page.click('button.js-age-gender-modal__form-button');
          }catch(e){
            return console.log("Ada Masalah Pada Bagian Pengisian Nama, Silahkan ganti IP dan coba lagi")
          }
          await page.waitForTimeout(3000);
          console.log("Menuju Laman Penginputan Kode Tv");
          const maxAttempts = 3; // Jumlah maksimum percobaan
          let attempts = 0;

while (attempts < maxAttempts) {
  try {
    await page.goto("https://www.vidio.com/tv");

    for (let i = 0; i < validCode.length; i++) {
      await page.type(`input#input-code-${i + 1}`, validCode[i]);
    }

    await page.waitForTimeout(1500);
    const errorMessage = await page.$('input.error');

    if (errorMessage !== null) {
      console.log(`[!] KODE TV ANDA SALAH (${attempts + 1}/${maxAttempts}), SILAKAN ULANGI LAGI...`);
      validCode = await getValidCode();
      attempts++;

      // Mengulangi loop untuk meminta kode baru
    } else {
      console.log("[+] Berhasil Premier!");
      break; // Keluar dari loop jika kode benar
    }

  } catch (e) {
    console.log("[!] Terjadi kesalahan:", e);
    break; // Keluar dari loop jika terjadi kesalahan
  }
}

if (attempts === maxAttempts) {
  console.log("[!] Jumlah maksimum percobaan tercapai. Silakan coba lagi nanti.");
  var ulang = await questionAsync("Mau ulang? jika iya ketik 'iya' :");
  if(ulang.toLowerCase() === "iya"){
    await vidioSignup()
  } else {
      await browser.close();
      rl.close();
      return
  }
  
} else {
    console.log("Berhasil..");
          console.log(`Akun Berhasil DI Buat : ${email} | ${password}`);
          const accountInfo = `${email} | ${password} ||\n`;
          fs.appendFileSync('akun.txt', accountInfo);
          await page.waitForTimeout(4000);
}
          
        } catch(err){
          console.log(err);
        } finally{
          await browser.close();
          var nanya =  await questionAsync("apakah anda ingin memgulang? ketik Y/n : ");
          if (nanya === "Y"){
            await vidioSignup();
          } else {
            process.exit();
          }
        }
      }
//==========================================================//
// Run
      createName()
   
