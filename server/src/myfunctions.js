const DataType = require('../src/models/tempmodel');


var keysList = [];
var configDate = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };





// create data and save to the DB
function saveData(reqTemp) {
    let date = new Date();
    if (reqTemp.espName === "esp1") {
        let l = formatDataToStore(reqTemp.value);
        DataType.TemperatureSensorEsp1({
            'date': date,
            'heure': date.toLocaleString('fr-FR', DataType.optionsHeure),
            'Tex': l[1],
            'HRex': l[2],
            'T1te': l[0],
            'T1ti': l[3],
            'HR1ti': l[4],
            'T1ai': l[5],
            'HR1ai': l[6],
            'T1pl': l[7],
            'HR1pl': l[8],
            'T1MEe': l[9],
            'T1Mei': l[10],
            'T1MWe': l[11],
            'T1MWi': l[12],
            'T1MNe': l[13],
            'T1MNi': l[14],
            'T1pe': l[15],
            'T1pi': l[16],
            'T1Fe': l[17],
            'T1Fi': l[18]
        }).save();
    }
    else if (reqTemp.espName === "esp2") {
        let l = formatDataToStore(reqTemp.value);
        DataType.TemperatureSensorEsp2({
            'date': date,
            'heure': date.toLocaleString('fr-FR', DataType.optionsHeure),
            'T2te': l[0],
            'T2ise': l[1],
            'HR2isi': l[2],
            'T2isi': l[3],
            'HR2ai': l[4],
            'T2ai': l[5],
            'HR2pl': l[6],
            'T2pl': l[7],
            'T2MEe': l[8],
            'T2Mei': l[9],
            'T2MWe': l[10],
            'T2MWi': l[11],
            'T2MNe': l[12],
            'T2MNi': l[13],
            'T2pe': l[14],
            'T2pi': l[15],
            'T2Fe': l[16],
            'T2Fi': l[17],
            'T2ce': l[18],
            'T2cs': l[19],
            'T2bar': l[20],
            'T2puis': l[21]
        }).save();
    }
    else if (reqTemp.espName === "esp3") {
        let l = formatDataToStore(reqTemp.value);
        DataType.TemperatureSensorEsp3({
            'date': date,
            'heure': date.toLocaleString('fr-FR', DataType.optionsHeure),
            'T3te': l[0],
            'T3ise': l[1],            
            'HR3isi': l[2],
            'T3isi': l[3],            
            'HR3ai': l[4],
            'T3ai': l[5],
            'HR3pl': l[6],
            'T3pl': l[7],            
            'T3MEe': l[8],
            'T3Mei': l[9],
            'T3MWe': l[10],
            'T3MWi': l[11],
            'T3MNe': l[12],
            'T3MNi': l[13],
            'T3pe': l[14],
            'T3pi': l[15],
            'T3Fe': l[16],
            'T3Fi': l[17],
            'T3ce': l[18],
            'T3cs': l[19],
            'T3bar': l[20],
            'T3puis': l[21]
        }).save();
    }
    else {
        console.log('Erreur !!! can add data');
    }

}

// read data from database
function getData() {
    let lis = [];
    DataType.TemperatureSensorEsp1.find({}, batiment1Keys, function (err, result) {
        if (err) { console.log(err); }
        else {

            lis.push(result);
        }
    });

    DataType.TemperatureSensorEsp2.find({}, batiment2Keys, function (err, result) {
        if (err) { console.log(err); }
        else { tab2 = result; lis.push(result); }
    });
    DataType.TemperatureSensorEsp3.find({}, batiment3Keys, function (err, result) {
        if (err) { console.log(err); }
        else { tab3 = result; lis.push(result); }
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(lis);
        }, 2000);
    });
}

// format the data from the request and store it in the database
function formatDataToStore(request) {

    let fList = formatValues(request);

    let therList = fList[0];
    let dhtList = fList[1];
    // console.log(therList);
    // console.log(dhtList);
    let i;
    if (request.espName == 'esp1') {
        therList.unshift(dhtList[0], dhtList[1]);
        i = 3;
    } else {
        i = 1;
    }
    for (i; i < dhtList.length + 1; i++) {
        therList.splice(i, 0, dhtList[i - 1]);
    }
    console.log(therList);
    return therList;
}

// format values from request return a list with two element [thermistorList, dhtList]
function formatValues(values) {
    let newList = values.split('-');
    let thermistorsList = JSON.parse(newList[0]);
    let dhtList = JSON.parse(newList[1]);
    // console.log(thermistorsList, dhtList);
    return [thermistorsList, dhtList];
}

// separate the esp values in each table list
async function getFilterData(data) {

    let dateDebut = data.dateDebut;
    let dateFin = data.dateFin;
    keysList = Object.keys(data);
    keysList.splice(0, 2);
    let i;

    let dataFromEsp1 = [];
    let dataFromEsp2 = [];
    let dataFromEsp3 = [];

    for (i = 0; i < keysList.length; i++) {
        if (batiment1Keys.includes(keysList[i])) {
            // console.log('ok 1');
            if (dataFromEsp1.length === 0) {
                dataFromEsp1 = await searchData1(dateDebut, dateFin); // on ajoute le resultat de recherche
            }
        }
        else if (batiment2Keys.includes(keysList[i])) {
            if (dataFromEsp2.length === 0) {
                dataFromEsp2 = await searchData2(dateDebut, dateFin);
            }
        }
        else if (batiment3Keys.includes(keysList[i])) {
            if (dataFromEsp3.length === 0) {
                dataFromEsp3 = await searchData3(dateDebut, dateFin);
            }
        } else {
            dataFromEsp1 = [];
            dataFromEsp2 = [];
            dataFromEsp3 = [];
            console.log('Erreur !');
        }
    }
    // console.log(dataFromEsp1);
    return new Promise(resolve => {
        setTimeout(() => {
            // console.log([dataFromEsp1, dataFromEsp2, dataFromEsp3], 'from filterData');
            resolve([dataFromEsp1, dataFromEsp2, dataFromEsp3]);
        }, 500);
    });
}

// retourner la liste des capteurs selectionner pour cette tranche de date
function searchData1(dateDebut, dateFin) {
    let madate = new Date(dateDebut).toISOString();
    let madateFin = new Date(dateFin).toISOString();
    let li = [];
    DataType.TemperatureSensorEsp1.find({ date: { $gte: madate, $lte: madateFin } }, function (err, docs) {
        if (err) { console.log(err); }
        else {
            // console.log(docs);
            docs.forEach(function (elt) {
                li.push(elt);
            });
        }
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(li);
            // console.log(li);
        }, 1000);
    });
}

function searchData2(dateDebut, dateFin) {
    let madate = new Date(dateDebut).toISOString();
    let madateFin = new Date(dateFin).toISOString();
    let li = [];
    DataType.TemperatureSensorEsp2.find({ date: { $gte: madate, $lte: madateFin } }, function (err, docs) {
        if (err) { console.log(err); }
        else {
            // console.log(docs);
            docs.forEach(function (elt) {
                li.push(elt);
            });
        }
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(li);
            // console.log(li);
        }, 1000);
    });
}
function searchData3(dateDebut, dateFin) {
    let madate = new Date(dateDebut).toISOString();
    let madateFin = new Date(dateFin).toISOString();
    let li = [];
    DataType.TemperatureSensorEsp3.find({ date: { $gte: madate, $lte: madateFin } }, function (err, docs) {
        if (err) { console.log(err); }
        else {
            // console.log(docs);
            docs.forEach(function (elt) {
                li.push(elt);
            });
        }
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(li);
            // console.log(li);
        }, 1000);
    });
}

// fonction qui renvoie les données formatées à la chartJS
function sendDataToChart(bigEspDataList) {

    let label = []; // contient les données en legende
    if (bigEspDataList[0].length !== 0) {
        bigEspDataList[0].forEach(function (elt) {
            label.push(elt.date.toLocaleString('fr-FR', configDate));
        });
    } else if (bigEspDataList[1].length !== 0) {
        bigEspDataList[1].forEach(function (elt) {
            label.push(elt.date.toLocaleString('fr-FR', configDate));
        });
    } else if (bigEspDataList[2].length !== 0) {
        bigEspDataList[2].forEach(function (elt) {
            label.push(elt.date.toISOString('fr-FR', configDate));
        });
    }

    let datasets = [];
    keysList.forEach(function (elt) {
        if (batiment1Keys.includes(elt)) {
            let p = [];
            bigEspDataList[0].forEach(function (elt2) {
                p.push(elt2[elt]);
                // console.log(elt2[elt], "hello");
            });
            mycolor = generateColor();
            datasets.push({
                label: elt,
                backgroundColor: mycolor,
                borderColor: mycolor,
                data: p,
                fill: false
            });
            // console.log(datasets);
        }
        else if (batiment2Keys.includes(elt)) {
            let p = [];
            bigEspDataList[1].forEach(function (elt2) {
                p.push(elt2[elt]);
            });
            mycolor = generateColor();
            datasets.push({
                label: elt,
                backgroundColor: mycolor,
                borderColor: mycolor,
                data: p,
                fill: false
            });
        }
        else if (batiment3Keys.includes(elt)) {
            let p = [];
            bigEspDataList[2].forEach(function (elt2) {
                p.push(elt2[elt]);
            });
            let mycolor = generateColor();
            datasets.push({
                label: elt,
                backgroundColor: mycolor,
                borderColor: mycolor,
                data: p,
                fill: false
            });
        }
    });
    console.log(datasets);
    return [datasets, label];
}

function generateColor() {
    let color = 'rgb(';
    color += Math.floor((Math.random() * 255) + 1) + ",";
    color += Math.floor((Math.random() * 255) + 1) + ",";
    color += Math.floor((Math.random() * 255) + 1) + ")";
    return color;
}

class DataSet {
    constructor(label, backgroundColor, borderColor, data, fill) {
        this.label = label;
        this.backgroundColor = backgroundColor;
        this.data = data;
        this.fill = fill;
        this.borderColor = borderColor;
    };

}


module.exports = { getData, saveData, getFilterData, sendDataToChart };