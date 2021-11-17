import * as React from 'react';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { DimensionsContext } from '../DimensionsContext';
import { Dimensions, ProjectedState, RouterParams } from '..';
import { Point, YearData, ProjectedTownship } from './Map.d';
import States from '../../data/states.json';
import AggregatedClaims from '../../data/aggregatedClaims.json';
import NorthAmerica from '../../data/northAmerica.json';
import { CANVASSIZE } from '../Config';
import './Map.css';

const Map = () => {
    const { useEffect, useContext, useState } = React;

    const { width: screenWidth } = (useContext(DimensionsContext) as Dimensions);
    const width = Math.min(900 * 0.9, screenWidth * 0.9);
    const height = width * 500 / 960;
    const [indianCountryD, setIndianCountryD] = useState<string>();

    // calculate values
    const xGutter = 2;
    const yGutter = 2;
    const dx = CANVASSIZE * 0.7; // the 0.7 accounts for there not being any states with homesteading east of MI/OH
    const dy = CANVASSIZE;
    const center: Point = [CANVASSIZE * 0.45, CANVASSIZE * 0.47];
    const rotation = -2;

    const scale = (width / height > dx / dy) ? yGutter * height / dy : xGutter * width / dx;
    const translateX = width / 2 - scale * center[0];
    const translateY = height / 2 - scale * center[1];
    const transform = `translate(${translateX} ${translateY}) rotate(${rotation} ${center[0] * scale} ${center[1] * scale})`;

    // load the data for the map
    useEffect(() => {
        axios(`${process.env.PUBLIC_URL}/data/indianCountry.json`)
            .then(response => {
                setIndianCountryD(response.data.d);
            });
    }, []);

    return (
        <div
        >
            <svg
                width={width * 2}
                height={height}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <g
                    transform={transform}
                >
                    <g transform={`scale(${scale})`}>
                        {NorthAmerica.map((d: any) => (
                            <path
                                d={d}
                                className='continent'
                                key={d.substring(0, 50)}
                            />
                        ))}
                        {(indianCountryD) && (
                            <path
                                d={indianCountryD}
                                fill='green'
                                fillOpacity={0.25}
                                stroke='green'
                                strokeWidth={2}
                                strokeDasharray='2 6'
                            />
                        )}
                        {(States as ProjectedState[]).filter(d => d.abbr !== 'DK' && d.abbr !== 'AK').map(state => (
                            <g key={`state${state.abbr}`}>
                                <path
                                    d={state.d}
                                    fill='transparent'
                                    stroke='grey'
                                    strokeOpacity={0.2}
                                    strokeWidth={1}
                                />
                                <circle
                                    cx={state.labelCoords[0]}
                                    cy={state.labelCoords[1]}
                                    r={Math.sqrt(AggregatedClaims.find(d => d.state === state.abbr).acresClaimed) * 0.003}
                                    fill='#FACB3E'
                                />
                            </g>
                        ))}

                    </g>
                </g>
                <g transform={`translate(10 ${height - 60})`}>
                    <circle
                        cx={18}
                        cy={12}
                        r={10}
                        fill='#FACB3E'
                    />
                    <text
                        x={40}
                        y={20}

                    >
                        Homestead Claims, 1863-1912
                    </text>
                    <path
                        fill="green"
                        fillOpacity={0.25}
                        stroke="green"
                        strokeDasharray="10 20"
                        strokeWidth={5}
                        d="M22.3,-33.3C28.3,-30.8,32.3,-23.7,39.1,-15.8C45.9,-7.9,55.6,0.7,58,10.8C60.4,20.9,55.5,32.4,49,45.6C42.5,58.8,34.2,73.7,22.6,77.4C10.9,81.1,-4.3,73.6,-10.8,60.7C-17.3,47.8,-15.1,29.5,-17.7,19.3C-20.4,9.2,-27.8,7.1,-33.8,1.6C-39.7,-4,-44.1,-13.1,-42.9,-21.2C-41.7,-29.3,-34.8,-36.4,-26.7,-38C-18.7,-39.5,-9.3,-35.5,-0.6,-34.5C8.1,-33.6,16.3,-35.8,22.3,-33.3Z"
                        transform="translate(15 40) scale(0.2)"
                    />
                    <text
                        x={40}
                        y={50}

                    >
                        "Indian Country," May 1862
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default Map;
