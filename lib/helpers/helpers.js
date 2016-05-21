export async function flatten(arr) {
  try {
    return arr.reduce(function(a,b) {
      return a.concat(b);
    })
  } catch (err) {
    if (err instanceof TypeError) {
      return arr;
    } else {
      console.log(err);
    }
  }
};

export async function dbToObjects(res) {
  var out = await res.records.map( function (record) {
    return record._fields.map( function (node) {
      return node.properties;
    })
  });
  return flatten(out);
};