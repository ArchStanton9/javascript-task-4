'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var DIR = {
    asc: 1,
    desc: -1
};

var PRIORITY = [
    'limit',
    'format',
    'select'
];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var roster = JSON.parse(JSON.stringify(collection));
    var selectors = [].slice.call(arguments, 1);

    selectors.sort(function (a, b) {
        return PRIORITY.indexOf(a.name) - PRIORITY.indexOf(b.name);
    });

    selectors.forEach(function (selector) {
        roster = selector(roster);
    });

    return roster;
};


/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var args = [].slice.call(arguments);

    return function select(roster) {
        return roster.map(function (person) {
            Object.keys(person).forEach(function (key) {
                if (args.indexOf(key) === -1) {
                    delete person[key];
                }
            });


            return person;
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
    return function sortBy(roster) {
        return roster.sort(function (a, b) {
            if (a[property] === b[property]) {
                return 0;
            }

            return a[property] < b[property] ? -DIR[order] : DIR[order];
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
            person[property] = formatter(person[property]);

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
    return function limit(roster) {
        return roster.slice(0, count);
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
