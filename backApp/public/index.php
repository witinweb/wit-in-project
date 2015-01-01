<?php
/**
 * Index
 *
 * @category  Public
 * @package   Index
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(dirname(__FILE__)));
define('_BASE_URL_', '/project_manager');

$url = ( isset($_GET['url']) ? $_GET['url'] : _BASE_URL_."/project" );
$api_version = "v1.0";
require_once (ROOT . DS . 'library' . DS . 'bootstrap.php');