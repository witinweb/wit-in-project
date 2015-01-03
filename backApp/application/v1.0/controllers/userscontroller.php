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
            "password" => SHA1( $_POST['password'].SALT )
        );
        $user = $this->User->getUser("*", $data);
        if( $this->User->count > 0 ){
            if( isset($user['accessToken']) ){

                $modify_data = array(
                    "last_login_date"=> date("Y-m-d H:m:s"),
                    "accessToken"=> SHA1($_POST['id'].date("Y-m-d H:m:s").SALT )
                );
                $this->User->modify( $user["idx"], $modify_data );

                setcookie('LOGIN_ID',$user["id"],time() + (86400 * 1), '/');
                setcookie('LOGIN_NAME',$user["name"],time() + (86400 * 1), '/');
                setcookie('accessToken',$modify_data['accessToken'],time() + (86400 * 1), '/');

                $this->result['result'] = 1;
                $this->result['name'] = $user["name"];
                $this->result['accessToken'] = $modify_data['accessToken'];
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
            "name"=> $_POST['name'],
            "last_login_date"=> date("Y-m-d H:m:s")
        );
        //todo check exist id
        $user_id = $this->User->add($data);
        if($user_id){
            $this->result['result'] = 1;
        }else{
            $this->result['error_msg'] = "Join failed.";
        }
        echo json_encode($this->result);
    }

    function logout(){
        setcookie("LOGIN_ID", "", time() - 3600, '/');
        setcookie("LOGIN_NAME", "", time() - 3600, '/');
        setcookie("accessToken", "", time() - 3600, '/');
        $this->result['result'] = 1;
        echo json_encode($this->result);
    }

}