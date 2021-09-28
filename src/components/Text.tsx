import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { makeParams } from '../utilities';
import { RouterParams } from '..';
import './AppNav.css';
import './Text.css';
import { TextType } from '../index.d';

const objToday = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const todayString = `${months[objToday.getMonth()]} ${objToday.getDate()}, ${objToday.getFullYear()}`;
const texts: { [index in TextType]: React.ReactElement } = {
    about: (
        <React.Fragment>
            <h3>About</h3>
            <p>
                <strong>Julius Wilm</strong> amassed all of the data and wrote the introduction for <cite>Homesteading, 1862-1912</cite>. <strong>Robert K. Nelson</strong> developed and designed the web application. <strong>Justin Madron</strong>, with some assistance from <strong>Nathaniel Ayers</strong>, georectified the General Land Office maps.
            </p>
            <p>
            If you are citing <cite>Homesteading, 1862-1912</cite>, we recommend the following format using the <cite>Chicago Manual of Style</cite>: </p>

            <div className='citation'>Julius Wilm, Robert K. Nelson, and Justin Madron, “Homesteading,” <cite>American Panorama</cite>, ed. Robert K. Nelson and Edward L. Ayers, accessed {todayString}, https://dsl.richmond.edu/panorama/homesteading/.</div>
        </React.Fragment>
    ),
    sources: (
        <React.Fragment>
            <h3>
                Sources
            </h3>
            <p>This web map uses statistics and land district maps that were prepared in the early 1900s by General Land Office (GLO) staff.</p>
            <p>The statistics are based several volumes of tabulations prepared within the GLO’s Accounting Division by the clerk Lucien C. Hendrickson. For the fiscal years 1863-81 and 1909-12, the figures are from a volume on land disposal under the Homestead Act (UD788). The data for the fiscal years 1885-87 and 1889-1909 is from volumes with annual tabulations of private land entries (UD790); data for entries on Indian land for the fiscal years 1892 and 1908-09 was added from quarterly tabulations of land entries (UD789). Missing data for fiscal years 1882-84 and 1888 added is from the GLO’s published Annual Reports.</p>
            <ul>
                <li>US General Land Office. <cite>Record of Disposal of Public Lands under the Homestead Act, 1863-1912</cite>, Record Group 49, Call Number UD788, National Archives I, Washington, DC.</li>
                <li>US General Land Office. <cite>Quarterly Records of Disposal of the Public Lands, 1883-1909</cite>, Record Group 49, Call Number UD789, National Archives I, Washington, DC.</li>
                <li>US General Land Office. Statements of the Disposal of the Public and Indian Lands, 1885-1925, Record Group 49, Call Number UD790, National Archives I, Washington, DC.</li>
                <li>US General Land Office. Annual Report of the Commissioner of the General Land Office, Washington, DC, US Government Printing Office: 1882-84, 1888.</li>
            </ul>
            <p>Most of the land district maps that we use were drawn up in or around 1901 by Andrew F. Dinsmore, a clerk in GLO’s Public Lands Division. Dinsmore mapped all land districts going back to 1802 in preparation for an illustrated history book on the GLO’s operations. The book project was not realized. “Keep this till later – when funds are available; and then we will try to ascertain the cost of the work – in an edition of 500 or 5000 copies,” states an undated note to Dinsmore signed by the GLO’s Chief Clerk Granville N. Whittington. The illustrated history was apparently never revisited, but into the 1920s, clerks at the GLO added new maps to this collection to account for ongoing land district changes.</p>
            <ul>
                <li>US General Land Office. <cite>Diagrams of Land Districts, 1901-1901</cite>, Record Group 49, Call Number UD163F, National Archives I, Washington, DC.</li>
            </ul>
            <p>The mapping and dating of frontier clashes follows two books by Gregory Michno. We only map clashes in the so-called public land states, where the federal government was in charge of land disposal and the Homestead Act in operation. During the homesteading period, Texas had quite a few frontier clashes, but as the state government controlled land disposal, there was no homesteading (under federal statutes) in the state.</p>
            <ul>
                <li>Gregory Michno. <cite>Encyclopedia of Indian Wars: Western Battles and Skirmishes 1850-1890</cite>. Missoula, MT: Mountain Press Publishing Company, 2003.</li>
                <li>Gregory Michno and Susan J. Michno. <cite>Forgotten Fights: Little-Known Raids and Skirmishes on the Frontier, 1823 to 1890</cite>. Missoula, MT: Mountain Press Publishing Company, 2008.</li>
            </ul>
        </React.Fragment>
    ),
    introduction: (
        <React.Fragment>
            <h3>
                Introduction
            </h3>
        </React.Fragment>
    )

};

export default function About() {
    const params = useParams<RouterParams>();
    const { text } = params;
    return (
        <div id='longform'>
            <nav>
                <button>
                    <Link
                        to={makeParams(params, [{ type: 'clear_text' }])}
                    >
                        close
                    </Link>
                </button>
            </nav>

            {texts[text]}



        </div>
    );
}
