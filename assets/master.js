map = new maplibregl.Map({
    container: 'map',
    style: 'https://labs.os.uk/tiles/styles/open-zoomstack-outdoor/style.json',
    // params: required
    center: [-2.9638, 54.4329],
    zoom: 15.42,
    bearing: 15.51,
    pitch: 60,
    padding: [0, 0, 0, 0],
    // params: optional
    minZoom: 6,
    maxZoom: 18,
    maxBounds: [
        [-7.5571598, 49.7668072],
        [3.6320186, 61.4645894]
    ],
    transformRequest: url => {
        if (url.indexOf('labs') === -1) {
            return { url: url + '&srs=3857' }
        } else {
            return { url: url }
        }
    }
})

map.on('load', function() {

    // add stock navigation control
    map.addControl(new maplibregl.NavigationControl(), 'top-left');

    // add a source of the RGBified terrain50 dataset
    map.addSource("terrainData", {
        "type": "raster-dem",
        "tiles": ['https://labs.os.uk/tiles/terrain-rgb/terrain50/{z}/{x}/{y}.png'],
    })

    // set the terrain value without relief exaggeration
    map.setTerrain({
        source: "terrainData",
        exaggeration: 1
    })

    // add hillshade
    map.addLayer({
        "id": "hills",
        "type": "hillshade",
        "source": "terrainData",
        layout: { "visibility": "visible" },
        paint: { "hillshade-shadow-color": "#bfbfbd" }
    })

})

map.on('render', function(e) {
    updateCameraPos()
});

function updateCameraPos() {
    document.querySelector('#js-value-center').innerText = `${map.transform.center.lng.toFixed(4)}, ${map.transform.center.lat.toFixed(4)}`;
    document.querySelector('#js-value-zoom').innerText = `${map.transform.zoom.toFixed(2)}`;
    document.querySelector('#js-value-bearing').innerText = `${map.transform.bearing.toFixed(2)}`;
    document.querySelector('#js-value-pitch').innerText = `${map.transform.pitch.toFixed(2)}`;
    document.querySelector('#js-value-padding').innerText = `${map.transform.padding.top}, ${map.transform.padding.bottom}, ${map.transform.padding.right}, ${map.transform.padding.left}`;
}