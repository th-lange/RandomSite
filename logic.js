let started = false;

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

    started = !started;
    await until(_ => started !== true, valueFrom, valueTo, delayFrom, delayTo);

}

function until(conditionFunction, valueFrom, valueTo, delayFrom, delayTo) {

    const poll = resolve => {
        if(conditionFunction()) {
            resolve();
        } else {
            wait = Math.floor(Math.random() * (delayFrom - delayTo + 1) ) + delayTo;
            num = Math.floor(Math.random() * (valueFrom - valueTo + 1) ) + valueTo;

            setTimeout(function() {
                numStr = num.toString()
                if (numStr.length < 2) {
                    numStr = '0' + numStr;
                }
                console.log(numStr)
                new Audio('https://archive.org/3/items/numbers0-100englishpronouciation/en_num_' + numStr + '.mp3').play()
                $('#main-target').text(num)
            }, wait)


            setTimeout(_ => poll(resolve), wait);
        }
    }

    return new Promise(poll);
}


