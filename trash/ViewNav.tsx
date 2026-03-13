import Tooltip from 'rc-tooltip';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Definitions from '../data/definitions.json';
import { ClaimsAndPatentsAcresType } from '../src';
import { useURLParams } from '../src/hooks';
import { makeParams } from '../src/utilities';

const OverlayStyle = {
  maxWidth: 400,
  fontSize: 16,
  fontFamily: '"Roboto Condensed", sans-serif',
}

const NavLinkButton = ({ to, selected, children }: { to: string; selected: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`view-link${selected ? ' selected' : ''}`}
    aria-current={selected ? 'page' : undefined}
  >
    {children}
  </Link>
);

const ViewNav = () => {
  const params = useURLParams();
  const { view, yearNum } = params;

  const claimsTypes: ClaimsAndPatentsAcresType[] = ["acres_claimed", "acres_claimed_indian_lands"];
  const patentTypes: ClaimsAndPatentsAcresType[] = ["acres_patented", "acres_patented_indian_lands", "acres_commuted_2301", "acres_commuted_18800615", "acres_commuted_indian_lands"];
  const commutationsTypes = patentTypes.slice(2, 5);
  const residencyTypes = patentTypes.slice(0, 2);
  const patentFederalLandsTypes = [patentTypes[0], patentTypes[2], patentTypes[3]];
  const patentIndianLandsTypes = [patentTypes[1], patentTypes[4]];

  const claimsSelected = !view || view.includes('claimed');
  return (
    <React.Fragment>
      <nav className='mainnav' aria-label='Primary data view selector'>
        <NavLinkButton
          to={makeParams(params, [{ type: 'set_view', payload: claimsTypes.join('-') }])}
          selected={claimsSelected}
        >
          claims
          <Tooltip
            placement="bottomRight"
            overlay={<div>{Definitions.claims.description.map(p => <p key={p}>{p}</p>)}</div>}
            overlayStyle={OverlayStyle}
          >
            <span className='tooltip'>?</span>
          </Tooltip>
        </NavLinkButton>
        <NavLinkButton
          to={makeParams(params, [{ type: 'set_view', payload: patentTypes.join('-') }])}
          selected={!claimsSelected}
        >
          patents
          <Tooltip
            placement="bottomRight"
            overlay={<div>{Definitions.patents.description.map(p => <p key={p}>{p}</p>)}</div>}
            overlayStyle={OverlayStyle}
          >
            <span className='tooltip'>?</span>
          </Tooltip>
        </NavLinkButton>
      </nav>
      {(claimsSelected) && (
        <nav className='subnav' aria-label='Claims subview selector'>
          {(yearNum >= 1890) && (
            <React.Fragment>
              <NavLinkButton
                to={makeParams(params, [{ type: 'set_view', payload: claimsTypes.join('-') }])}
                selected={!view || view === claimsTypes.join('-')}
              >
                all
              </NavLinkButton>
              <NavLinkButton
                to={makeParams(params, [{ type: 'set_view', payload: 'acres_claimed' }])}
                selected={view === 'acres_claimed'}
              >
                on federal lands
                <Tooltip
                  placement="bottom"
                  overlay={<div>{Definitions.claims_federal_land.description.map(p => <p key={p}>{p}</p>)}</div>}
                  overlayStyle={OverlayStyle}
                >
                  <span className='tooltip'>?</span>
                </Tooltip>
              </NavLinkButton>
              <NavLinkButton
                to={makeParams(params, [{ type: 'set_view', payload: 'acres_claimed_indian_lands' }])}
                selected={view === 'acres_claimed_indian_lands'}
              >
                on Indian lands
                <Tooltip
                  placement="bottom"
                  overlay={<div>{Definitions.claims_indian_lands.description.map(p => <p key={p}>{p}</p>)}</div>}
                  overlayStyle={OverlayStyle}
                >
                  <span className='tooltip'>?</span>
                </Tooltip>
              </NavLinkButton>
            </React.Fragment>
          )}
        </nav>
      )}
      {(!claimsSelected) && (
        <nav className='subnav' aria-label='Patents subview selector'>
          <NavLinkButton
            to={makeParams(params, [{ type: 'set_view', payload: patentTypes.join('-') }])}
            selected={!view || view === patentTypes.join('-')}
          >
            all
          </NavLinkButton>

          {(yearNum >= 1890) && (
            <React.Fragment>
              <NavLinkButton
                to={makeParams(params, [{ type: 'set_view', payload: patentFederalLandsTypes.join('-') }])}
                selected={view === patentFederalLandsTypes.join('-')}
              >
                on federal lands
                <Tooltip
                  placement="bottom"
                  overlay={<div>{Definitions.patents_federal_land.description.map(p => <p key={p}>{p}</p>)}</div>}
                  overlayStyle={OverlayStyle}
                >
                  <span className='tooltip'>?</span>
                </Tooltip>
              </NavLinkButton>
              <NavLinkButton
                to={makeParams(params, [{ type: 'set_view', payload: patentIndianLandsTypes.join('-') }])}
                selected={view === patentIndianLandsTypes.join('-')}
              >
                on Indian lands
                <Tooltip
                  placement="bottom"
                  overlay={<div>{Definitions.patents_indian_lands.description.map(p => <p key={p}>{p}</p>)}</div>}
                  overlayStyle={OverlayStyle}
                >
                  <span className='tooltip'>?</span>
                </Tooltip>
              </NavLinkButton>
            </React.Fragment>
          )}
          <NavLinkButton
            to={makeParams(params, [{ type: 'set_view', payload: residencyTypes.join('-') }])}
            selected={view === residencyTypes.join('-')}
          >
            from residency
            <Tooltip
              placement="bottom"
              overlay={<div>{Definitions.patents_from_residency.description.map(p => <p key={p}>{p}</p>)}</div>}
              overlayStyle={OverlayStyle}
            >
              <span className='tooltip'>?</span>
            </Tooltip>
          </NavLinkButton>
          <NavLinkButton
            to={makeParams(params, [{ type: 'set_view', payload: commutationsTypes.join('-') }])}
            selected={view === commutationsTypes.join('-')}
          >
            from commutations
            <Tooltip
              placement="bottom"
              overlay={<div>{Definitions.commutations.description.map(p => <p key={p}>{p}</p>)}</div>}
              overlayStyle={OverlayStyle}
            >
              <span className='tooltip'>?</span>
            </Tooltip>
          </NavLinkButton>
        </nav>
      )}
    </React.Fragment>
  );
};

export default ViewNav;
