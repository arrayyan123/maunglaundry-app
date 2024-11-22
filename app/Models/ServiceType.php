<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_pelayanan', 'durasi_hari', 'harga_servis'
    ];

    /**
     * Relasi ke tabel service_prices
     */
    public function servicePrices()
    {
        return $this->hasMany(ServicePrice::class);
    }
}
