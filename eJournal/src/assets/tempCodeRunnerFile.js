const arr = [{
    1: [1, 2, 3],
    2: [1, 2, 3],
}, {
    1: [1, 2, 3],
    2: [1, 2, 3],
}];

for (let i in arr) {
    arr[i][3] = [];
    arr[i][3].push({}, {});
}

console.log(arr);
