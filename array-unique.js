// 生成用于测试的数组
const arr = [];
// 生成[0, 100000]之间的随机数
for (let i = 0; i < 100000; i++) {
    arr.push(0 + Math.floor((100000 - 0 + 1) * Math.random()))
}




// 1. 两层循环嵌套 arr.splice() 兼容性好 改变原数组   
function unique(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                arr.splice(j, 1);
                j--;
                //这里会造成一个问题使用splice删除数组中的某一项后,删除这一项后面的每一项索引都要向前进一位
                // (在原有索引上减一)，但是下一次循环还是会j++造成被删的后一项直接被循环掠过，所以此时应该j--来解决这个问题。
            }
        }
    }
    return arr;
}
// console.time('test');
// console.log(unique(arr));  // test: 5889.838ms
// console.timeEnd('test');

// 优化：
function unique(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length;) {
            arr[i] === arr[j] ? arr.splice(j, 1) : j++; // 三目运算符，在不删除重复项时再 j++
        }
    }
    return arr;
}

// console.time('test');
// console.log(unique(arr));  // test: 6023.593ms
// console.timeEnd('test');




// 2. arr.filter()返回符合条件的新数组，不改变原数组
// 条件: 数组中的元素第一次出现的位置等于当前元素的下标
function unique(arr) {
    return arr.filter((item, index, arr) => arr.indexOf(item) === index);
}
// console.time('test');
// console.log(unique(arr));  // test: 4282.549ms
// console.timeEnd('test');




// 3. 借助新数组和arr.indexOf()
function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
// console.time('test');
// console.log(unique(arr));  // test: 3313.438ms
// console.timeEnd('test');




// 4. 先对数组进行排序，然后判断第 i 项与第 i+1 项不相等的push进新数组里
function unique(arr) {
    var newArr = [];
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== arr[i + 1]) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
// console.time('test');
// console.log(unique(arr));  // test: 85.908ms
// console.timeEnd('test');

// 优化：
function unique(arr) {
    var newArr = [];
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== newArr[newArr.length - 1]) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
// console.time('test');
// console.log(unique(arr));  // test: 84.643ms
// console.timeEnd('test');
// 另外一种思路：不借助新数组，在原数组进行删除
function unique(arr) {
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
            arr.splice(i, 1);   // 耗性能
            i--;
        }
    }
    return arr;
}
// console.time('test');
// console.log(unique(arr));  // test: 1552.126ms
// console.timeEnd('test');




// 5.对象键值对 
// 利用一个空的 Object 对象，把数组的值存成 Object 的 key 值，利用了对象的key不可以重复的特性来进行去重
// 存在的问题：
// 无法区分隐式类型转换成字符串后一样的值，比如 1 和 '1' 
// （对象的键在存储时只能是字符串 Map 的键存储时可以是任意类型，Map的每个成员都是一个双元素数组的数据结构）
// 无法处理复杂数据类型，比如对象（因为对象作为 key 会变成 [object Object]）
// 特殊数据，比如 'proto'，因为对象的 proto 属性无法被重写

// 解决一、三问题：
function unique(arr) {
    var newArr = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[typeof arr[i] + arr[i]]) { // 转换成字符串： number1 / string1
            obj[typeof arr[i] + arr[i]] = 1;
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
// console.time('test');
// console.log(unique(arr));  // test: 97.549ms
// console.timeEnd('test');

// 解决二问题：
function unique(arr) {
    var newArr = [];
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[typeof arr[i] + JSON.stringify(arr[i])]) { // 如果是复杂数据类型则转换成字符串序列然后作为key
            obj[typeof arr[i] + JSON.stringify(arr[i])] = 1;
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
// console.time('test');
// console.log(unique(arr));  // test: 122.229ms
// console.timeEnd('test');




// 6. ES6新增数据类型 Map 结构 （Map结构的键可以是任意类型，所以比object的方法更好，最优法）
function unique(arr) {
    var newArr = [];
    var map = new Map();
    for (var i = 0; i < arr.length; i++) {
        if (!map.get(arr[i])) {
            map.set(arr[i], 1);
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
// console.time('test');
// console.log(unique(arr)); // test: 18.853ms
// console.timeEnd('test');

// 优化：
function unique(arr) {
    var map = new Map();
    return arr.filter(item => !map.get(item) && map.set(item, 1));
}
// console.time('test');
// console.log(unique(arr)); // test: 19.090ms
// console.timeEnd('test');




// 7. ES6新增数据类型 set 结构 返回为类数组，需要转换为数组形式
function unique(arr) {
    return [...new Set(arr)];
}
// console.time('test');
// console.log(unique(arr));  // test: 22.604ms
// console.timeEnd('test');