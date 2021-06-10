import { RouterParams } from './index.d';
import { Actions } from './actions.d';

export const makeParams = (params: RouterParams, actions: Actions): string => {
  const { year, stateTerr, office, fullOpacity } = params;
  let newYear = year;
  let newStateTerr = stateTerr;
  let newOffice = office;
  let newFullOpacity = fullOpacity;
  actions.forEach(a => {
    if (a.type === 'set_year') {
      newYear = a.payload.toString();
    }
    if (a.type === 'set_state') {
      newStateTerr = a.payload.replace(/[^a-zA-Z0-9]/g, '');
      newOffice = null;
    }
    if (a.type === 'clear_state') {
      newStateTerr = null;
    }
    if (a.type === 'set_office') {
      newOffice = a.payload.replace(/[^a-zA-Z0-9]/g, '');
    }
    if (a.type === 'clear_office') {
      newOffice = null;
    }
  });

  let newPath = '';
  if (newYear) {
    newPath += `/year/${newYear}`;
  }
  if (newStateTerr) {
    newPath += `/stateTerr/${newStateTerr}`;
  }
  if (newOffice) {
    newPath += `/office/${newOffice}`;
  }
  if (newFullOpacity) {
    newPath += `/fullOpacity/${newFullOpacity}`;
  }
  return newPath;
};  
