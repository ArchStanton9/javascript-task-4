'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

function getCopy(item) {
    console.info('getCoppy()');
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
    var selection = {
        roster: getCopy(collection),
        properties: Object.keys(collection[0]),
        limit: undefined,
        formatter: [],
        getResult: function () {
            var result = [];

            if (this.limit && this.limit > 0) {
                console.info('limitation');
                this.roster.splice(this.limit);
            }

            this.roster.forEach(function (person) {
                var newPerson = {};

                console.info('creating selection');
                selection.properties.forEach(function (property) {
                    newPerson[property] = person[property];
                });

                this.formatter.forEach(function (item) {
                    console.info('formating');
                    if (selection.properties.indexOf(item.property) !== -1) {
                        newPerson[item.property] = item.formatter(newPerson[item.property]);
                    }
                });

                result.push(newPerson);
            }, this);

            return result;
        }
    };

    var params = [].slice.call(arguments);
    params.splice(0, 1);

    params.forEach(function (opperator) {
        opperator(selection);
    });

    return selection.getResult();
};


/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var args = [].slice.call(arguments);
    console.info('select(export)');

    return function (selection) {
        console.info('select');
        args = args.filter(function (property) {
            return selection.properties.indexOf(property) !== -1;
        });

        if (args.length) {
            selection.properties = selection.properties.filter(function (property) {
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
    console.info('filterIn(export)');

    return function (selection) {
        console.info('filterIn');

        selection.roster = selection.roster.filter(function (person) {
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
    console.info('sortBy(export)');

    return function (selection) {
        console.info('sortBy');

        return selection.roster.sort(function (a, b) {
            return dir[order] * (a[property] - b[property]);
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
    console.info('format(export)');

    return function (selection) {
        console.info('format');
        selection.formatter.push(
            { property: property, formatter: formatter }
        );
    };
};


/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    console.info('limit(export)');

    return function (selection) {
        console.info('limit');
        if (!selection.limit || selection.limit > count) {
            selection.limit = count;
        }
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
