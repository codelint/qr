<?php namespace Sample;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

/**
 * ModuleProvider:
 * @date 2019/11/9
 * @time 21:32
 * @author Ray.Zhang <codelint@foxmail.com>
 **/
class ModuleProvider extends ServiceProvider {


    public function ns()
    {
        return 'sample';
    }

    protected function base_dir($path)
    {
        return __DIR__ . '/../' . $path;
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {

    }

    public function boot()
    {
        $this->loadViewsFrom($this->base_dir('resources/views'), $this->ns());
        $this->loadTranslationsFrom($this->base_dir('resources/lang'), $this->ns());
        $this->loadMigrationsFrom($this->base_dir('database/migrations'));

        $this->mapApiRoutes();
        $this->mapWebRoutes();
        // $this->commands([]);
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace(Str::ucfirst($this->ns()) . '\Http\Controllers')
            ->group($this->base_dir('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::middleware('api')
            ->namespace(Str::ucfirst($this->ns()) . '\Http\Controllers')
            ->group($this->base_dir('routes/api.php'));
    }
}
