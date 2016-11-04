'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITY_FUNCTION = ['format', 'limit', 'select', 'filterIn', 'sortBy'];

function compareForFunction(a, b) {
    if (PRIORITY_FUNCTION.indexOf(a.name) > PRIORITY_FUNCTION.indexOf(b.name)) {
        return -1;
    }
    if (PRIORITY_FUNCTION.indexOf(a.name) < PRIORITY_FUNCTION.indexOf(b.name)) {
        return 1;
    }

    return 0;
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

exports.query = function (collection) {
    var functions = [].slice.call(arguments, 1).sort(compareForFunction);
    var copyCollection = copyObject(collection);
    var newCollection = functions.reduce(function (copyCollection, func) {
        return func(copyCollection);
    }, copyCollection);

    return newCollection;
};

exports.select = function () {
    var requiredFields = [].slice.call(arguments);

    return function select(collection) {
        var newCollection = collection.map(function (element) {
            return requiredFields.reduce(function (chosen, field) {
                if (field in element) {
                    chosen[field] = element[field];
                }

                return chosen;
            }, {});
        });

        return newCollection;
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
        order = order === 'asc' ? 1 : -1;
        var newCollection = collection.slice().sort(function (first, second) {

            return (first[property] < second[property] ? -1 : 1) * order;
        });

        return newCollection;
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (element) {
            var newElement = copyElement(element);
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
