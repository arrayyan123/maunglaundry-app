<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use HasFactory;

    public $incrementing = false; // Disable auto-incrementing
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'nama_produk',
        'laundry_type',
        'payment_method_id',
        'status_payment',
        'status_job',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid(); // Generate a UUID
            }
        });
    }

    public function details()
    {
        return $this->hasMany(DetailTransaction::class);
    }
    
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}