<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContentImage extends Model
{
    use HasFactory;

    protected $table = 'content_images';

    protected $fillable = [
        'content_id',
        'path',
    ];

    public function content()
    {
        return $this->belongsTo(Content::class);
    }
}
