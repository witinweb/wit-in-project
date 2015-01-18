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
        'error_info'=>NULL
    );
    protected $user_info;
    protected function checkAccessToken() {
        if( !isset($_COOKIE['LOGIN_ID']) ){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = 'Your session has expired.';
            echo json_encode($this->result);
            exit;
        }
        $headers = apache_request_headers();
        if( !isset($headers['Authorization']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = 'The accessToken is required.';
            echo json_encode($this->result);
            exit;
        }
        $this->user_info = $this->user->getUser("*", array('accessToken'=>str_replace("basic ", "", $headers['Authorization'])));
        if(!$this->user_info){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = 'The accessToken is not valid.';
            echo json_encode($this->result);
            exit;
        }
    }

    function login() {
        if( !trim($_POST['id']) || !trim($_POST['password']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = "Required fields are missing.";
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
                    "accessToken"=> SHA1("basic ".$_POST['id'].date("Y-m-d H:m:s").SALT )
                );
                $this->User->modify( $user["idx"], $modify_data );

                setcookie('LOGIN_ID',$user["id"],time() + (86400 * 1), '/');
                setcookie('LOGIN_NAME',$user["name"],time() + (86400 * 1), '/');
                setcookie('accessToken',$modify_data['accessToken'],time() + (86400 * 1), '/');

                $user = $this->User->getUser("*", $data);
                $this->result['user_info'] = $user;
                unset($this->result['user_info']['password']);
                //todo add project list and first project's task list
            }else{
                $this->result['error_info']['id'] = 1;
                $this->result['error_info']['msg'] = "You do not have permission to access.";
            }
        }else{
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] =  "information does not match.";
        }
        echo json_encode($this->result);
    }

    function join(){

        if( !trim($_POST['id']) || !trim($_POST['password']) || !trim($_POST['name']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = "Required fields are missing.";
            echo json_encode($this->result);
            exit;
        }
        $data = Array(
            "id" => trim(strval($_POST['id'])),
            "password" => SHA1( $_POST['password'].SALT ),
            "name"=> $_POST['name']
        );
        //check exist id
        $is_exist_user = $this->User->getUser('idx', array('id'=>$data['id']));
        if($is_exist_user){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "The ID that already exists.";
        }else{
            //insert user
            if(!$this->User->add($data)){
                $this->result['error_info']['id'] = 2;
                $this->result['error_info']['msg'] = "Join failed.";
            }
        }
        echo json_encode($this->result);
    }

    function userViewAll(){
        $this->checkAccessToken();
        if( !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The project_idx is required.';
            echo json_encode($this->result);
            exit;
        }
        $limit = array( 0, 1000 );

        $user_project = New User_project();
        $user_project_list = $user_project->getList(array('insert_date'=>'desc'), $limit, array('project_idx'=>$_POST['project_idx']));
        $user_list = array();
        foreach($user_project_list as $item){
            $user_list[] = $this->User->getList( array('insert_date'=>'desc'), $limit, array('idx'=>$item['user_idx']), array('id','name'));
        }
        if($user_list){
            $this->result['result'] = 1;
            $this->result['user_list'] = $user_list;
        }else{
            $this->result['error_msg'] = "user does not exist.";
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