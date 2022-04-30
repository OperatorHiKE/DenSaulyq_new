var decodeHtmlEntity = function(x) {
    return x.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};

function initialize(adresses, coordsX, coordsY) {
    var map
    var adr = adresses.split(',')
    var Xs = coordsX.split(',')
    var Ys = coordsY.split(',')

    DG.then(function () {
        map = DG.map('map', {
            center: [51.14832, 71.431447],
            zoom: 13
        })

        /*myDivIcon = DG.divIcon({
            iconSize: [0, 0],
            html: '<img src="https://cdn-icons-png.flaticon.com/512/196/196144.png" style="width: 64px; height: 64px; align-content: center;">'
        });*/

        for (var i = 0; i < Xs.length; i++)
            DG.marker([Xs[i], Ys[i]], {iconSize: [70, 20]}).addTo(map).bindPopup('<h4>' + adr[3*i] + ' ' + adr[3*i + 1] + ' ' + adr[3*i + 2] + '</h4>')
    })
}