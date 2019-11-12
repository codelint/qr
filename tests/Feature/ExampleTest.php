<?php

namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Qr\Middleware\GenerateQrUrl;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $op = GenerateQrUrl::qrCode('http://m.baidu.com', 400, __DIR__ . '/../../storage/result.png');

        $op->writeFile(__DIR__ . '/../../storage/test.png');
    }
}
