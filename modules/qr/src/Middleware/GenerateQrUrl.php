<?php namespace Qr\Middleware;

use Closure;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * GenerateQrUrl:
 * @date 2019/11/12
 * @time 01:39
 * @author Ray.Zhang <codelint@foxmail.com>
 **/
class GenerateQrUrl {

    public function handle($request, Closure $next, $guard = null)
    {

        $url = $_SERVER['REQUEST_URI'];
        $get = request()->all();
        $domain = Arr::get($get, '__domain', $_SERVER['HTTP_HOST']);
        $get = Arr::except($get, '__domain');
        $size = Arr::get($get, 'qr_size', 300);
        $url = substr($url, 3);
        $url = Str::startsWith($url, '/') ? $url : "/$url";
        $url = explode('?', $url);
        $url = $url[0];
        $url = 'http://' . $domain . $url . '?' . http_build_query(Arr::except($get, ['qr_size']));
        //include_once(app_path('library/phpqrcode/phpqrcode.php'));

        $qrCode = new QrCode($url);

        $qrCode->setSize($size);

        $qrCode->setWriterByName('png');
        $qrCode->setMargin(10);
        $qrCode->setEncoding('UTF-8');
        $qrCode->setErrorCorrectionLevel(ErrorCorrectionLevel::HIGH());
        $qrCode->setForegroundColor(['r' => 0, 'g' => 0, 'b' => 0, 'a' => 0]);
        $qrCode->setBackgroundColor(['r' => 255, 'g' => 255, 'b' => 255, 'a' => 0]);
        // $qrCode->setLabel('Scan the code', 16, __DIR__ . '/../assets/fonts/noto_sans.otf', LabelAlignment::CENTER());
        // $qrCode->setLogoPath(__DIR__.'/../assets/images/symfony.png');
        // $qrCode->setLogoPath()
        // $qrCode->setLogoSize(150, 200);
        $qrCode->setRoundBlockSize(true);
        $qrCode->setValidateResult(false);
        $qrCode->setWriterOptions(['exclude_xml_declaration' => true]);


        header('Content-Type: ' . $qrCode->getContentType());
        echo $qrCode->writeString();

        // Save it to a file
        // $qrCode->writeFile(__DIR__ . '/qrcode.png');

        // $response = new QrCodeResponse($qrCode);
        die();
    }
}