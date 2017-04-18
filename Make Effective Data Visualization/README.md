##Summary-
This interactive data visualization shows mean delay times per flight for airports across
the US. The data is from the 10-year period between June 2006 and April 2016 and represents
airports with at least three commercial flights per day. The main takeaway from he data is
that total delays and especially carrier, weather, and late aircraft delays are 
higher in the East and Midwest than in the West. 


##Design-

###Original Design: 

The mean delay times are represented as circles on a map. This is useful because it not only
allows the user to find where individual airports stand but also regional trends in the 
data.
The visualization can be adjusted to show different types of delay. As the data separates 
delays into five categories, I thought it would be interesting to see how delays in these
categories differ.
The circles are colored from yellow to blue and sized from 1-15 px radius (double encoding).
Size was used because it apart from positional encoding (which is impossible on a map) it 
is conveys data fairly accurately. I used color because size did not fully show the 
differences that became more apparent when color was used. 
The scale of the circles (Area, Square, or Cube) can be adjusted to show further contrast.

###Updated Design:

- added a key mapping bubble color and size to values
- scale buttons taken out, as they weren't very helpful.
- added the source of the data on the bottom
- when a bubble is selected and the user selects another delay type, the delay type shown
in the info box is also updated. 
- moved the location of the info bar
- changed the colors: low delays to yellow and high delays to red. Red more effectively 
implies negativity at airports with high delays.

##Feedback-
Source 1- 
- changing the scales when different types of delay are chosen is misleading
- circle color unclear
- scale was not useful
Source 2- 
- add a legend
Source 3- 
- when a new type of delay is selected the minutes in the info box should also change. 
Source 2 and 3 - 
- a source for the data would be useful

##Resources-

Data - http://www.transtats.bts.gov/OT_Delay/OT_DelayCause1.asp
Map - 500k US States GeoJSON from http://eric.clst.org/Stuff/USGeoJSON
Understanding what the types of delay were - http://aspmhelp.faa.gov/index.php/Types_of_Delay#NAS_Delay
d3 documentation

###Stack Overflow-
https://stackoverflow.com/questions/15417340/how-to-get-data-of-parent-node-in-d3-js
https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
https://stackoverflow.com/questions/16057485/d3-js-get-an-array-of-the-data-attached-to-a-selection