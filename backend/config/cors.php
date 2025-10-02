<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://cryptoworld.cloud',
        'https://www.cryptoworld.cloud',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.cryptoworld\.cloud$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
