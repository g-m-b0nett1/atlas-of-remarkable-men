# Atlas of Remarkable Men

A reader's companion to G. I. Gurdjieff's *Meetings with Remarkable Men*: an
interactive map of the places and journeys in the book, a web of its remarkable
men, a timeline of its dates, a glossary, and a long essay on the book in two
parts.

I started it because I wanted a map and a glossary while reading the Adelphi
edition, *Incontri con uomini straordinari*, and kept going. Names, spellings
and page numbers follow the English edition (Routledge & Kegan Paul, 1963);
the Italian is mentioned where the two disagree.

Spoilers: the page tells the book's episodes in full.

## Viewing

Open `index.html` in a browser. Nothing needs installing; D3 and the font
are loaded from CDNs, so you need to be online.

## Files

- `index.html`: all the prose (introduction, essays, glossary, characters,
  references) and the styles
- `app.js`: the map (drawing, zoom, routes, chapter filter, search)
- `app2.js`: the timeline and the web of remarkable men
- `data/places.js`: place descriptions, coordinates and journeys
- `data/extras.js`: page numbers, evidence ratings and period photographs
- `data/geo.js`, `data/borders-1900.js`, `data/relief.js`: map geometry and
  shaded relief, each on one very long line

## Single-file version

```
python3 build.py
```

writes `atlas-of-remarkable-men.html`, with every local script inlined, so the
page can be sent or hosted as one file.

## Sources and credits

Coastlines, rivers, lakes and shaded relief: [Natural Earth](https://www.naturalearthdata.com/)
(public domain). Borders about 1900: André Ourednik,
[historical-basemaps](https://github.com/aourednik/historical-basemaps) (GPL-3.0).
Period photographs: Wikimedia Commons, public domain, mostly from the
Prokudin-Gorsky collection at the Library of Congress; credits are given with
each image. Map and charts drawn with [D3](https://d3js.org/). Everything else
the page draws on is listed in its References section.

## Licence

The code (`app.js`, `app2.js`, `build.py`, the markup and styles, and the map
data in `data/`) is released under the GNU General Public License v3.0; see
`LICENSE`.

The text (the prose in `index.html` and the descriptions in `data/places.js`
and `data/extras.js`) is © Giulio Bonetti, released under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/); see
`LICENSE-TEXT.md`.

Quotations from *Meetings with Remarkable Men* and other works remain the
property of their rights-holders.
