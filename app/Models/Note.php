<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'content',
    ];

    public $timestamps = true;
    
    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }
}