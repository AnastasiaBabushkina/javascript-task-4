'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITY_FUNCTION = ['limit','format', 'select','filterIn','sortBy',];

function compareForFunction(a,b) {
    if (PRIORITY_FUNCTION.indexOf(a.name) > PRIORITY_FUNCTION.indexOf(b.name))
        return -1;
    if (PRIORITY_FUNCTION.indexOf(a.name) < PRIORITY_FUNCTION.indexOf(b.name))
        return 1;
    return 0
}

function copyObject(obj) {
    obj.map(function (element) {
        return Object.assign({}, element);
    });

    return obj;
}

function copyElement(element) {
    return Object.assign({}, element);
}

function getRequiredFields(requiredFields, collection) {
    let newCollection = collection.slice().map(function (element) {
        return requiredFields.reduce(function (chosen, field) {
            if (field in element) {
                chosen[field] = element[field];
            }

            return chosen;
        }, {});
    });

    return newCollection;
}

exports.query = function (collection) {
    let functions = [].slice.call(arguments, 1).sort(compareForFunction);
    let copyCollection = copyObject(collection);
    for (let index = 0; index < functions.length; index++) {
        copyCollection = functions[index](copyCollection);
    }
    
    return copyCollection;
};

exports.select = function () {
    let requiredFields = [].slice.call(arguments);

    return function select(collection) {
        return collection.slice().map(function (element) {
            return requiredFields.reduce(function (chosen, field) {
                if (field in element) {
                    chosen[field] = element[field];
                }

                return chosen;
            }, {});
        });
    };
};

exports.filterIn = function (property, values) {
   return function filterIn(collection) {
        return collection.slice().filter(function (element) {
            return values.indexOf(element[property]) !== -1;
        });
    };
};

exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        let newCollection =  collection.slice().sort(function (first, second) {

            return first[property] <= second[property] ? -1 : 1;
        });

        return order === 'asc' ? newCollection : newCollection.reverse();
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (element) {
            let newElement = copyElement(element);
            if (property in newElement) {
                newElement[property] = formatter(newElement[property]);
            }

            return newElement;
        });
    };
};

exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {
    exports.or = function () {
        return;
    };
    exports.and = function () {
        return;
    };
}
