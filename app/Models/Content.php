<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Content extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'created_at',
        'updated_at',
    ];

    public function images()
    {
        return $this->hasMany(ContentImage::class);
    }
}