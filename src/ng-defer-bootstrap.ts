(function (angular, window) {
    // see: https://github.com/angular/angular.js/blob/master/src/Angular.js#L1834
    const NG_BOOTSTRAP_DEFER = 'NG_DEFER_BOOTSTRAP!';

    const callbacks: any[] = [];
    const modules: string[] = [];

    // use the angular module to retrieve the $q and $log services
    const ng = angular.injector(['ng']);
    const $q = ng.get('$q');
    const $log = ng.get('$log');

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

    function resumeDeferredBootstrap() {
        const promises = callbacks.map(callback => $q.when(callback()));
        $q.all(promises)
            .then((values) => {
                values.forEach(value => {
                    if (Array.isArray(value)) {
                        modules.push(...value);
                    }
                });
                // We know resume bootstrap is defined because this hook gets called after the `angular.resumeBootstrap` property is set
                // see: https://github.com/angular/angular.js/blob/master/src/Angular.js#L1846
                angular.resumeBootstrap!(modules);
            })
            .catch((reason: string) => $log.error(`ngDeferBootstrap: could not resume bootstrapping process because a promise got rejected with the reason: '${reason}'`));
    }

    // set methods on `IAngularStatic` singleton
    angular.resumeDeferredBootstrap = resumeDeferredBootstrap;
    angular.deferBootstrap = deferBootstrap;
})(angular, window);
