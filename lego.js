'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var roster;
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
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
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
 * Выбор полей
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
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
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
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
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
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    return function () {
        formatFunctions.push(
            { property: property, formater: formatter }
        );

        return roster;
    };
};


/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {

    return function () {
        limit = limit < count ? limit : count;

        return roster;
    };
};


if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {undefined}
     */
    exports.or = function () {
        return function () {

            return;
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {undefined}
     */
    exports.and = function () {

        return;
    };
}
