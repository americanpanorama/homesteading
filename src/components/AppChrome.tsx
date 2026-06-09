import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNav from './AppNav/Index';
import Masthead from './Masthead';

const AppChrome = () => (
  <>
    <Masthead />
    <AppNav />
    <Outlet />
  </>
);

export default AppChrome;
