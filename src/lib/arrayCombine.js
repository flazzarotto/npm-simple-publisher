/**
 * Combines two arrays (same length) to give an object
 * @param keys
 * @param values
 * @returns {*}
 */
export function arrayCombine(keys, values) {
    return keys.reduce(function(obj, key, index) {
        obj[key] = values[index]
        return obj
    }, {})
}

export function map(object, callback) {
    return arrayCombine(Object.keys(object), Object.values(object).map(callback))
}
