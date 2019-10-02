# ng-defer-bootstrap

`ng-defer-bootstrap` is a small package that extends the functionality of [deferring the angularjs boostrap process](https://docs.angularjs.org/guide/bootstrap#deferred-bootstrap).

## How to use
Include the `dist/ng-defer-bootstrap.js` as a script tag in your HTML page. Or add it to your bundle processing tool. There is no module system support as of yet.

## API
`ng-defer-bootstrap` adds the `deferBootstrap()` function to the global `angular` object. This function has 2 uses:
1. Register additional modules that should be added to the [`angular.bootstrap(element, modules)`](https://docs.angularjs.org/api/ng/function/angular.bootstrap) call. For example a debug or mock module.
2. Register a callback that will be called before the application is bootstrapped. If the callback returns a `Promise` the bootstrap process will not be resumed before the promise has settled (is resolved or rejected). If the callback returns an array or a promise that resolves to an array it is assumed to be additional modules to be added as in use `1`.

Call signatures:
```ts
declare namespace angular {
    /**
     * This is just the type declaration for the global `angular` variable.
     */
    interface IAngularStatic {
        /**
         * Register a callback that should be called before the application is bootstrapped
         */
        deferBootstrap(callback: () => void): void;
        /**
         * Register a callback that returns a promise that should be awaited before the application is bootstrapped
         */
        deferBootstrap(callback: () => PromiseLike<void>): void;
        /**
         * Register a callback that returns an array of module names to add to the `angular.bootstrap(element, modules)` call
         */
        deferBootstrap(callback: () => string[]): void;
        /**
         * Register a callback that returns an promise of module names to add to the `angular.bootstrap(element, modules)` call
         */
        deferBootstrap(callback: () => PromiseLike<string[]>): void;
        /**
         * Register additional modules to add to the `angular.bootstrap(element, modules)` call
         */
        deferBootstrap(modules: string[]): void
    }
}
```


## Implementation
The extension is implemented by setting the `NG_DEFER_BOOTSTRAP!` flag and calling `angular.resumeBootstrap()` after all registered callbacks are called and any returned promises have settled.
