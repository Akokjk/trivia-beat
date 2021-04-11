function center(size, id) {
  if (window.innerHeight < window.innerWidth) {
    document.getElementById(id).style.width = window.innerHeight * size + "px";
    document.getElementById(id).style.height = window.innerHeight * size + "px";
    var translateY = window.innerHeight / 2 - (window.innerHeight * size) / 2;
    var translateX = window.innerWidth / 2 - (window.innerHeight * size) / 2;
    document.getElementById(id).style.transform = "translate(" + translateX + "px," + translateY + "px)";
  } else {
    document.getElementById(id).style.width = window.innerWidth * size + "px";
    document.getElementById(id).style.height = window.innerWidth * size + "px";
    var translateY = window.innerHeight / 2 - (window.innerWidth * size) / 2;
    var translateX = window.innerWidth / 2 - (window.innerWidth * size) / 2;
    document.getElementById(id).style.transform = "translate(" + translateX + "px," + translateY + "px)";
  }
  document.body.style.visibility = "visible";
}
