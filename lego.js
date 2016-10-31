'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var roster = [];
var selection;
var formatFunctions = [];
var limit;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    roster = collection;
    selection = Object.keys(roster[0]);
    var params = [].slice.call(arguments);
    params.splice(0, 1);

    params.forEach(function (opperator) {
        opperator.call(roster);
    });

    if (limit && !limit.isNaN) {
        roster.splice(limit);
        limit = undefined;
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

    return result;
};


/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var args = [].slice.call(arguments);

    return function () {
        args = args.filter(function (property) {
            return selection.indexOf(property) !== -1;
        });

        if (args.length) {
            selection = selection.filter(function (property) {
                return args.indexOf(property) !== -1;
            });
        }
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

    return function () {
        roster = roster.filter(function (person) {
            return values.indexOf(person[property]) !== -1;
        });
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

    return function () {
        roster = roster.sort(function (a, b) {
            a = a[property];
            b = b[property];
            if (a === b) {
                return 0;
            }

            return a < b ? - dir[order] : dir[order];
        });
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
    };
};


if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.or = function () {
        var functions = [].slice.call(arguments);

        return function () {
            var backup = roster;
            var result = [];
            functions.forEach(function (action) {
                action.call();
                result = result.concat(roster);
                roster = backup;
            });

            roster = result;
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Function}
     */
    exports.and = function () {
        var functions = [].slice.call(arguments);

        return function () {
            functions.forEach(function (action) {
                action.call();
            });
        };
    };
}
