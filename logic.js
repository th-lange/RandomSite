let started = false;

let preloaded = []

async function startStopAction() {
    if (!started) {
        $('#startStop').addClass('btn-danger').removeClass('btn-success');
    } else {
        $('#startStop').removeClass('btn-danger').addClass('btn-success');
    }

    var valueFrom = parseInt($('#valueFrom').val());
    var valueTo = parseInt($('#valueTo').val());

    if (valueTo < valueFrom || valueFrom < 0) {
        valueFrom = Math.max(0, valueFrom)
        valueTo = Math.max(valueFrom, valueTo)
        $('#valueTo').value = valueTo
        console.error('Value To smaller then ValueFrom or valueFrom < 0')
    }

    var delayFrom = parseInt($('#delayFrom').val())
    var delayTo = parseInt($('#delayTo').val())

    if (delayTo < delayFrom || delayFrom < 0) {
        delayFrom = Math.max(0, delayFrom)
        delayTo = Math.max(delayFrom, delayTo)
        $('#valueTo').value = delayTo
        console.error('DelayTo smaller then DelayFrom OR DelayFrom < 0')
    }

    value = new RNG((new Date()).getSeconds())
    value.setRange(valueFrom, valueTo)

    delay = new RNG((new Date()).getSeconds())
    delay.setRange(delayFrom, delayTo)

    started = !started;
    preloadAudio(valueFrom, valueTo)
    $('#config-option-elements input').prop("disabled", started);
    await until(_ => started === true, value, delay);

}

function until(isStarted, value, delay) {

    const poll = resolve => {
        if(!isStarted()) {
            resolve();
        } else {
            wait = delay.inRange();
            num = value.inRange();

            setTimeout(function() {
                $('#main-target').text(num)
            }, wait)
            setTimeout(function() {
                preloaded[num].play()
            }, wait - 50)

            setTimeout(_ => poll(resolve), wait);
        }
    }

    return new Promise(poll);
}

function numToAudioResourceString(num)
{
    numStr = num.toString()
    if (numStr.length < 2) {
        numStr = '0' + numStr;
    }

    return 'https://archive.org/3/items/numbers0-100englishpronouciation/en_num_' + numStr + '.mp3'
}


function preloadAudio(start, stop) {

    for (let i = start; i <= stop; i++) {
        preload(i, numToAudioResourceString(i))
    }
}

function preload(key, source) {
    if (preloaded[key]) return;
    preloaded[key] = (new Audio(source))
    preloaded[key].load()
}

/**
 * Modified from orip
 * From https://stackoverflow.com/a/424445
 */
function RNG(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;

    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    return this
}
RNG.prototype.nextInt = function() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
}

RNG.prototype.nextFloat = function() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
}

RNG.prototype.setRange = function(from, to) {
    this.from = from
    this.to = to + 1

}

RNG.prototype.inRange = function() {
    var rangeSize = this.to - this.from;
    var randomUnder1 = this.nextInt() / this.m;
    return this.from + Math.floor(randomUnder1 * rangeSize);
}

RNG.prototype.nextRange = function(start, end) {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    var rangeSize = end - start;
    var randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
    return array[this.nextRange(0, array.length)];
}

