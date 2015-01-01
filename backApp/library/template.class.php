<?php
/**
 * Template Class
 *
 * @category  Library
 * @package   Template
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class Template {

    protected $variables = array();
    protected $_controller;
    protected $_action;

    function __construct($controller,$action) {
        $this->_controller = $controller;
        $this->_action = $action;
        $this->set("controller", $controller);
        $this->set("action", $action);
    }

    /** Set Variables **/

    function set($name,$value) {
        $this->variables[$name] = $value;
    }

    /** Display Template **/

    function render() {

    }

}