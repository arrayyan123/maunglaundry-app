<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'customer_id',
        'nama_produk',
        'laundry_type',
        'payment_method_id',
        'status_payment',
        'status_job',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime:Y-m-d H:i:s',
        'end_date' => 'datetime:Y-m-d H:i:s',
    ];
    
    protected static function booted()
    {
        static::created(function ($transaction) {
            Transaction::updateTotalPrice();
        });

        static::updated(function ($transaction) {
            Transaction::updateTotalPrice();
        });

        static::deleted(function ($transaction) {
            Transaction::updateTotalPrice();
        });
    }

    public static function updateTotalPrice()
    {
        $totalPrice = DB::table('transactions')
            ->join('detail_transactions', 'transactions.id', '=', 'detail_transactions.transaction_id')
            ->sum(DB::raw('detail_transactions.price'));

        DB::table('transaction_totals')->updateOrInsert(
            ['id' => 1],
            ['total_price' => $totalPrice, 'updated_at' => now()]
        );
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
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