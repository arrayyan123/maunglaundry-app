<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'service_types_id',
        'service_prices_id',
        'quantity',
        'price',
    ];
    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class, 'service_types_id');
    }

    public function servicePrice()
    {
        return $this->belongsTo(ServicePrice::class, 'service_prices_id');
    }
}