const fs = require('fs');
const path = require('path');
let FileList = [];
let createNum = 0;
function main(_path){
  getFile(_path);
  FileList.forEach((v,i)=>{
    const data = [];
    getImgPath(v,v,(url)=>{data.push({src:url})});
    createJson(v,data)
  })
  deleteall(path.join(_path,'html-common'))
}
function getFile(_path){
  const fileArr = fs.readdirSync(_path);
  fileArr.forEach((v,i)=>{
    const url = path.join(_path,v);
    const stats = fs.statSync(url);
    if (stats.isDirectory()) {
      if (path.basename(path.dirname(url)).match('article-')&&path.basename(url).match('html-')) {
        FileList.push(url);
      } else {
        getFile(url);
      }
    }
  })
}

function getImgPath(_path,masterPath,callBack){
  const imgArr = fs.readdirSync(_path);
  imgArr.forEach((v,i)=>{
    const url = path.join(_path,v);
    const stats = fs.statSync(url);
    if (stats.isDirectory()) {
      getImgPath(url,masterPath,callBack);
    }else if(path.extname(url).match('jpg|png|gif')){
      callBack(path.relative(masterPath,url));
    }
  })
}

function deleteall(_path) {  
  var files = [];  
  if(fs.existsSync(_path)) {  
      files = fs.readdirSync(_path);  
      files.forEach(function(file, index) {
        var curPath = path.join(_path,file);  
        if (!path.basename(curPath).match('v3')||curPath.match('__MACOSX')) {  
          if(fs.statSync(curPath).isDirectory()) {
              deleteall(curPath);  
          } else {
              fs.unlinkSync(curPath);  
          }
        }  
      });  
      if (!path.basename(_path).match('html-common')) { 
        fs.rmdirSync(_path);  }
      }  
};
function createJson(_path,_data){
  fs.writeFile(path.join(_path,'imageList.json'),'{"data":'+JSON.stringify(_data)+'}',(err)=>{
    createNum++;
    if (createNum==FileList.length) {
      console.log('创建完成');
    }
  })
}
main(process.argv[2] || '/Users/mac/Desktop/pcauto/微刊/776');