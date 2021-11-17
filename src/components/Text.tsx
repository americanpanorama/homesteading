import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { makeParams } from '../utilities';
import { RouterParams } from '..';
import IndianCountryMap from './IndianCountryMap';
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
            <p>Please note, the details recorded were heavily influenced by the perspectives of army officials, on whose reports the data points are mostly based. The data should therefore be treated with caution regarding the identity of the nations involved, as well as the casualty figures and the often euphemistic naming of confrontations.</p>
        </React.Fragment>
    ),
    introduction: (
        <React.Fragment>
            <h3>
                Introduction
            </h3>
            <p>The Homestead Act, passed in May 1862, shaped agricultural and social development in the western United States for many decades. Into the second half of the 1920s, millions of settler households used the law's offer to farm and reside on a parcel of public land for five years, after which they would receive the full property title to the land. A smaller number even used the law in the years after World War II. In the lower forty-eight states, the settlement practice did not officially end until 1976, and in Alaska not until 1986.</p>
            <p>It is difficult to summarize the homesteading experience as a whole, even if one only takes the perspective of the people who claimed land under the law. Settlers took land in very different regions and over a long time, during which new technologies and infrastructure dramatically changed the nature of farm-building. While the first homesteaders in remote areas still struggled to procure building materials and transport crops by wagon, later settlers had access to railroads, better roads, and eventually even cars. Despite these developments, homesteading remained an uncertain business, also in later years. During all phases and in all regions, the number of homesteaders who registered a claim far exceeded the number who succeeded in turning their claim into a final patent. Unsuccessful attempts to build farms were always an integral part of the settlement practice.</p>
            <p>Homesteading was controversial from the beginning. Land reformers had hoped the passage of the free land law would result in a more harmonious society overall, with less harsh class antagonism. But they were quickly disappointed. Most prominently, many lamented the widespread practice of "commuting" homesteads, meaning the early purchase of land parcels by claimants before the expiry of the law's standard five-year residency requirement. Many, including a fair number of lawmakers and later historians, suspected that massive fraud was hiding behind this practice. Instead of supporting the agrarian, Jeffersonian ideal of a society of independent farmers, the Homestead Act seemed to unleash a fierce competition for land to resell, in which influential speculators were coming out on top.</p>
            <p>Historians of the neo-progressive school around Paul W. Gates, which dominated the field from the 1930s to the 1970s, found truth in these complaints. In recent years, however, historians have questioned some of these assumptions. In addition, researchers have also gone beyond measuring the practice of homesteading against its ideals. Instead, studies ask the following questions: To what extent have homesteaders contributed to and benefited from the dispossession and marginalization of Indigenous peoples? Was the opportunity of obtaining land in practice available to all citizens, including non-whites? Or did the land donation program contribute to the existing racial wealth gap by effectively (if not by law) limiting the land to white claimants? How did the law affect the division of labor and the position of women in settler households? What ecological implications did homestead settlements have in different contexts?</p>

            <h3>Mapping homesteading</h3>
            <p>This map offers a new view of the history of homesteading in the first fifty years following the adoption of the Homestead Act. Mapping the General Land Office's internal statistics from local land offices for the entire period from 1863 to 1912, the map provides a granular view of homestead settlements. Previously, statistics were only available for the state level, covering a shorter period, and were compiled in inconsistent ways. The map uses newly digitized diagrams of local land districts that the General Land Office had prepared for a newer published illustrated history to visualize the new statistics. By going below the state level, the map enables a more intricate view of where homesteaders claimed land—and how many claims were converted to full property titles by residency or early purchase (“commutations”).</p>
            <p>The map shows previously unknown patterns in the data, such as local land rushes, which tend to get lost in state-level data. The map also reveals locally very distinct patterns of perfecting claims by commutation instead of residency—which may add to the understanding of controversies surrounding the practice. There are also some larger discoveries in this map; for example, the relatively large number of original and final homesteads in the Deep South states of Alabama, Arkansas, Florida, Louisiana, and Mississippi. Little is known about how homesteading worked in the Jim Crow South, who could use the law, and how it affected social relations under Jim Crow. There has also been little research on homesteading in the Great Lakes region. Beyond making these and other patterns visible, the map also allows for contextualizing qualitative sources, for example, by showing to what extent they corresponded to general patterns—or contradicted them.</p>
            <p>Our map allows for re-examining many different research questions, both old and new. A specific purpose of the map is however to show how homesteaders contributed to and benefited from the dispossession of Indigenous nations. To serve this purpose, we have added another data category to the map: frontier clashes in the "public land" states, that is to say, all the western states except Texas (where the Homestead Act did not apply). These event data show a temporal overlap in the claims between Indigenous people and homesteaders who built farms on previously Indigenous lands. In later years, when the U.S. government carved up reservations into allotments for individual Indigenous households under the 1887 Allotment Act (also known as the Dawes Act), there were also the "homesteads on Indian land." These were claims on the unallotted or "surplus lands" of Indian reservations. In different ways—and with vastly different consequences—homesteading contributed to the marginalization of Indigenous peoples through the entire era covered by this map (for more on this, see the text "Homesteading and Indigenous Dispossession").</p>

            <h3>Selected Literature</h3>
            <ul>
                <li>Dick, Everett. <cite>The Lure of the Land: A Social History of the Public Lands from the Articles of Confederation to the New Deal</cite>. Lincoln, NE: University of Nebraska Press, 1970, pp. 138-159.</li>
                <li>Eckstrom, Mikal Brotnov, and Richard Edwards. “Staking Their Claim: DeWitty and Black Homesteaders in Nebraska.” <cite>Great Plains Quarterly</cite> 38, no. 3 (2018): 295–317.</li>
                <li>Edwards, Richard. “To Commute or Not Commute, the Homesteader’s Dilemma”. <cite>Great Plains Quarterly</cite> 38, No. 2 (2018): 129–50. </li>
                <li>Edwards, Richard, Jacob K. Friefeld, und Rebecca S. Wingo. <cite>Homesteading the Plains: Toward a New History</cite>. Lincoln, NE: University of Nebraska Press, 2017.</li>
                <li>Edwards, Richard, Jacob K. Friefeld, und Mikal Brotnov Eckstrom. “‘Canaan on the Prairie’: New Evidence on the Number of African American Homesteaders in the Great Plains”. <cite>Great Plains Quarterly</cite> 39, No. 3 (2019): 223–41.</li>
                <li>Friefeld, Jacob K., Mikal Brotnov Eckstrom, und Richard Edwards. “African American Homesteader “Colonies” in the Settling of the Great Plains”. <cite>Great Plains Quarterly</cite> 39, No. 1 (2019): 11–37.</li>
                <li>Gates, Paul W. <cite>History of Public Land Law Development</cite>. Washington DC: US Government Printing Office, 1968, pp. 387-462.</li>
                <li>Gates, Paul W. “The Homestead Law in an Incongruous Land System”. <cite>American Historical Review</cite> 41, No. 4 (1936): 652–81.</li>
                <li>Gregg, Sara M. “Imagining Opportunity: The 1909 Enlarged Homestead Act and the Promise of the Public Domain”. <cite>Western Historical Quarterly</cite> 50, No. 3 (2019): 257–79.</li>
                <li>Gregg, Sara M. “American Land Rush: “A Lonely Homesteader” Searches for Security in the Montana Homestead Boom”. Environment & Society Portal, December 15, 2020. http://www.environmentandsociety.org/exhibitions/american-land-rush.</li>
                <li>Landon, George Cooke. “The Homestead Act: Attitudes and Reactions”. PhD dissertation, George Washington University, 1964.</li>
                <li>Okada, Yasuo. Public Lands and Pioneer Farmers: Gage County, Nebraska, 1850-1900. New York: Arno Press, 1978.</li>
            </ul>


        </React.Fragment >
    ),
    dispossession: (
        <React.Fragment>
            <h3>Homesteading and Indigenous Dispossession</h3>

            <p>Did homestead settlers benefit from Indigenous land dispossession? To what extent did they cause it? One can examine these multifaceted questions at more general as well as concrete levels.</p>
            <p>On a general level, it is evident that the Homestead Act’s offer of free land was only possible because the U.S. government had through coerced treaties, threats, and force evicted Indigenous nations from their ancestral homelands. The “public land” offered for distribution were only available because Indigenous nations had been removed to small reservations. When Congress passed the Homestead Act in May 1862, most of the area where homesteaders in the following decades would claim land was still “Indian Country,” even according to the U.S. government’s legal understanding. The fact that these lands became accessible to settlers was a clear result of the expulsion of the previous Indigenous inhabitants.</p>
            <IndianCountryMap />
            <p>However, this general statement has little to say about the extent to which homesteaders not only benefitted from but also drove the expulsion itself. In addition to claimants under the Homestead Act, many other groups, ranging from miners and cattle ranchers to railroad companies and land speculators, sought to exploit the resources and lands previously taken from Indigenous nations. Homesteaders are difficult to isolate as a specific group in this coalition of white interests. In addition, the chronological overlap between homesteading and Indigenous removal in the Great Plains and the Mountain States is, by itself, no more than a fundamental, broad linkage. The period between the removal of the Indigenous nations from their lands and the onset of homestead booms was sometimes not just years but decades. </p>
            <p>However, our map also documents a more direct overlap of dispossession and homestead settlements in the 1860s and 1870s. The embedded event data on frontier clashes (which is far from complete) shows that homesteaders advanced into regions that were still contested, for example, in Nebraska and Kansas. This should have been impossible if one goes by the letter of the Homestead Act because the law stipulated that settlers could only register claims to land for which the U.S. government had previously settled all Indigenous claims. How did it come about that there was still fighting with the Cheyenne and Arapaho in the homesteading regions in Nebraska and Kansas? Under the October 1867 Medicine Lodge Treaty, Cheyenne and Arapaho leaders signed an agreement that—according to the verbal assurances of the government’s principal spokesperson, Missouri senator John B. Henderson—would allow them to continue hunting between the Arkansas and South Platte rivers. However, the treaty forwarded to Washington by the commission led by Henderson had no such provision and instead implemented the Indigenous nations’ removal to a reservation. As a result of Henderson’s trickery, western Nebraska and Kansas were declared “public land,” therefore becoming open to homesteaders. The Cheyenne and Arapaho still considered these lands their unceded homelands—which they sought to defend by force against incoming land claimants.</p>
            <p>The case of the Cheyenne and Arapahoe may be a special one that sticks out as a particularly egregious case of fraud that led to some of the bloodiest clashes between Indigenous people and incoming homesteaders. But Henderson’s deceitful negotiation tactics highlight a general feature of the land cessions that preceded the opening of regions to homesteaders: these were not consensual agreements but extorted treaties, often obtained under false conditions. From 1871 onward, the U.S. government even relied entirely on executive orders issued by the president on a unilateral basis. Because of this self-serving practice that effectively brushed aside Indigenous claims to ownership, lands were declared “public” and open for settlement even though Indigenous nations were unwilling to give up their lands and were quite capable of resisting white encroachments. Numerous clashes in the homesteading regions of the 1860s and 1870s indicate this on our map.</p>
            <p>At the same time, the map shows that from the 1860s to 1880s, many clashes between Indigenous people and the U.S. Army or U.S. civilians took place far from the central homesteading regions, especially in the Southwest and the Far West. Therefore, it would be hard to present an argument in the style of new economic history that frontier violence in all of the West was entirely a function of homesteaders moving into a region. The army’s expansive operations and civilian frontier pursuits other than homesteading were more critical in these regions. That being said, our map documents an overlap between homesteading and ongoing frontier fights in some areas throughout the 1860s and 1870s. It was not an invention of popular culture that homestead farm-builders and Indigenous peoples clashed directly over control of the land.</p>
            <p>In addition to these violent clashes of the first decades, beginning in fiscal year 1890, our map documents another direct link between homesteading and Indigenous dispossession. In 1889, the U.S. government opened to homesteaders the Great Sioux Reservation, which extended across the Dakotas, the Ponca Reservation in Nebraska, and the first reservations in the western Indian Territory (now Oklahoma). These were reservations that, according to the original treaties, were supposed to belong to Indigenous nations permanently. In the western Indian Territory, one nation after another was forced to surrender their reservation, after which the areas were opened to settlers as “public land.” </p>
            <p>On the Great Sioux Reservation and the smaller Ponca Reservation in Nebraska, the U.S. government introduced a novel legal instrument: the “homesteads on Indian land.” Instead of forcing Indigenous nations to cede their title, the government assumed the role of a trustee for these nations’ lands. Officially for the nations’ benefit, lands were then opened to homesteaders who had to pay an extra, albeit generally low, purchase price per acre. The U.S. government administered the resulting proceeds in trust for the affected Indigenous nations. As a legal construct, this practice was different from the previous way of opening “Indian land” to U.S. citizens. In practice, however, these privatization policies were frequently put in place under tremendous pressure from the government. And representatives from affected nations pointed out that the arrangement hardly allowed them to profit from land sales proceeds.</p>
            <p>[Insert map: Homesteads on Indian Land]</p>
            <p>Both the Great Sioux Reservation and the western parts of the Indian Territory were opened to homestead settlers. “Regular” land sales to purchasers who would not reside on the purchased land were not initially allowed in these areas. This means that the opening and sale of these reservation lands were organized to benefit homesteaders specifically.</p>
            <p>Beginning in the 1890s, the “homesteads on Indian land” contributed significantly to numerous nations' massive communal land losses. Under the 1887 Allotment Act (also known as the Dawes Act), private parcels were carved out from communal reservation lands for tribal members. The remaining parts of reservations were opened to homesteaders as “surplus land.” In exchange for the payment of fees, which the U.S. government took in trust, homesteaders pushed into the last remaining refuges of Indigenous nations.</p>
            <p>In most published statistics, the “homesteads on Indian land” are included in the total of all homesteads. Our map shows the extent of this practice and its specific location. The relationship between the predominantly white settlers who moved onto reservations and the remaining Indigenous nations may have been less openly violent and antagonistic than the Indigenous-homesteader confrontations from the 1860s to 1870s. However, what is clear is that, over the years, homesteading on reservations severely eroded the communal land base of the affected nations. By the time the 1934 Indian Reorganization Act ended this practice, the remaining tribal land base had been radically reduced. In some places, the legal status of reservations as separate Indigenous polities also came into question after reservations in whole or in part had become settled by non-Indigenous majorities.</p>

            <h3>Selected Literature</h3>
            <ul>
                <li>Campbell, Susan D. “Reservations: The Surplus Lands Acts and the Question of Reservation Disestablishment”. <cite>American Indian Law Review</cite> 12, No. 1 (1984): 57–99.</li>
                <li>Edwards, Richard, Jacob K. Friefeld, und Rebecca S. Wingo. <cite>Homesteading the Plains: Toward a New History</cite>.</li>
                <li>Frymer, Paul. B<cite>uilding an American Empire: The Era of Territorial and Political Expansion</cite>. Princeton, NJ: Princeton University Press, 2017.</li>
                <li>Hansen, Karen, and Mignon Duffy. “Mapping the Dispossession: Scandinavian Homesteading at Fort Totten, 1900-1930”. Great Plains Research: A Journal of Natural and Social Sciences 18, No. 1 (2008): 67–80.</li>
                <li>Hansen, Karen V. <cite>Encounter on the Great Plains: Scandinavian Settlers and the Dispossession of Dakota Indians</cite>, 1890-1930. New York: Oxford University Press, 2013.</li>
                <li>Monnett, John H. “Reimagining Transitional Kansas Landscapes: Environment and Violence”. <cite>Kansas History</cite> 34, No. 4 (Winter 2011): 258–79.</li>
                <li>Wilm, Julius. “‘The Indians must yield’: Antebellum Free Land, the Homestead Act, and the Displacement of Native Peoples”. <cite>Bulletin of the German Historical Institute</cite>, No. 67 (Fall 2020): 17–39.</li>
            </ul>
        </React.Fragment>
    ),

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
