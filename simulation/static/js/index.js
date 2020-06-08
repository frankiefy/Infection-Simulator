function run () {
    var population = parseInt(document.getElementById('population-start').innerHTML)
    var start_infected_population = parseInt(document.getElementById('start_infected').value)
    startingPersons = []
    while (startingPersons.length<start_infected_population) {
        poss = getRandomInt(population)
        if (!(startingPersons.includes(poss))) {
            startingPersons.push(poss)
        }
    }
    for (x=0;x<population;x++) {
        document.getElementById('houseRow').insertAdjacentHTML('beforeend','<td id="house-'+x+'"><font class="person" id="person-'+x+'" data-health="10" onclick="infect(this)">&bull;</font></td>')
        document.getElementById('streetRow').insertAdjacentHTML('beforeend','<td id="street-'+x+'"></td>')
    };
    for (z=0;z<startingPersons.length;z++) {
        document.getElementById('person-'+startingPersons[z]).click()
    }
    var myVar = setInterval(function(){ step(); },100);
}

function step () {
    var time = document.getElementById('time')
    var timeperiod = parseInt(document.getElementById('timeperiod').innerHTML)
    var day = parseInt(document.getElementById('day-counter').innerHTML)
    if (time.innerHTML == "DAY") {      // CYCLE DAY/NIGHT
        time.innerHTML = "NIGHT";
    } else {
        time.innerHTML = "DAY"
        day++;                          // ADD A DAY
        document.getElementById('day-counter').innerHTML = day
        if (day == timeperiod+1) {
            document.getElementsByTagName('form')[0].submit()
        }
    }

    var population = parseInt(document.getElementById('population-start').innerHTML)
    for (x=0;x<population;x++) {
        xhouse = document.getElementById('house-'+x)
        xstreet = document.getElementById('street-'+x)

        if (time.innerHTML == "DAY") {                                      // GOING OUT TODAY?
            if (!(xhouse.children[0].classList.contains('dead'))) {         // NOT DEAD
                if (!(xhouse.children[0].classList.contains('infected'))) { // NOT INFECTED
                    xstreet.innerHTML = xhouse.innerHTML                    // THEN YES
                    xhouse.innerHTML = ""
                } else {                                                    // but maybe they'll still go out
                    if (getRandomInt(10-(parseInt(document.getElementById('spread_infected').innerHTML))) == 0) {                             // 1:5 INFECTED PEOPLE GOING OUTSIDE
                        xstreet.innerHTML = xhouse.innerHTML
                        xhouse.innerHTML = ""
                    }
                }
            }
        } else {
            if (xstreet.childElementCount > 0) {                            // COMING HOME
                xhouse.innerHTML = xstreet.innerHTML
                xstreet.innerHTML = ""
            }
        }
    };
    for (x=0;x<population;x++) {
        xhouse = document.getElementById('house-'+x)
        xstreet = document.getElementById('street-'+x)

        if (time.innerHTML == "NIGHT") {
            if (xhouse.childElementCount > 0) {
                if (xhouse.children[0].classList.contains('infected')) {    // ADJUST HEALTH AT NIGHT
                    xhouse.children[0].dataset.health = parseInt(xhouse.children[0].dataset.health) - 1 // REMOVE HEALTH POINT?
                    if (parseInt(xhouse.children[0].dataset.health) == 0) { // ADD A DEATH?
                        xhouse.children[0].classList.add('dead')
                        document.getElementById('population-current').innerHTML = parseInt(document.getElementById('population-current').innerHTML) - 1
                        document.getElementById('population').value = parseInt(document.getElementById('population-current').innerHTML)
                        document.getElementById('dead-count').innerHTML = parseInt(document.getElementById('dead-count').innerHTML) + 1
                        document.getElementById('dead-population').value = parseInt(document.getElementById('dead-count').innerHTML)
                    }
                }
            }
        }

        if (time.innerHTML == "DAY") {                                      // WHO GETS INFECTED IN THE DAY
            if (xstreet.childElementCount > 0) {                            // IF SOMEONE IS IN THE STREET
                if (xstreet.children[0].classList.contains('infected')) {   // IF THEYRE INFECTED
                    if (x > 0) {                                            // IF SOMEONE IS TO THEIR LEFT
                        xleftstreet = document.getElementById('street-'+(x-1))
                        if (xleftstreet.childElementCount > 0) {
                            if (!(xleftstreet.children[0].classList.contains('infected'))) {// IF THAT PERSON IS NOT ALREADY INFECTED
                                if (getRandomInt(3) == 0) {                 // 1:3 THEY GET INFECTED
                                    xleftstreet.children[0].click()
                                }
                            }
                        }
                    }
                    if (x < population-1) {
                        xrightstreet = document.getElementById('street-'+(x+1))
                        if (xrightstreet.childElementCount > 0) {
                            if (!(xrightstreet.children[0].classList.contains('infected'))) {
                                if (getRandomInt(3) == 0) {
                                    xrightstreet.children[0].click()
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    if (time.innerHTML == "NIGHT") { // RECORD DATA
        currentData = document.getElementById('data').value

        currentPopulation = document.getElementById('population').value
        infectedPopulation = document.getElementById('infected-population').value
        deadPopulation = document.getElementById('dead-population').value

        document.getElementById('data').value = currentData + ("|"+currentPopulation+","+infectedPopulation+","+deadPopulation)
    }
}

function infect (elem) {
    if (!(elem.classList.contains('infected'))) {
        elem.classList.add('infected')
        document.getElementById('infected-count').innerHTML = parseInt(document.getElementById('infected-count').innerHTML) + 1
        document.getElementById('infected-population').value = parseInt(document.getElementById('infected-count').innerHTML)
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomInfect (x) {
    z = getRandomInt(x)
    document.getElementById('person-'+z).click()
}

function selectChart(name) {
    containers = document.getElementsByClassName('chart-container')
    selects = document.getElementsByClassName('chart-select')
    for (i=0;i<containers.length;i++) {
        containers[i].style.display = 'none';
        selects[i].classList.remove('active');
    }
    document.getElementById('chart-container-'+name).style.display = 'block'
    document.getElementById('chart-select-'+name).classList.add('active')
}

function saveImage(canvasid) {
    var canvas = document.getElementById(canvasid);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href=image;
}