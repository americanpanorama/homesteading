const Data = require('../../data-input/townships_data.json');

console.log(Data.filter((e, i) => Data.findIndex(a => a.of_id === e.of_id) === i).length);

console.log(Data.length);
