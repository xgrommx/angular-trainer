define(function(){
   return [
       {
           route: '/',
           options: {
               template: '<div>{{test}}</div>',
               controller: 'atMain',
               resolve: {
                    resource: function($q, $rootScope){
                        var d = $q.defer();
                        angularTrainer.requirejs({
                            controllers: [
                                "atMain"
                            ]
                        }, function(){
                            d.resolve('Resolved');
                            $rootScope.$apply();
                        });

                        return d.promise;
                    }
               }
           }
       }
   ]
});