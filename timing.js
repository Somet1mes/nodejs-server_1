
let d = new Date();

let a = [];
let b = [];

let len = 10000;

a[len] = 1;
b[len] = 1;
console.log(a[len]);
console.log(len);

for (let ii = 0; ii < len; ii++)
{

    for (let i = 0; i < a.length; i++)
    {
        if (a[i] != undefined)
        {
            //console.log(a[i]);
        }
    }
}

let d2 = new Date();

console.log(d2.getTime() - d.getTime());