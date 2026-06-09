import React from 'react';

const Sources = () => (
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
        <p>The mapping of Indigenous lands and reservations uses shapefiles drawn up by the U.S. Forest Service and a data spreadsheet compiled by historian Claudio Saunt. These shapefiles and data are based on maps of Indian land cessions originally drawn up by Charles C. Royce for the period 1784-1894. To ensure a correct interpretation of the land cessions data and to extend the coverage for the years after 1894, we have consulted the Office of Indian Affairs' annual maps of Indian reservations and other publications.</p>
        <ul>
            <li>U.S. Department of Agriculture. Forest Service, <a href='https://data.fs.usda.gov/geodata/edw/edw_resources/meta/S_USA.TRIBALCEDEDLANDS.xml' target='_blank' rel='noopener noreferrer'>“Tribal Land Cessions in the United States,”</a> April 19, 2018.</li>
            <li>U.S. Office of Indian Affairs, Map Showing Indian Reservations within the Limits of the United States (Washington, DC: U.S. Office of Indian Affairs, 1888-1917).</li>
            <li>U.S. Office of Indian Affairs, General Data Concerning Indian Reservations (Washington, DC: U.S. Government Printing Office, 1930)</li>
            <li>Claudio Saunt, <a href='https://data.fs.usda.gov/geodata/edw/edw_resources/fc/S_USA.TribalCededLandsTable.gdb.zip' target='_blank' rel='noopener noreferrer'>“Tribal Ceded Lands Table,”</a> April 19, 2018.</li>
        </ul>
        <p>The mapping and dating of frontier clashes follows two books by Gregory Michno. We only map clashes in the so-called public land states, where the federal government was in charge of land disposal and the Homestead Act in operation. During the homesteading period, Texas had quite a few frontier clashes, but as the state government controlled land disposal, there was no homesteading (under federal statutes) in the state.</p>
        <ul>
            <li>Gregory Michno. <cite>Encyclopedia of Indian Wars: Western Battles and Skirmishes 1850-1890</cite>. Missoula, MT: Mountain Press Publishing Company, 2003.</li>
            <li>Gregory Michno and Susan J. Michno. <cite>Forgotten Fights: Little-Known Raids and Skirmishes on the Frontier, 1823 to 1890</cite>. Missoula, MT: Mountain Press Publishing Company, 2008.</li>
        </ul>
        <p>Please note, the details recorded were heavily influenced by the perspectives of army officials, on whose reports the data points are mostly based. The data should therefore be treated with caution regarding the identity of the nations involved, as well as the casualty figures and the often euphemistic naming of confrontations.</p>
    </React.Fragment>
);

export default Sources;
