'use strict';
const grafinfo = {};
let treeinfo = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

 ctx.font = '17px Times new Roman';
 ctx.textBaseline = 'middle';
 ctx.textAlign = 'center';

 const A = [
    [0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1],  
    [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1], 
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0], 
    [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0], 
    [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1], 
    [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1], 
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1]
  ];

  ctx.font = '22px Times new Roman';
  ctx.fillText('Adjacency matrix', 300, 580);
  for (let i = 0; i < A.length; i++) {
    ctx.fillText(`${A[i]}`, 300, 580 + (i + 1) * 25);
}

const W  = [
  [0,  89, 5,  53, 0,  0,  92, 0,  90, 55, 69],  
  [89, 0,  0,  0,  41, 0,  0,  0,  15, 63, 41], 
  [5,  0,  0,  0,  39, 0,  0,  5,  80, 0,  68], 
  [53, 0,  0,  0,  25, 8,  50, 48, 6,  79, 98], 
  [0,  41, 39, 25, 0,  0,  60, 15, 66, 0,  0], 
  [0,  0,  0,  8,  0,  0,  3,  56, 61, 69, 0],  
  [92, 0,  0,  50, 60, 3,  0,  13, 14, 0,  31],  
  [0,  0,  5,  48, 15, 56, 13, 0,  86, 81, 67], 
  [90, 15, 80, 6,  66, 61, 14, 86, 0,  44, 44], 
  [55, 63, 0,  79, 0,  69, 0,  81, 44, 0,  62], 
  [69, 41, 68, 98, 0,  0,  31, 67, 44, 62, 0]
];

const r = 15;
const rloops = 3 * r / 4;
const arrr = 5;

const buildVertex = (n, P, x0, y0, obj) => {
  let step = P / n;
  const side = P / 4;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  for (vert; vert <=  Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY += step;
  }

  for (vert; vert <=  2 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step;
  }

  for (vert; vert <=  3 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY -= step;
  }
  for (vert; vert <=  n; vert++) {
    step = side / (n - 3 * Math.ceil(n / 4));
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX -= step;
  }
};
buildVertex(11, 1600, 75, 50, grafinfo);
buildVertex(11, 1600, 675, 50, treeinfo);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simplecon = [];
    obj[key].doublecon = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) { 
        const names = [`vert${i+1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simplecon.push(`vert${j + 1}`);
        }
        else {
          obj[names[0]].doublecon.push(`vert${j + 1}`);
        }
      }
    }
  }
}
const center = (x0, y0, p) =>{ 
  let x = x0 + p/8;
  let y = y0 + p/8;
  return {
    x : x,
    y : y
  }
}

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (let i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc)**2 + (obj[arr[i]].coords[1] - yc)**2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}


  function simpleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r + 35) * Math.cos(Math.PI / 2 - alpha),
      dy : (r + 28) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  function doubleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : -(r + 34) * Math.cos(Math.PI / 2 - alpha),
      dy : -(r + 19) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  const drawDoubleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].doublecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
        const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
  
        if (obj[key].num <= obj[`${obj[key].doublecon[i]}`].num) {
        if (Math.abs(obj[key].num - obj[`${obj[key].doublecon[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].doublecon[i]}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
        } 
        else {
        const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        }
      }
      }
    }
  }

  const drawNewCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].doublecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
        const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.strokeStyle = "black";
          ctx.lineTo(toX, toY);
          ctx.stroke();
          const coordinates = readyCons(fromX, fromY, toX, toY, r);
        }
      }
    }

  const drawVertex = obj => {
    for (let key in obj) {
      ctx.beginPath();
      ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
      ctx.fillStyle = "grey";
      ctx.fill();
      ctx.strokeStyle = "yellow";
      ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
      ctx.stroke();
    }
  }

  const drawWeigths = (matrix, obj) => {
  for(let i = 0; i < A.length; i++) {
    for(let j = i; j < A.length; j++) {
      if(matrix[i][j]) {
        const w = matrix[i][j];
        const fromX = obj[`vert${i+1}`].coords[0];
        const fromY = obj[`vert${i+1}`].coords[1];
        const toX = obj[`vert${j+1}`].coords[0];
        const toY = obj[`vert${j+1}`].coords[1];
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;

        if (Math.abs(obj[`vert${i+1}`].num - obj[`vert${j+1}`].num) === 1 || Math.abs(obj[`vert${i+1}`].num - obj[`vert${j+1}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.fillStyle = "white";
          ctx.arc((fromX + toX) / 2, (fromY + toY) / 2, 8,0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(w, (fromX + toX) / 2, (fromY + toY) / 2);
        } else {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.fillStyle = "white";
          ctx.arc(newX, newY, 8,0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(w, newX, newY);
        }
      }
    }
  }
}
makeCons(A, grafinfo);
drawLoops(loops, grafinfo,75, 100);
drawDoubleCons(grafinfo);
drawVertex(grafinfo);
drawWeigths(W, grafinfo);

const nullMatrix = n => {
  const res = [];
  for (let i = 0; i < n; i++){
    res[i] = [];
    for (let j = 0; j < n; j++) res[i][j] = 0;
  }
  return res;
}

const fullCopy = x => JSON.parse(JSON.stringify(x));

const visited1 = [1];
const treeM = nullMatrix(A.length);
const res = [];
const prim = (weightM) => {
  const weights = []; 
  visited1.forEach(curr => { 
    const arr = [];
    weightM[curr - 1].forEach((w, index) => { 
      arr.push([index + 1, w]);
    })
    weights.push({
      vert: curr,
      weights: arr.filter(a => a[1] !== 0).sort((a, b) => a[1] - b[1])
    })
  }) 
  const allPossible = []; 

  for(const obj of weights){ 
    for(let i = 0; i < obj.weights.length - 1; i++) {
      const vert = obj.vert;
      const vertToGo = obj.weights[i][0];
      const vertToGoWeight = obj.weights[i][1];
      if(!visited1.includes(vertToGo)) {
        allPossible.push([vertToGo, vertToGoWeight, vert]); 
        i = obj.weights.length;
      }
    }
  };

  const minPossible = allPossible.reduce((a, b) => a[1] < b[1] ? a : b); 
  res.push(minPossible);
  visited1.push(minPossible[0]); 
  treeM[minPossible[0] - 1][minPossible[2] - 1] = 1;
  treeM[minPossible[2] - 1][minPossible[0] - 1] = 1;
  
  if(visited1.length < weightM.length) prim(weightM);
}
prim(fullCopy(W));

for (let i = 0; i < treeM.length; i++) {
  for (let j = 0; j < treeM.length; j++) {
    if(treeM[i][j]) treeM[j][i]= 1;
  }
}

let treeW = nullMatrix(11);
for (let i = 0; i < treeM.length; i++) {
  for (let j = 0; j < treeM.length; j++) {
    if(treeM[i][j]) {
      treeW[i][j] = W[i][j]
    }
  }
}

const iter = res[Symbol.iterator]();

let vertics = [];
const halt = () => {
  ctx.lineWidth = 2;
  let curr = iter.next().value;
  console.log(curr);
  const from = grafinfo[`vert${curr[2]}`];
  const to = grafinfo[`vert${curr[0]}`];
  vertics.push(from.num);
  vertics.push(to.num);
  const w = curr[1];
  if (Math.abs(from.num - to.num) === 1 || Math.abs(from.num - to.num) === (Object.keys(grafinfo).length - 1)) {
    ctx.beginPath();
    ctx.strokeStyle = 'crimson';
    ctx.moveTo(from.coords[0], from.coords[1]);
    ctx.lineTo(to.coords[0], to.coords[1]);
    ctx.stroke();
  } 
  else {
  ctx.beginPath();
  ctx.strokeStyle = 'crimson';
  if (from.num < to.num) {
    const { dx, dy } = doubleAdditionalDots(from.coords[0], from.coords[1], to.coords[0], to.coords[1]);
    let newX = (from.coords[0] + to.coords[0]) / 2;
    let newY = (from.coords[1] + to.coords[1]) / 2;
    newX += dx;
    newY -= dy;
    ctx.moveTo(from.coords[0], from.coords[1]);
    ctx.lineTo(newX, newY);
    ctx.lineTo(to.coords[0], to.coords[1]);
    ctx.stroke();
    } else {
      const { dx, dy } = doubleAdditionalDots(to.coords[0], to.coords[1], from.coords[0], from.coords[1],);
      let newX = (from.coords[0] + to.coords[0]) / 2;
      let newY = (from.coords[1] + to.coords[1]) / 2;
      newX += dx;
      newY -= dy;
      ctx.moveTo(to.coords[0], to.coords[1]);
      ctx.lineTo(newX, newY);
      ctx.lineTo(from.coords[0], from.coords[1]);
      ctx.stroke();
  }
  }
  ctx.font = '17px Times new Roman';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.lineWidth = 1;
  drawVertex(grafinfo);
  for (let i = 0; i < vertics.length; i++) {
      let v = grafinfo[`vert${vertics[i]}`];
      ctx.beginPath();
      ctx.arc(v.coords[0], v.coords[1], r, 0, 2 * Math.PI, false);
      ctx.fillStyle = "YellowGreen";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.strokeText(v.num, v.coords[0], v.coords[1]);
      ctx.stroke();
  }
  drawWeigths(W, grafinfo);
}

ctx.font = '22px Times new Roman';
ctx.fillText('Adjacency matrix of tree', 900, 580);
for (let i = 0; i < treeM.length; i++) {
  ctx.fillText(`${treeM[i]}`, 900, 580 + (i + 1) * 25);
}

makeCons(treeM, treeinfo);
drawDoubleCons(treeinfo);
drawVertex(treeinfo);
drawWeigths(treeW, treeinfo);
