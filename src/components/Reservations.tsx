import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ReservationSVG } from './Map.d';
import { RouterParams } from '../index.d';
import { getDateValue } from '../utilities';

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
    const { year: yearStr } = useParams<RouterParams>();
    const year = (yearStr) ? parseInt(yearStr) : 1863;

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
            {polygons.map(reservation => (
                <path
                    d={reservation.d}
                    key={`reservation${reservation.d.substr(0, 15)}`}
                    className={`indianLand ${(reservation.type === 'unceded land') ? 'unceded' : ''} ${(reservation.type === 'open_res') ? 'opened' : ''}`}
                />
            ))}
        </g>
    )
}
