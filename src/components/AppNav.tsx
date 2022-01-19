import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { makeParams } from '../utilities';
import { RouterParams } from '../index.d';
import './ChartButton.css';

export default function AppNav() {
    const params = useParams<RouterParams>();
    return (
        <ul id='appNav'>
            <li>
                <Link
                    to={makeParams(params, [(params.text && params.text === 'introduction') ? { type: 'clear_text' } : { type: 'show_text', payload: 'introduction' }])}
                >
                    Introduction
                </Link>
            </li>
            <li>
                <Link
                    to={makeParams(params, [(params.text && params.text === 'dispossession') ? { type: 'clear_text' } : { type: 'show_text', payload: 'dispossession' }])}
                >
                    Indigenous Dispossession
                </Link>
            </li>
            <li>
                <Link
                    to={makeParams(params, [(params.text && params.text === 'sources') ? { type: 'clear_text' } : { type: 'show_text', payload: 'sources' }])}
                >
                    Sources
                </Link>
            </li>
            <li>
                <Link
                    to={makeParams(params, [(params.text && params.text === 'about') ? { type: 'clear_text' } : { type: 'show_text', payload: 'about' }])}
                >
                    About
                </Link>
            </li>
            <li>
                <a href='//dsl.richmond.edu/panorama#maps'>
                    American Panorama
                </a>
            </li>
        </ul>
    )
}
