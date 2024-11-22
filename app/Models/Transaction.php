<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'nama_produk',
        'laundry_type',
        'payment_method_id',
        'status_payment',
        'status_job',
    ];

    public function details()
    {
        return $this->hasMany(DetailTransaction::class);
    }
    
}