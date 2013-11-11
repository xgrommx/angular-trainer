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
                        requirejs(['app/core/controller/at-main/controller'], function(){
                            setTimeout(function(){
                                d.resolve('Resolved');
                                $rootScope.$apply();
                            }, 10);
                        });

                        return d.promise;
                    }
               }
           }
       }
   ]
});