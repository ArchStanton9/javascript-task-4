'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

function getCopy(item) {
    var result = [];
    item.forEach(function (person) {
        var personCopy = {};
        Object.keys(person).forEach(function (key) {
            personCopy[key] = person[key];
        });
        result.push(personCopy);
    });

    return result;
}

var PRIORITY = ['limit', 'format', 'select'];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var roster = getCopy(collection);
    var params = [].slice.call(arguments);
    params.splice(0, 1);

    params.sort(function (a, b) {
        return PRIORITY.indexOf(a.name) - PRIORITY.indexOf(b.name);
    });

    params.forEach(function (opperator) {
        roster = opperator(roster);
    });

    return roster;
};


/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var selectors = [].slice.call(arguments);

    return function select(roster) {
        return roster.map(function (person) {
            var newPerson = {};

            selectors.forEach(function (selector) {
                if (Object.keys(person).indexOf(selector) !== -1) {
                    newPerson[selector] = person[selector];
                }
            });

            return newPerson;
        });
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

    return function filterIn(roster) {
        return roster.filter(function (person) {
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

    return function sortBy(roster) {
        return roster.sort(function (a, b) {
            return (dir[order]) * (a[property] - b[property]);
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
    return function format(roster) {
        return roster.map(function (person) {
            if (Object.keys(person).indexOf(property) !== -1) {
                person[property] = formatter(person[property]);
            }

            return person;
        });
    };
};


/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    count = count > 0 ? count : 0;

    return function limit(roster) {
        return roster.slice(0, count);
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

        return function or(roster) {
            var result = [];
            var rosterCopy = getCopy(roster);
            functions.forEach(function (filter) {
                result = result.concat(filter(rosterCopy));
            });

            return result;
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

        return function and(roster) {
            var result = getCopy(roster);
            functions.forEach(function (filter) {
                result = filter(result);
            });

            return result;
        };
    };
}
