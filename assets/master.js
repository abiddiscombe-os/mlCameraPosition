
// create a placeholder for the map instance
let map = undefined;

function generateMap(type) {

    // hide the splash screen
    document.querySelector('#splash').classList.add("hidden");

    if (type == 'os') {

        // create a map using the OS Vector Tile API as a style
        const apiKey = document.querySelector('#js-input-key').value
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.os.uk/maps/vector/v1/vts/resources/styles?key=' + apiKey,
            center: [-2.9638, 54.4329],
            zoom: 17.30,
            bearing: 178.71,
            pitch: 72.08,
            padding: [0, 0, 0, 0],
            // additional parameters
            maxPitch: 85,
            minZoom: 6,
            maxZoom: 18,
            transformRequest: url => {
                if (url.indexOf('labs') === -1) {
                    return { url: url + '&srs=3857' }
                } else {
                    return { url: url }
                }
            }
        })
        
        // extrude topo features using BHA data
        map.on('load', function() {
            map.addLayer({
                "id": "OS/TopographicArea_2/Building/1_3D",
                "type": "fill-extrusion",
                "source": "esri",
                "source-layer": "TopographicArea_2",
                "filter": [
                    "==",
                    "_symbol",
                    4
                ],
                "minzoom": 15,
                "layout": {},
                "paint": {
                    "fill-extrusion-color": "#DCD7C6",
                    "fill-extrusion-height": [
                        "interpolate",
                        [ "linear" ],
                        [ "zoom" ],
                        15,
                        0,
                        15.05,
                        [ "get", "RelHMax" ]
                    ],
                    "fill-extrusion-opacity": [
                        "interpolate",
                        [ "linear" ],
                        [ "zoom" ],
                        15,
                        0,
                        16,
                        0.9
                    ]
                }
            });
        })

        // show the OS-specific 3D data feature
        document.querySelector('#js-hillshade').classList.remove("hidden");

    } else {

        // // create a map using the demotiles as a style
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [-2.8087, 54.0499],
            zoom: 5.37,
            bearing: 0.00,
            pitch: 52.31,
            padding: [0, 0, 0, 0],
            // additional parameters
            maxPitch: 85,
            minZoom: 6,
            maxZoom: 18,
        });

    }

    // add navigation control capability
    map.addControl(new maplibregl.NavigationControl(), 'top-left');

    // create a listener for map changes
    map.on('render', function(e) {
        getCameraParams()
    });    

}

function getCameraParams() {
    // update the code snippet with live values
    document.querySelector('#js-value-center').innerText = `${map.transform.center.lng.toFixed(4)}, ${map.transform.center.lat.toFixed(4)}`;
    document.querySelector('#js-value-zoom').innerText = `${map.transform.zoom.toFixed(2)}`;
    document.querySelector('#js-value-bearing').innerText = `${map.transform.bearing.toFixed(2)}`;
    document.querySelector('#js-value-pitch').innerText = `${map.transform.pitch.toFixed(2)}`;
    document.querySelector('#js-value-padding').innerText = `${map.transform.padding.top}, ${map.transform.padding.bottom}, ${map.transform.padding.right}, ${map.transform.padding.left}`;
}

function enableTerrainOverlay() {
    // [[ experimental ]]
    map.addSource("terrainData", {
        "type": "raster-dem",
        "tiles": ['https://labs.os.uk/tiles/terrain-rgb/terrain50/{z}/{x}/{y}.png'],
        maxZoom: 9
    })
    map.addSource("hillshadeData", {
        "type": "raster-dem",
        "tiles": ['https://labs.os.uk/tiles/terrain-rgb/terrain50/{z}/{x}/{y}.png'],
        maxZoom: 9
    })
    map.setTerrain({
        source: "terrainData",
        exaggeration: 1
    })
    map.addLayer({
        "id": "hills",
        "type": "hillshade",
        "source": "hillshadeData",
        layout: { "visibility": "visible" },
        paint: { "hillshade-shadow-color": "#bfbfbd" }
    })

}