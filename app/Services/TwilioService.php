<?php
namespace App\Services;

use Twilio\Rest\Client;

class TwilioService
{
    protected $client;
    protected $whatsappNumber;

    public function __construct()
    {
        $this->client = new Client(env('TWILIO_SID'), env('TWILIO_AUTH_TOKEN'));
        $this->whatsappNumber = 'whatsapp:' . env('TWILIO_WHATSAPP_NUMBER');
        if (!env('TWILIO_SID') || !env('TWILIO_AUTH_TOKEN')) {
            throw new \Exception('Twilio credentials are not set in environment variables.');
        }        
    }

    public function sendMessage($to, $message)
    {
        $to = 'whatsapp:' . $to;
    
        try {
            $message = $this->client->messages->create(
                $to,
                [
                    'from' => $this->whatsappNumber,
                    'body' => $message
                ]
            );
            return $message->sid;
        } catch (\Twilio\Exceptions\RestException $e) {
            throw new \Exception('Failed to send message: ' . $e->getMessage());
        }
    }
    
}
