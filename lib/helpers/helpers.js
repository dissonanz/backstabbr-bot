export function flatten(arr) {
  return arr.reduce(function(a,b) {
    return a.concat(b);
  })
};

export async function dbToObjects (res) {
  var out = await res.records.map( function (record) {
    return record._fields.map( function (node) {
      return node.properties;
    })
  });
  return flatten(out);
};