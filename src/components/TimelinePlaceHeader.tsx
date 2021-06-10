import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { makeParams } from '../utilities';
import { RouterParams } from '../index.d';
// @ts-ignore
import us from 'us';
import './TimelinePlaceHeader.css';

const TimelinePlaceHeader = () => {
  const params = useParams<RouterParams>();
  const { stateTerr } = params;
  return (
    <h3 id='timelinePlaceHeader'>
      {`${us.lookup(stateTerr).name} `}
      <Link to={makeParams(params, [{ type: 'clear_state' }])}>
        [x]
      </Link>
    </h3>
  );
}

export default TimelinePlaceHeader;
