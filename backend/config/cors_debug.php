<?php

// Debugging: Print CORS configuration
if (env('APP_DEBUG')) {
    header('X-CORS-Debug: ' . json_encode([
        'allowed_origins' => config('cors.allowed_origins'),
        'allowed_methods' => config('cors.allowed_methods'),
        'allowed_headers' => config('cors.allowed_headers'),
    ]));
}
