<?php
/**
 * UsersController Class
 *
 * @category  Controller
 * @package   user manager
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class UsersController extends Controller {

    function view($id = null,$name = null) {
        $this->set('title',$name.' - GJboard View App');
        $this->set('post',$this->Post->getPost( "*", array("id"=>$id) ));

    }

    function joinForm() {
        $this->set('title','join user - Project manager');
    }

    function add() {
        $referer = (isset($_POST['referer'])? $_POST['referer'] : _BASE_URL_."/project/view_all" );

        if( !trim($_POST['name']) || !trim($_POST['id']) || !trim($_POST['password']) ){
            msg_page("Required fields are missing.");
        }

        $data = Array(
            "id" => trim(strval($_POST['id'])),
            "name" => trim(strval($_POST['name'])),
            "password" => $this->User->func('SHA1(?)', Array( trim(strval($_POST['password'])).SALT) ),
            "insert_date" => date("Y-m-d H:i:s")
        );
        $this->User->getUser("id", array("id"=>$data['id']));
        if( $this->User->count > 0 ){
            msg_page("ID is already subscribed.");
        }

        $id = $this->set('user',$this->User->add($data));
        redirect($referer);
    }

    function loginForm() {
        $this->set('title','login user - Project Manager App');
    }

    function login() {
        $result = array(
            'result'=>0,
            'error_msg'=>'',
            'accessToken'=>''
        );
        if( !trim($_POST['id']) || !trim($_POST['password']) ){
            $result['error_msg'] = "Required fields are missing.";
            echo json_encode($result);
            exit;
        }

        $data = Array(
            "id" => trim(strval($_POST['id'])),
            "password" => SHA1( $_POST['password'].SALT ),
            "accessToken"=> SHA1($_POST['id'].SALT )
        );

        $user = $this->User->getUser("*", $data);
        if( $this->User->count > 0 ){
            if( $user['level'] <= 5){
                $_SESSION['LOGIN_NO'] = $user["idx"];
                $_SESSION['LOGIN_ID'] = $user["id"];
                $_SESSION['LOGIN_NAME'] = $user["name"];
                $_SESSION['LOGIN_LEVEL'] = $user["level"];

                /*check is save id */
                $result['result'] = 1;
            }else{
                $result['error_msg'] = "You do not have permission to access.";
            }
        }else{
            $result['error_msg'] =  "information does not match.";
        }
        echo json_encode($result);
    }

    function logout(){
        unset($_SESSION['LOGIN_NO']);
        unset($_SESSION['LOGIN_ID']);
        unset($_SESSION['LOGIN_NAME']);
        unset($_SESSION['LOGIN_LEVEL']);
    }

}