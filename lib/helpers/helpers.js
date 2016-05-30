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

export function returnOrErr (err, response) {
  if (err) throw err;
  console.log(response);
  return response;
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
export function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
