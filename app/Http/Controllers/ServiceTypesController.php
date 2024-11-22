<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceType;

class ServiceTypesController extends Controller
{
    public function index() {
        return response()->json(ServiceType::all());
      }
}
