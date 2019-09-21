# shri_2019_polyfill
Задание: Напишите полифил для промиса.

В тестовом файле [promise-test](./test/promise-test.js) можно увидеть примеры использования.

## Что можно улучшить
1. Написать больше тестов =)
2. Асинхронность достигается при помощи setTimeout().
 Более лучшим решеним было бы использовать `setImmidiate()` в среде node js или `new MutationObserver` в на клиенте.
3. Реализовать методы `Promise.all\race`



##Запуск тестов
`npm run test`

## Доступны следующие методы:
1. `new Promisepolyfill(() => {}).then`
2. `new Promisepolyfill(() => {}).catch`
3. `Promisepolyfill.resolve`
4. `Promisepolyfill.reject`
5. `Promisepolyfill.catch`


### Источники "вдохновения":

1. [brunoscopelliti](https://brunoscopelliti.com/lets-write-a-promise-polyfill)
2. [https://abdulapopoola.com](https://abdulapopoola.com/2015/02/23/how-to-write-a-promisea-compatible-library)
3. https://promisesaplus.com/