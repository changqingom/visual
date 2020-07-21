/* eslint-disable no-unused-vars */
//题目二
function unique1(array) {
  if (!Array.isArray(array)) {
    return;
  }
  const temArray = [];

  for (const iterator of array) {
    if (!temArray.includes(iterator)) {
      temArray.push(iterator);
    }
  }
  return temArray;
}

function unique2(array) {
  if (!Array.isArray(array)) {
    return;
  }
  array.filter((item, index) => {
    return array.indexOf(item) === index;
  });
}

function unique3(array) {
  if (!Array.isArray(array)) {
    return;
  }
  return [...new Set(array)];
}

//题目三
//[1,3,4,9,19]
function main1(array) {
  if (array.length === 0) {
    return;
  }
  array.sort((a, b) => {
    return a - b;
  });
  const sum = array.reduce((val, per) => {
    return val + per;
  }, 0);
  const average = sum / array.length;
  return array.reduce((val, per) => {
    if (per) {
      return Math.abs(val - average) <= Math.abs(per - average) ? val : per;
    } else {
      return val;
    }
  });
}
function main2(array) {
  if (array.length === 0) {
    return;
  }
  array.sort((a, b) => {
    return a - b;
  });
  let sum = 0;
  let resultIndex;
  let average;
  for (let index = array.length - 1; index >= 0; index--) {
    sum += array[index];
    if (index === array.length - 1) {
      average = sum;
      resultIndex = index;
    } else {
      average = sum / (array.length - index);
      for (let index2 = 1; index2 < resultIndex - index; index2++) {
        resultIndex =
          Math.abs(array[resultIndex - index2] - average) <=
          Math.abs(array[resultIndex] - average)
            ? resultIndex - index2
            : resultIndex;
      }
      resultIndex =
        Math.abs(array[index] - average) <=
        Math.abs(array[resultIndex] - average)
          ? index
          : resultIndex;
    }
  }
  return array[resultIndex];
}
let tem = [1, 3, 4, 6, 9, 12, 19, 35, 36];
console.log("数组", tem);
console.log("算法1", main1(tem));
console.log("算法2", main2(tem));
