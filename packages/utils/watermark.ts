'use strict';

// const watermark:any = {}

const setWatermark = (str, str1?) => {
  const id = '1.23452384164.123412415';
  const node = document.getElementById(id);
  if (node !== null) {
    document.body.removeChild(node);
  }

  const can = document.createElement('canvas');
  can.width = 450;
  can.height = 220;
  if (str1) {
    can.height = 300;
  }

  const cans: any = can.getContext('2d');
  if (str1) {
    cans.rotate((-10 * Math.PI) / 180);
  } else {
    cans.rotate((-20 * Math.PI) / 180);
  }

  cans.font = '16px Vedana';
  cans.fillStyle = 'rgba(200, 200, 200, 0.2)';
  if (str1) {
    cans.font = '26px Vedana';
    cans.fillStyle = 'rgba(200, 200, 200, 0.5)';
  }
  cans.textAlign = 'left';
  cans.textBaseline = 'Top';
  cans.fillText(str, can.width / 3, can.height / 2);

  const div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '100px';
  div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = document.documentElement.clientWidth - 100 + 'px';
  div.style.height = document.documentElement.clientHeight - 100 + 'px';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
};

// 该方法只允许调用一次
// watermark.set = (str) => {
//   let id = setWatermark(str)
//   setInterval(() => {
//     if (document.getElementById(id) === null) {
//       id = setWatermark(str)
//     }
//   }, 500)
//   window.onresize = () => {
//     setWatermark(str)
//   }
// }

/**
 * 添加水印方法
 * @param str 水印文字
 * @param str1 有值则为放大水印，填1即可
 */
export const setWaterMark = (str, str1?) => {
  let id = setWatermark(str, str1);
  // if (document.getElementById(id) === null) {
  //   id = setWatermark(str)
  // }
  // setInterval(() => {
  if (document.getElementById(id) === null) {
    id = setWatermark(str, str1);
  }
  // }, 500)
  window.onresize = () => {
    setWatermark(str, str1);
  };
};

// 添加水印方法
export const setWaterMarkAlone = (str, str1) => {
  let id = setWatermark(str, str1);
  // if (document.getElementById(id) === null) {
  //   id = setWatermark(str)
  // }
  // setInterval(() => {
  if (document.getElementById(id) === null) {
    id = setWatermark(str, str1);
  }
  // }, 500)
  window.onresize = () => {
    setWatermark(str, str1);
  };
};

/**
 * 移除水印方法
 */
export const removeWatermark = () => {
  const id = '1.23452384164.123412415';
  if (document.getElementById(id) !== null) {
    const t: any = document.body;
    t.removeChild(document.getElementById(id));
  }
};
// export default watermark
