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
        'image',
        'created_at',
        'updated_at',
    ];

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($content) {
            if ($content->image && Storage::exists($content->image)) {
                Storage::delete($content->image);
            }
        });
    }
}