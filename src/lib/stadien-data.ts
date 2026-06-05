export interface Stadion {
  id: string
  name: string
  stadt: string
  land: 'USA' | 'Kanada' | 'Mexiko'
  kapazitaet: number
  koordinaten: { lat: number; lng: number }
  spiele: number
  bild: string
  eroeffnet: number
}

export const WM_STADIEN: Stadion[] = [
  { id: 'metlife', name: 'MetLife Stadium', stadt: 'East Rutherford, NJ', land: 'USA', kapazitaet: 82500, koordinaten: { lat: 40.8135, lng: -74.0745 }, spiele: 8, bild: '', eroeffnet: 2010 },
  { id: 'sofi', name: 'SoFi Stadium', stadt: 'Inglewood, CA', land: 'USA', kapazitaet: 70240, koordinaten: { lat: 33.9535, lng: -118.3392 }, spiele: 8, bild: '', eroeffnet: 2020 },
  { id: 'att', name: 'AT&T Stadium', stadt: 'Arlington, TX', land: 'USA', kapazitaet: 80000, koordinaten: { lat: 32.7473, lng: -97.0945 }, spiele: 8, bild: '', eroeffnet: 2009 },
  { id: 'mercedes', name: 'Mercedes-Benz Stadium', stadt: 'Atlanta, GA', land: 'USA', kapazitaet: 71000, koordinaten: { lat: 33.7554, lng: -84.4009 }, spiele: 7, bild: '', eroeffnet: 2017 },
  { id: 'levis', name: "Levi's Stadium", stadt: 'Santa Clara, CA', land: 'USA', kapazitaet: 68500, koordinaten: { lat: 37.4033, lng: -121.9694 }, spiele: 7, bild: '', eroeffnet: 2014 },
  { id: 'arrowhead', name: 'GEHA Field at Arrowhead Stadium', stadt: 'Kansas City, MO', land: 'USA', kapazitaet: 76416, koordinaten: { lat: 39.0489, lng: -94.4839 }, spiele: 6, bild: '', eroeffnet: 1972 },
  { id: 'gillette', name: 'Gillette Stadium', stadt: 'Foxborough, MA', land: 'USA', kapazitaet: 65878, koordinaten: { lat: 42.0909, lng: -71.2643 }, spiele: 6, bild: '', eroeffnet: 2002 },
  { id: 'lincoln', name: 'Lincoln Financial Field', stadt: 'Philadelphia, PA', land: 'USA', kapazitaet: 69176, koordinaten: { lat: 39.9008, lng: -75.1675 }, spiele: 6, bild: '', eroeffnet: 2003 },
  { id: 'empower', name: 'Empower Field at Mile High', stadt: 'Denver, CO', land: 'USA', kapazitaet: 76125, koordinaten: { lat: 39.7439, lng: -105.0200 }, spiele: 5, bild: '', eroeffnet: 2001 },
  { id: 'hardrock', name: 'Hard Rock Stadium', stadt: 'Miami Gardens, FL', land: 'USA', kapazitaet: 64767, koordinaten: { lat: 25.9580, lng: -80.2389 }, spiele: 7, bild: '', eroeffnet: 1987 },
  { id: 'lumen', name: 'Lumen Field', stadt: 'Seattle, WA', land: 'USA', kapazitaet: 68740, koordinaten: { lat: 47.5952, lng: -122.3316 }, spiele: 6, bild: '', eroeffnet: 2002 },
  { id: 'azteca', name: 'Estadio Azteca', stadt: 'Mexiko-Stadt', land: 'Mexiko', kapazitaet: 87523, koordinaten: { lat: 19.3029, lng: -99.1505 }, spiele: 7, bild: '', eroeffnet: 1966 },
  { id: 'guadalajara', name: 'Estadio Akron', stadt: 'Guadalajara', land: 'Mexiko', kapazitaet: 49850, koordinaten: { lat: 20.6810, lng: -103.4619 }, spiele: 6, bild: '', eroeffnet: 2010 },
  { id: 'monterrey', name: 'Estadio BBVA', stadt: 'Monterrey', land: 'Mexiko', kapazitaet: 53500, koordinaten: { lat: 25.6699, lng: -100.2444 }, spiele: 6, bild: '', eroeffnet: 2015 },
  { id: 'bmo', name: 'BMO Field', stadt: 'Toronto', land: 'Kanada', kapazitaet: 45736, koordinaten: { lat: 43.6332, lng: -79.4186 }, spiele: 6, bild: '', eroeffnet: 2007 },
  { id: 'bcplace', name: 'BC Place', stadt: 'Vancouver', land: 'Kanada', kapazitaet: 54500, koordinaten: { lat: 49.2768, lng: -123.1119 }, spiele: 7, bild: '', eroeffnet: 1983 },
]
