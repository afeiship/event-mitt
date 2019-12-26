# context
```js
// now
this.eventInitRes = esbi.$app.on('esbi-layout-grid:init', () => {
  this.init();
});

// optmize
this.eventInitRes = esbi.$app.on('esbi-layout-grid:init', this.init, this);
```
