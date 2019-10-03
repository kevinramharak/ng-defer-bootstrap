(function (angular, window) {
    // see: https://github.com/angular/angular.js/blob/master/src/Angular.js#L1834
    const NG_BOOTSTRAP_DEFER = 'NG_DEFER_BOOTSTRAP!';

    const callbacks: any[] = [];
    const modules: string[] = [];

    // use the angular module to retrieve the $q and $log services
    const ng = angular.injector(['ng']);
    const $q = ng.get('$q');

    function setDeferFlag() {
        if (window.name.indexOf(NG_BOOTSTRAP_DEFER) !== 0) {
            window.name = NG_BOOTSTRAP_DEFER + window.name;
        }
    }

    function deferBootstrap(callbackOrModules?: ((...args: any[]) => any) | string[]) {
        setDeferFlag();
        if (typeof callbackOrModules === 'function') {
            callbacks.push(callbackOrModules);
        } else if (Array.isArray(callbackOrModules)) {
            modules.push(...callbackOrModules);
        }
    }

    type AllSettledFulfilledReturnvalue<T = any>  = { status: 'fulfilled', value: T };
    type AllSettledRejectedReturnvalue<R = any>  = { status: 'rejected', reason: R };

    /**
     * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
     * and: https://tc39.es/proposal-promise-allSettled/#sec-promise.allsettled
     */
    function allSettled<T = any, R = any>(promises: PromiseLike<any>[]): PromiseLike<(AllSettledFulfilledReturnvalue<T> | AllSettledRejectedReturnvalue<R>)[]> {
        return $q.all(promises.map((promise => {
            return $q((resolve: (status: AllSettledFulfilledReturnvalue<T> | AllSettledRejectedReturnvalue<R>) => any) => {
                promise.then((value) => resolve({ status: 'fulfilled', value }), (reason) => resolve({ status: 'rejected', reason }));
            });
        })));
    }

    function resumeDeferredBootstrap() {
        const promises = callbacks.map(callback => $q.when(callback()));
        allSettled<string[] | void>(promises)
            .then((values) => {
                values.forEach(value => {
                    if (Array.isArray(value)) {
                        modules.push(...value);
                    }
                });
                // We know resume bootstrap is defined because this hook gets called after the `angular.resumeBootstrap` property is set
                // see: https://github.com/angular/angular.js/blob/master/src/Angular.js#L1846
                angular.resumeBootstrap!(modules);
            });
    }

    // set methods on `IAngularStatic` singleton
    angular.resumeDeferredBootstrap = resumeDeferredBootstrap;
    angular.deferBootstrap = deferBootstrap;
})(angular, window);
