const { app, BrowserWindow } = require('electron')
const {ipcMain} = require('electron')  
const fs = require('fs')
const { dialog} = require('electron')
const exec = require('child_process').execFile;

const nomeMain = ' Selecione o diretorio das roms acima!'


//função construtora da janela ---------
function createWindow () {
  const win = new BrowserWindow({
    width: 440,
    height: 622,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
  win.setIcon(path.join(__dirname, '/img/icon.png'));
}

//quando fechar todas as janelas, fecha a aplicação
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(()=>{
  createWindow()
})

// apanas um primeiro teste-------------------------------
ipcMain.handle('peganome', async (event, argx=0) => {
  return nomeMain
})


// captura arquivo save de diretorio das roms  -------------
ipcMain.handle('pegaDirRomSalvo', async (event, argx=0) => {
  fs.readFile('dataCR.txt', 'utf8', function (err,data) {

    if (err) {return '0'}
    //manda lista de toms tambem---
    fs.readdir(data, (err, files) => {
          if (err) {throw err;}
           info = [data,files]  
           event.sender.send('listaromSalva', info)
    })

  })
})

// captura path salva do executavel emulador  -------------
ipcMain.handle('pegaPathEmu', async (event, argx=0) => {
  fs.readFile('dataCE.txt', 'utf8', function (err,data) {
    if (err) {return '0'}
    event.sender.send('caminhoEmuSalvo', data)
  })
})

//captura diretorio salvo das imagens-----------------------
ipcMain.handle('pegaPathImg', async (event, argx=0) => {
  fs.readFile('dataCI.txt', 'utf8', function (err,data) {
    if (err) {return '0'}
    event.sender.send('caminhoImgSalva', data)
  })

})


// caixa de diálogo para selecionar diretório das roms--------------
ipcMain.on('abreArquivo', async (event, argx=0) => {
   dialog.showOpenDialog({ properties: ['openDirectory'] })
   .then(result => {
      let stringResultDiretorio =  result.filePaths.join('')

      fs.readdir(stringResultDiretorio, (err, files) => {
         if (err) {throw err;}
         let stringFiles = files.join('')//APAGAR
         salvaCaminhoRom(stringResultDiretorio)
         event.reply('pacote_nomedir', stringResultDiretorio,files)
      })

   }).catch(err => {
     console.log(err)
   })
})


// caixa de diálogo para selecionar diretório das imagens--------------
ipcMain.on('abreImagem', async (event, argx=0) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] })
  .then(result => {
     let stringResultDiretorio =  result.filePaths.join('')
     salvaCaminhoImg(stringResultDiretorio)
     event.reply('dir_imagens', stringResultDiretorio)
  }).catch(err => {
    console.log(err)
  })
})


// captura caminho do emulador -------------------------------
ipcMain.on('dirEmu', async (event, argx=0) => {
  dialog.showOpenDialog({filters: [{  name: 'blastem', extensions: ['exe']}]},{ properties: ['openFile'] })
  .then(result => {
     let resultado =  result.filePaths.join('')
     salvaCaminhoEmu(resultado)
     event.reply('resultDirEmu', resultado)
  }).catch(err => {
    console.log(err)
  })
})


// executa emulador -------------------------------
ipcMain.on('carregaEmu', async (event,jogo,caminhoRom,caminhoEmu) => {
  let execucao = caminhoEmu+' -f '+caminhoRom+'\\'+jogo//APAGAR
  let jogovai = caminhoRom+'\\'+jogo
  exec(caminhoEmu,['-f',jogovai],function(err, data) {  
     console.log(err)
     console.log(data.toString());                       
  });  
})


//salva arquivo contendo o caminho do emulador-----------
const salvaCaminhoEmu =(conteudo)=>{
  fs.writeFile('dataCE.txt', conteudo, function (err) {
    if (err) return console.log(err);
   //arquivo salvo
  });
}


//salva arquivo contendo o caminho da pasta de roms-----------
const salvaCaminhoRom =(conteudo)=>{
  fs.writeFile('dataCR.txt', conteudo, function (err) {
    if (err) return console.log(err);
   //arquivo salvo
  });
}


//salva arquivo contendo o caminho da pasta de imagens-----------
const salvaCaminhoImg =(conteudo)=>{
  fs.writeFile('dataCI.txt', conteudo, function (err) {
    if (err) return console.log(err);
   //arquivo salvo
  });
}

