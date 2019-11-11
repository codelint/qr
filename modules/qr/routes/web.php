<?php

Route::group(['prefix' => 'qr', 'middleware' => 'tool.qr'], function(){
    Route::any('/', function(){});
    Route::any('{one}', function(){});
    Route::any('{one}/{two}', function(){});
    Route::any('{one}/{two}/{thr}', function(){});
    Route::any('{one}/{two}/{thr}/{four}', function(){});
    Route::any('{one}/{two}/{thr}/{four}/{five}', function(){});
    Route::any('{one}/{two}/{thr}/{four}/{five}/{seven}', function(){});
    Route::any('{one}/{two}/{thr}/{four}/{five}/{seven}/{eight}', function(){});
    Route::any('{one}/{two}/{thr}/{four}/{five}/{seven}/{eight}/{nine}', function(){});
    Route::any('{one}/{two}/{thr}/{four}/{five}/{seven}/{eight}/{nine}/{ten}', function(){});
});