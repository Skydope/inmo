/**
 * Bespoke styling for Google Maps Platform matching Inmo's brand design language.
 *
 * Keeps POIs (Points of Interest and Businesses) explicitly VISIBLE so users
 * can explore nearby commerce, gastronomy, transport, and schools, while maintaining
 * the calm, editorial warm palette of the app.
 */

export const GOOGLE_MAPS_LIGHT_STYLE: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f4f0e8" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#595246" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f4f0e8" }, { weight: 3 }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d8cfbf" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#998e7e" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#ede7dc" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#ece6db" }],
  },
  {
    // Parks and green areas
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#dfe7d8" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5a6b52" }],
  },
  // Ensure local businesses, cafes, shops are visible with clear contrast
  {
    featureType: "poi.business",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.school",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  // Clean roads
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e3dbce" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#eae1d3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d8cfbf" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#776e60" }],
  },
  // Transit
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#ded6c7" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#ded6c7" }],
  },
  // Water
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cadbe6" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6d8699" }],
  },
]

export const GOOGLE_MAPS_DARK_STYLE: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#191817" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#b3aba0" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#191817" }, { weight: 3 }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#dfd6c8" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#201f1d" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#1e1d1b" }],
  },
  // Parks
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#182417" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#688465" }],
  },
  // Businesses explicitly visible in dark mode
  {
    featureType: "poi.business",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.attraction",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.medical",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.school",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  // Roads
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2b2926" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#211f1d" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#312e2a" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3d3933" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#282521" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8175" }],
  },
  // Water
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#131c26" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#48627d" }],
  },
]
