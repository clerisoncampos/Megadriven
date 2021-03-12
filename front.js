 // variaveis globais----------------------------
 let caminhoRom = '0'
 let nomePastaRom = '0'//sem uso
 let caminhoEmu = '0'
 let caminhoPastaImagens ='0'

 //teste inicial----------------------------------
  let nomeRender = '000'
  ipcRenderer.invoke('peganome',a=0).then((result) => {
    nomeRender = result
    //document.getElementById('divCaminho').innerText += result
  })


  
  // requisita path do emulador previamente salvo----
  ipcRenderer.invoke('pegaPathEmu',a=0).then((result)=>{
   // retorno na função abaixo
  })
  ipcRenderer.on('caminhoEmuSalvo', (event, result) => {
   caminhoEmu = result
  })


  // requisita diretorio de imagens previamente salvo----
  ipcRenderer.invoke('pegaPathImg',a=0).then((result)=>{
   // retorno na função abaixo
  })
  ipcRenderer.on('caminhoImgSalva', (event, result) => {
   caminhoPastaImagens=result
  //atualizaImagem(document.getElementById('opcoes').selectedIndex)
  //document.getElementById('opcoes')[0].selected=true
  })


  // requisita diretorio das roms previamente salvo----
  ipcRenderer.invoke('pegaDirRomSalvo',a=0).then((result)=>{
    //recebe retorno na função abaixo
  })
  ipcRenderer.on('listaromSalva', (event, result) => {
   caminhoRom = result[0]
   desenhaLista(result[1])
   if(caminhoPastaImagens!=='0'){
     document.getElementById('opcoes')[0].selected=true
     atualizaImagem(document.getElementById('opcoes').selectedIndex)
   }
  })



// requisita abertura de caixa de diálogo----------
const botaoAbreArquivo = () => ipcRenderer.send('abreArquivo', it = 0) 

// requisita diretorio de imagens
const botaoAbreImgs = () => ipcRenderer.send('abreImagem', it = 0) 

// requisita diretorio do emulador
const botaoAbreEmu = () => ipcRenderer.send('dirEmu', it = 0) 

// retorna string com apenas a exetensao do arquivo (string)
const verificaExt =(palavra)=>{
  let um = palavra[palavra.length-1]
  let dois = palavra[palavra.length-2]
  let tres = palavra[palavra.length-3]
  let ext = `${tres}${dois}${um}`
  return ext
}

// retorna string sem extensão do nome do arquivo-------------
const retiraExt =(strArq)=>{
 let novap = strArq
 .slice(0,strArq.length-1)
 .slice(0,strArq.length-2)
 .slice(0,strArq.length-3)
 .slice(0,strArq.length-4)
 return novap
}

// retorna array de arquivos com extensao bin e smd
const filtraExtensao =(arr)=>{
 let binsmd = []
  arr.forEach(element => {
      let ext = verificaExt(element)
      if (ext==='bin'|| ext==='smd'){ 
         binsmd.push(element)
       }
  })
 return binsmd
}


// desenha lista na tela---------------------------
const desenhaLista =(conteudo)=>{
 document.getElementById('opcoes').innerHTML = ''
 let conteudoFiltrado = filtraExtensao(conteudo)
 conteudoFiltrado.forEach((element)=>{
    //let e = retiraExt(element)
    let e = element
    document.getElementById('opcoes').innerHTML +=`<option value="${e}" ondblclick="carregaJogo('${e}')" > ${e}  </option>`
 })
}


// retorno com o path das roms ----------------------
ipcRenderer.on('pacote_nomedir', (event, arg='default', arg2='default') => {
  //document.getElementById('divCaminho').innerText = arg
  caminhoRom = arg
  let arquivosJogos = filtraExtensao(arg2)
  desenhaLista(arquivosJogos)
})  


// retorno com path das imagens------------------
ipcRenderer.on('dir_imagens', (event, arg='default') => {
  caminhoPastaImagens = arg
  //document.getElementById('opcoes')[0].selected=true
  atualizaImagem(document.getElementById('opcoes').selectedIndex)
})  


 // retorno com path do emulador------------------
ipcRenderer.on('resultDirEmu', (event, arg='default') => {
  caminhoEmu = arg
 })


// executa o emulador e a rom---------------------
const carregaJogo =(item)=>{
  if(caminhoEmu !== '0'){
    ipcRenderer.send('carregaEmu',item,caminhoRom,caminhoEmu)
  }else{
    alert('selecione um emulador!')
  }
} 


// atualizando imagem da caixa a direita-----------
const atualizaImagem =(item)=>{
  let imagem = retiraExt(document.getElementById('opcoes')[item].value) 
  document.getElementById('imgJogo').src= caminhoPastaImagens+'\\'+imagem+'.png'
}


// pega seleçao da lista pela tecla enter----------
const keySelect =(tecla,indice)=>{
  if ((tecla.keyCode === 13) && (indice>=0)){
    let item = document.getElementById('opcoes')[indice].value
   // ipcRenderer.send('carregaEmu',item,caminhoRom,caminhoEmu) 
   carregaJogo(item)
   }
}