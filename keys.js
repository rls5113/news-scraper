console.log("keys.js loaded");

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};
exports.omdb = {
    id: process.env.OMDB_ID,
    secret: process.env.OMDB_SECRET
};
exports.bands = {
    id: process.env.BANDS_ID,
    secret: process.env.BANDS_SECRET
};



// module.exports = {
//     spotify: spotify
//     // niceToHaves: niceToHaves
//   };