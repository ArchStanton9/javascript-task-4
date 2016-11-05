'use strict';

/**
 * —делано задание на звездочку
 * –еализованы методы or и and
 */
exports.isStar = true;

var selection;
var formatFunctions = [];
var limit;

function getCopy(item) {
    var result = [];
    item.forEach(function (person) {
        var clone = {};
        Object.keys(person).forEach(function (key) {
            clone[key] = person[key];
        });
        result.push(clone);
    });

    return result;
}

/**
 * «апрос к коллекции
 * @param {Array} collection
 * @params {...Function} Ц ‘ункции дл¤ запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var roster;
    roster = getCopy(collection);
    selection = Object.keys(roster[0]);
    var params = [].slice.call(arguments);
    params.splice(0, 1);
    params.forEach(function (opperator) {
        roster = opperator(roster);
    });

    if (limit && !limit.isNaN && limit > 0) {
        roster.splice(limit);

    }

    var result = [];
    roster.forEach(function (person) {
        var newPerson = {};

        selection.forEach(function (property) {
            newPerson[property] = person[property];
        });

        formatFunctions.forEach(function (item) {
            if (selection.indexOf(item.property) !== -1) {
                newPerson[item.property] = item.formater(newPerson[item.property]);
            }
        });

        result.push(newPerson);
    });
    formatFunctions = [];
    limit = undefined;

    return result;
};


/**
 * ¬ыбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var args = [].slice.call(arguments);

    return function (list) {
        args = args.filter(function (property) {
            return selection.indexOf(property) !== -1;
        });

        if (args.length) {
            selection = selection.filter(function (property) {
                return args.indexOf(property) !== -1;
            });
        }


        return list;
    };
};


/**
 * ‘ильтраци¤ пол¤ по массиву значений
 * @param {String} property Ц —войство дл¤ фильтрации
 * @param {Array} values Ц ƒоступные значени¤
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    values = [].concat(values);

    return function (list) {
        list = list.filter(function (person) {
            return values.indexOf(person[property]) !== -1;
        });

        return list;
    };
};

/**
 * —ортировка коллекции по полю
 * @param {String} property Ц —войство дл¤ фильтрации
 * @param {String} order Ц ѕор¤док сортировки (asc - по возрастанию; desc Ц по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    var dir = {
        asc: 1,
        desc: -1
    };

    return function (list) {
        list = list.sort(function (a, b) {

            a = a[property];
            b = b[property];
            if (a === b) {
                return 0;
            }

            return a < b ? - dir[order] : dir[order];
        });

        return list;
    };
};

/**
 * ‘орматирование пол¤
 * @param {String} property Ц —войство дл¤ фильтрации
 * @param {Function} formatter Ц ‘ункци¤ дл¤ форматировани¤
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    return function (list) {
        formatFunctions.push(
            { property: property, formater: formatter }


        );

        return list;
    };
};


/**
 * ќграничение количества элементов в коллекции
 * @param {Number} count Ц ћаксимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {


    return function (list) {
        limit = limit < count ? limit : count;

        return list;
    };
};


if (exports.isStar) {

    /**
     * ‘ильтраци¤, объедин¤юща¤ фильтрующие функции
     * @star
     * @params {...Function} Ц ‘ильтрующие функции
     * @returns {Function}
     */
    exports.or = function () {
        var functions = [].slice.call(arguments);

        return function (list) {
            var result = [];

            var listCopy = getCopy(list);
            functions.forEach(function (action) {
                result = result.concat(action(listCopy));
            });

            return result;
        };
    };

    /**
     * ‘ильтраци¤, пересекающа¤ фильтрующие функции
     * @star
     * @params {...Function} Ц ‘ильтрующие функции
     * @returns {Function}
     */
    exports.and = function () {
        var functions = [].slice.call(arguments);

        return function (list) {
            var result = getCopy(list);
            functions.forEach(function (action) {
                result = action(result);
            });

            return result;
        };
    };
}
