/* eslint-disable no-console */
const jwt = require('jsonwebtoken');

const YOUR_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFiOThkNzA3N2I1MDI5ZGQ1MDA1OWUiLCJpYXQiOjE2NjI5MTA3OTksImV4cCI6MTY2MzUxNTU5OX0.eNIclpLI7R-Kcmetoo1eGHhJx18k9YhWZdxvcovNFe8'; // вставьте сюда JWT, который вернул публичный сервер
const SECRET_KEY_DEV = 'some-secret-key'; // вставьте сюда секретный ключ для разработки из кода
try {
  const payload = jwt.verify(YOUR_JWT, SECRET_KEY_DEV);
  console.log(payload);
  console.log('\x1b[31m%s\x1b[0m', `
Надо исправить. В продакшене используется тот же
секретный ключ, что и в режиме разработки.
`);
} catch (err) {
  if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Всё в порядке. Секретные ключи отличаются',
    );
  } else {
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Что-то не так',
      err,
    );
  }
}
