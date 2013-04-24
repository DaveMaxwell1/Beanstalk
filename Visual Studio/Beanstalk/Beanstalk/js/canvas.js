function drawFrame(ctx, image, width, height, num) {
  var offsetX = 0,
      offsetY = num * height;
  
  ctx.drawImage(image, offsetX, offsetY);//, width, height, 0, 0, width, height);
}

function rightNow() {
  if (window['performance'] && window['performance']['now']) {
    return window['performance']['now']();
  } else {
    return +(new Date());
  }
}

