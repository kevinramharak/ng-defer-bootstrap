declare namespace angular {
    /**
     * This is just the type declaration for the global `angular` variable.
     */
    interface IAngularStatic {
        /**
         * see: https://github.com/angular/angular.js/blob/master/src/Angular.js#L1853
         */
        resumeDeferredBootstrap?: (...args: any[]) => any;
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
