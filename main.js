// 页面自适应初始化
~(function Adpate(){
  const def = 640; // 设计稿宽度
  let AllPages = document.querySelector(".main");
  let ClientWidth = document.documentElement.clientWidth; // 浏览器宽度
  if(ClientWidth>def){ //浏览器宽度大于def时页面居中显示 宽度为def
    AllPages.style.width = def + "px";
    AllPages.style.margin = "0 auto";
    return;
  }
  document.documentElement.style.fontSize = ClientWidth/def*20 + "px";
})();
// 触摸与方向锁定
let oBanner = document.querySelector(".banner"); //banner
let ul_list = document.querySelector(".ul_list"); // ul
let oContent = document.querySelector(".content"); // content
let oPullDown = document.querySelector(".pull_down"); // pull_down
let ol_list = document.querySelector(".ol_list"); // ol_list
let banner_left = 0;
let content_top = 0;
function loadData(fn){
  $.ajax({
    url: "data.txt",
    success(str){
      let arr = str.split("\n");
      $("ol").html('');
      arr.forEach(s=>{
        $(`<li>${s}</li>`).appendTo('ol');
      });
      fn&&fn();
    },
    error(){
      alert("load error!");
    }
  })
}
loadData();
oBanner.addEventListener("touchstart",function(ev){
  ev.preventDefault();
  ul_list.style.transition = "";
  oContent.style.transition = "";
  let startX = ev.targetTouches[0].clientX;
  let startY = ev.targetTouches[0].clientY;
  let dir = "";
  let disX = startX - banner_left;
  let disY = startY - content_top;
  function FnMove(ev){
    let x = ev.targetTouches[0].clientX;
    let y = ev.targetTouches[0].clientY;
    if(!dir){
      if(Math.abs(x-startX)>=5){
        dir = "x";
      }else if(Math.abs(y-startY)>=5){
        dir = "y";
      }
    }else{ // 确定方向了
      //console.log(dir);
      if(dir=="x"){
        banner_left = x-disX;
        ul_list.style.transform = `translateX(${banner_left}px)`;
      }else{
        content_top = y-disY;
        if(content_top>0){
         oContent.style.transform = `translateY(${content_top/3}px)`;
          if(content_top>=100){
            oPullDown.innerHTML = "松开加载";
          }else{
            oPullDown.innerHTML = "下拉刷新";
          }
       }else{
        oContent.style.transform = `translateY(${content_top}px)`;
       }
      }
    }
      ev.preventDefault();
  }
  function FnEnd(ev){
    oBanner.removeEventListener("touchmove",FnMove,false);
    oBanner.removeEventListener("touchend",FnEnd,false);
    if(dir=="x"){
      let n = Math.round(-banner_left/oBanner.offsetWidth);
      if(n<0){
        n=0;
      }else if(n>=ul_list.children.length){
        n = ul_list.children.length-1;
      }
      banner_left = -n*oBanner.offsetWidth;
      ul_list.style.transition = "0.7s all ease";
      ul_list.style.transform = `translateX(${banner_left}px)`;
    }else if(dir=="y"){
      if(content_top>=100){ // 加载新数据
        content_top = 30;
        oPullDown.innerHTML = "正在加载";
        loadData(function(){
        oPullDown.innerHTML = "下拉刷新";
        content_top = 0;
        oContent.style.transition = "0.7s all ease";
        oContent.style.transform = `translateY(${content_top}px)`;
      });
      }else{
        content_top = 0;
      }
      oContent.style.transition = "0.7s all ease";
      oContent.style.transform = `translateY(${content_top}px)`;
    }
      ev.preventDefault();
  }
  oBanner.addEventListener("touchmove",FnMove,false);
  oBanner.addEventListener("touchend",FnEnd,false);
},false);
