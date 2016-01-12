# sails-hook-sidecar

For Boxfish Web Project

make sure you have the consul section in the config

```js
module.exports.consul = {
  host: '<host>',
  port: <port>
};
```

- This hook will register itself with consul using the name in the package.json, and
unregister on sails lower.

- Tries to find ad-box router in consul

- Creates some default routes
  - route 1
  - route 2
