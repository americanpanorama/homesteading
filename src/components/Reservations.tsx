import React from 'react';
import { useParams } from 'react-router-dom';
import ReservationPolygons from '../../public/data/reservationsSVG.json';
import { ReservationSVG } from './Map.d';
import { RouterParams } from '../index.d';
import { getDateValue } from '../utilities';


export default function Reservations() {
    const { year: yearStr } = useParams<RouterParams>();
    const year = (yearStr) ? parseInt(yearStr) : 1863;

    const reservations = (ReservationPolygons as ReservationSVG[])
        .filter(reservation => {
            const startValue = getDateValue(reservation.startYear, reservation.startMonth, reservation.startDay);
            const endValue = getDateValue(reservation.endYear, reservation.endMonth, reservation.endDay);
            const fiscalYearStart = getDateValue(year - 1, 7, 1);
            const fiscalYearEnd = getDateValue(year, 6, 30);
            return  (
                (startValue < fiscalYearStart && endValue > fiscalYearStart) ||
                (startValue < fiscalYearEnd && endValue > fiscalYearEnd) ||
                (startValue > fiscalYearStart && endValue < fiscalYearEnd)
            );
        });

    return (
        <g>
            {reservations.map(reservation => (
                <path
                    d={reservation.d}
                    key={`reservation${reservation.id}`}
                    id={`reservation${reservation.id}`}
                    className={`indianLand ${(reservation.type === 'unceded land') ? 'unceded' : ''} ${(reservation.opened && reservation.endYear === year) ? 'opened' : ''}`}
                />
            ))}
        </g>
    )
}
