<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Akses dokumentasi API oleh publik sementara 
        Gate::define('viewApiDocs', function ($user = null) {
            return true;
        });

        /*
        // akses hanya untuk superadmin
        Gate::define('viewApiDocs', function (User $user) {
            return $user->hasRole('superadmin');
        });
        */
    }
}
