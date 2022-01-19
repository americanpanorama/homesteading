import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
import Definitions from '../../data/definitions.json';
import { makeParams } from '../utilities';
import { RouterParams, ClaimsAndPatentsAcresType } from '../index.d';
import './ViewNav.css';
import 'rc-tooltip/assets/bootstrap_white.css';

const OverlayStyle = {
  maxWidth: 400,
  fontSize: 16,
  fontFamily: '"Roboto Condensed", sans-serif',
}

const ViewNav = () => {
  const params = useParams<RouterParams>();
  const { view } = params;
  const year = params.year || '1863';

  const claimsTypes: ClaimsAndPatentsAcresType[] = ["acres_claimed", "acres_claimed_indian_lands"];
  const patentTypes: ClaimsAndPatentsAcresType[] = ["acres_patented", "acres_patented_indian_lands", "acres_commuted_2301", "acres_commuted_18800615", "acres_commuted_indian_lands"];
  const commutationsTypes = patentTypes.slice(2, 5);
  const residencyTypes = patentTypes.slice(0, 2);
  const patentFederalLandsTypes = [patentTypes[0], patentTypes[2], patentTypes[3]];
  const patentIndianLandsTypes = [patentTypes[1], patentTypes[4]];

  const claimsSelected = !view || view.includes('claimed');
  return (
    <React.Fragment>
      <nav className='mainnav'>
        <Link
          to={makeParams(params, [{ type: 'set_view', payload: claimsTypes.join('-') }])}
        >

          <button
            className={(claimsSelected) ? 'selected' : ''}
          >
            claims
            <Tooltip
              placement="bottomRight"
              overlay={<div>{Definitions.claims.description.map(p => <p key={p}>{p}</p>)}</div>}
              overlayStyle={OverlayStyle}
            >
              <span className='tooltip'>?</span>
            </Tooltip>
          </button>
        </Link>
        <Link
          to={makeParams(params, [{ type: 'set_view', payload: patentTypes.join('-') }])}
        >
          <button
            className={(!claimsSelected) ? 'selected' : ''}
          >
            patents
            <Tooltip
              placement="bottomRight"
              overlay={<div>{Definitions.patents.description.map(p => <p key={p}>{p}</p>)}</div>}
              overlayStyle={OverlayStyle}
            >
              <span className='tooltip'>?</span>
            </Tooltip>
          </button>
        </Link>
      </nav>
      {(claimsSelected) && (
        <nav className='subnav'>
          {(parseInt(year) >= 1890) && (
            <React.Fragment>
              <Link
                to={makeParams(params, [{ type: 'set_view', payload: claimsTypes.join('-') }])}
              >
                <button
                  className={(!view || view === claimsTypes.join('-')) ? 'selected' : ''}
                >
                  all
                </button>
              </Link>
              <Link
                to={makeParams(params, [{ type: 'set_view', payload: 'acres_claimed' }])}
              >
                <button
                  className={(view === 'acres_claimed') ? 'selected' : ''}
                >
                  on federal lands
                  <Tooltip
                    placement="bottom"
                    overlay={<div>{Definitions.claims_federal_land.description.map(p => <p key={p}>{p}</p>)}</div>}
                    overlayStyle={OverlayStyle}
                  >
                    <span className='tooltip'>?</span>
                  </Tooltip>
                </button>
              </Link>
              <Link
                to={makeParams(params, [{ type: 'set_view', payload: 'acres_claimed_indian_lands' }])}
              >
                <button
                  className={(view === 'acres_claimed_indian_lands') ? 'selected' : ''}
                >
                  on Indian lands
                  <Tooltip
                    placement="bottom"
                    overlay={<div>{Definitions.claims_indian_lands.description.map(p => <p key={p}>{p}</p>)}</div>}
                    overlayStyle={OverlayStyle}
                  >
                    <span className='tooltip'>?</span>
                  </Tooltip>
                </button>
              </Link>
            </React.Fragment>
          )}
        </nav>
      )}
      {(!claimsSelected) && (
        <nav className='subnav'>
          <Link
            to={makeParams(params, [{ type: 'set_view', payload: patentTypes.join('-') }])}
          >
            <button
              className={(!view || view === patentTypes.join('-')) ? 'selected' : ''}
            >
              all
            </button>
          </Link>

          {(parseInt(year) >= 1890) && (
            <React.Fragment>
              <Link
                to={makeParams(params, [{ type: 'set_view', payload: patentFederalLandsTypes.join('-') }])}
              >
                <button
                  className={(view === patentFederalLandsTypes.join('-')) ? 'selected' : ''}
                >
                  on federal lands
                  <Tooltip
                    placement="bottom"
                    overlay={<div>{Definitions.patents_federal_land.description.map(p => <p key={p}>{p}</p>)}</div>}
                    overlayStyle={OverlayStyle}
                  >
                    <span className='tooltip'>?</span>
                  </Tooltip>
                </button>
              </Link>
              <Link
                to={makeParams(params, [{ type: 'set_view', payload: patentIndianLandsTypes.join('-') }])}
              >
                <button
                  className={(view === patentIndianLandsTypes.join('-')) ? 'selected' : ''}
                >
                  on Indian lands
                  <Tooltip
                    placement="bottom"
                    overlay={<div>{Definitions.patents_indian_lands.description.map(p => <p key={p}>{p}</p>)}</div>}
                    overlayStyle={OverlayStyle}
                  >
                    <span className='tooltip'>?</span>
                  </Tooltip>
                </button>
              </Link>
            </React.Fragment>
          )}
          <Link
            to={makeParams(params, [{ type: 'set_view', payload: residencyTypes.join('-') }])}
          >
            <button
              className={(view === residencyTypes.join('-')) ? 'selected' : ''}
            >
              from residency
              <Tooltip
                placement="bottom"
                overlay={<div>{Definitions.patents_from_residency.description.map(p => <p key={p}>{p}</p>)}</div>}
                overlayStyle={OverlayStyle}
              >
                <span className='tooltip'>?</span>
              </Tooltip>
            </button>
          </Link>
          <Link
            to={makeParams(params, [{ type: 'set_view', payload: commutationsTypes.join('-') }])}
          >
            <button
              className={(view === commutationsTypes.join('-')) ? 'selected' : ''}
            >
              from commutations
              <Tooltip
                placement="bottom"
                overlay={<div>{Definitions.commutations.description.map(p => <p key={p}>{p}</p>)}</div>}
                overlayStyle={OverlayStyle}
              >
                <span className='tooltip'>?</span>
              </Tooltip>
            </button>
          </Link>
        </nav>
      )}
    </React.Fragment>
  );
};

export default ViewNav;
