
var prevTime = new Date().getTime();
var sum = 0;
var num = 0;

setInterval(function()
{
    var d = new Date();
    var time = d.getTime();
    var period = (time - prevTime); // Convert to s from ms
    prevTime = time;
    if (period > 110)
    {
        console.log(period);
    }
    sum += period;
    num++;
    if (num > 1000)
    {
        console.log('av', sum/num);
        process.exit(0);
    }
}, 30)