class ViewPort {

    constructor(map) {
        this.map = map;
        this.minLng = MAX_COORDINATE;
        this.minLat = MAX_COORDINATE;
        this.maxLng = -MAX_COORDINATE;
        this.maxLat = -MAX_COORDINATE;
    }

    updateView(geoJsonStr) {

        // Geographic coordinates of the LineString
        const coordinates = geoJsonStr.features[0].geometry.coordinates;

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
            coordinates[0],
            coordinates[0]
        );

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
            bounds.extend(coord);
        }

        this.map.fitBounds(bounds, {
            padding: 20
        });
    }
}