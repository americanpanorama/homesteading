import fs from 'fs';

interface Geometry {
    type:        string;
    coordinates: Array<Array<number[]>>;
}

interface newFeature {
    type:       string;
    geometry:   Geometry;
    properties: { [key: string]: number };
}


const rawGeojson: { type: 'FeatureCollection', features: newFeature[] } = JSON.parse(fs.readFileSync('./hexbins1000.json', 'utf-8'));

for (let year = 1863; year <= 1911; year++) {
    const yearGeojsonFeatures: newFeature[] = rawGeojson.features
        .filter(d => d.properties[`y${year}`] > 0)
        .map(d => {
            const properties: { [key: string]: number } = {};
            properties[`y${year}`] = d.properties[`y${year}`];
            properties.fillOpacity = d.properties[`y${year}`] / 5000;
            return {
                type: d.type,
                geometry: d.geometry,
                properties,
            };
        });
    fs.writeFileSync(`./years/${year}.json`, JSON.stringify({
        type: 'FeatureCollection',
        features: yearGeojsonFeatures
    }));
}