import React from 'react';
import axios from 'axios';
import { ReservationSVG } from '../../../Map.d';
import { useURLParams } from '../../../../hooks';
import { getDateValue } from '../../../../utilities';
import * as Styled from './styled';
import * as Constants from '../../../../Constants';

interface IndianLands {
    d: string;
    type: 'reservation' | 'unceded land' | 'open_res';
    opened?: {
        year: number;
        month: number;
        day: number;
    };
}


export default function Reservations() {
    const { useEffect, useState } = React; 
    const { yearNum: year } = useURLParams();

    const [polygons, setPolygons] = useState<IndianLands[]>([])

  // load the data for the map
  useEffect(() => {
    axios(`${process.env.PUBLIC_URL}/data/indianLandsYearData/${year}.json`)
      .then(response => {
        setPolygons(response.data as IndianLands[]);
      });
  }, [year]);

    return (
        <g>
            <defs>
                <pattern
                    id="diagonalStripes"
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                    patternTransform="rotate(45)"
                >
                    <rect width="5" height="10" fill={Constants.indianLandsColors} />
                </pattern>
            </defs>
            {polygons.map(reservation => (
                <Styled.ReservationPath
                    d={reservation.d}
                    key={`reservation${reservation.d.substr(0, 15)}`}
                    $isUnceded={reservation.type === 'unceded land'}
                    $isOpened={reservation.type === 'open_res'}
                />
            ))}
        </g>
    )
}
