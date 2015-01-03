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

    protected $result = array(
        'result'=>0,
        'error_msg'=>'',
        'accessToken'=>''
    );


    function login() {
        if( !trim($_POST['id']) || !trim($_POST['password']) ){
            $this->result['error_msg'] = "Required fields are missing.";
            echo json_encode($this->result);
            exit;
        }

        $data = Array(
            "id" => trim(strval($_POST['id'])),
            "password" => SHA1( $_POST['password'].SALT ),
            "accessToken"=> SHA1($_POST['id'].SALT )
        );

        $user = $this->User->getUser("*", $data);
        if( $this->User->count > 0 ){
            if( isset($user['accessToken']) ){
                $_SESSION['LOGIN_NO'] = $user["idx"];
                $_SESSION['LOGIN_ID'] = $user["id"];
                $_SESSION['LOGIN_NAME'] = $user["name"];
                $modify_data = array("last_login_date"=> date("Y-m-d H:m:s"));
                $this->User->modify( $user["idx"], $modify_data );
                $this->result['result'] = 1;
                $this->result['accessToken'] = $data['accessToken'];
            }else{
                $this->result['error_msg'] = "You do not have permission to access.";
            }
        }else{
            $this->result['error_msg'] =  "information does not match.";
        }
        echo json_encode($this->result);
    }

    function join(){

        if( !trim($_POST['id']) || !trim($_POST['password']) || !trim($_POST['name']) ){
            $this->result['error_msg'] = "Required fields are missing.";
            echo json_encode($this->result);
            exit;
        }
        $data = Array(
            "id" => trim(strval($_POST['id'])),
            "password" => SHA1( $_POST['password'].SALT ),
            "accessToken"=> SHA1($_POST['id'].SALT ),
            "name"=> $_POST['name'],
            "last_login_date"=> date("Y-m-d H:m:s")
        );
        //todo check exist id
        $user_id = $this->User->add($data);
        if($user_id){
            $this->result['result'] = 1;
            $this->result['accessToken'] = $data['accessToken'];
        }else{
            $this->result['error_msg'] = "Join failed.";
        }
        echo json_encode($this->result);
    }

    function logout(){
        unset($_SESSION['LOGIN_NO']);
        unset($_SESSION['LOGIN_ID']);
        unset($_SESSION['LOGIN_NAME']);
        unset($_SESSION['LOGIN_LEVEL']);
    }

}