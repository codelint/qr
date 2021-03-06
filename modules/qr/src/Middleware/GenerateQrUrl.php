<?php namespace Qr\Middleware;

use Closure;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Exception\InvalidPathException;
use Endroid\QrCode\QrCode;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
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

        if (isset($get['type']) && $get['type'] == 'text')
        {
            $url = substr($url, Str::startsWith($url,'/') ? 3 : 4);
        }
        else
        {
            $url = 'http://' . $domain . $url . '?' . http_build_query(Arr::except($get, ['qr_size']));
        }

        $logo_path = null;
        if($logo = request()->get('logo'))
        {
            $logo_path = public_path('img/') . $logo;

            if (!file_exists($logo_path))
            {
                try
                {
                    $uri = base64_decode($logo);
                    if (Str::startsWith($uri, 'http'))
                    {
                        file_put_contents(storage_path('qr.tmp'), file_get_contents($uri));
                        $logo_path = storage_path('qr.tmp');
                    }
                } catch (\Exception $e)
                {
                    //todo
                }
            }
        }

        $qrCode = static::qrCode($url, $size, $logo_path);

        header('Content-Type: ' . $qrCode->getContentType());
        echo $qrCode->writeString();

        die();
    }

    /**
     * @param $url
     * @param int $size
     * @param string $logo_path
     * @return QrCode
     */
    static public function qrCode($url, $size = 400, $logo_path = '')
    {
        $qrCode = new QrCode($url);

        $qrCode->setSize($size);

        $qrCode->setWriterByName('png');
        $qrCode->setMargin(10);
        $qrCode->setEncoding('UTF-8');
        $qrCode->setErrorCorrectionLevel(ErrorCorrectionLevel::HIGH());
        $qrCode->setForegroundColor(['r' => 0, 'g' => 0, 'b' => 0, 'a' => 0]);
        $qrCode->setBackgroundColor(['r' => 255, 'g' => 255, 'b' => 255, 'a' => 0]);

        $logo_path = $logo_path ?: storage_path('/qr/' . md5($url));
        if (file_exists($logo_path))
        {
            try
            {
                $qrCode->setLogoPath($logo_path);
                $qrCode->setLogoSize(intval($size*3/10), intval($size*3/10));
            } catch (InvalidPathException $e)
            {
            }
        }
        // $qrCode->setLabel('Scan the code', 16, __DIR__ . '/../assets/fonts/noto_sans.otf', LabelAlignment::CENTER());
        // $qrCode->setLogoPath(__DIR__.'/../assets/images/symfony.png');
        // $qrCode->setLogoSize(150, 200);
        $qrCode->setRoundBlockSize(true);
        $qrCode->setValidateResult(false);
        $qrCode->setWriterOptions(['exclude_xml_declaration' => true]);

        return $qrCode;
    }
}
