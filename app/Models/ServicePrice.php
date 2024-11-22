<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_types_id', 'nama_produk', 'laundry_types', 'harga'
    ];

    /**
     * Relasi ke tabel service_types
     */
    public function serviceType()
    {
        return $this->belongsTo(ServiceType::class);
    }
}

