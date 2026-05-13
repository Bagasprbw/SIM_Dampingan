<?php

namespace App\Http\Controllers\Api\Pekerjaan;

use App\Http\Controllers\Controller;
use App\Models\Pekerjaan;
use Illuminate\Http\Request;

class PekerjaanController extends Controller
{
    public function index()
    {
        $pekerjans = Pekerjaan::all();
        return response()->json([
            'status' => 'success',
            'data' => $pekerjans
        ]);
    }
}
