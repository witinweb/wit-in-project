<?php
/**
 * ProjectController Class
 *
 * @category  Controller
 * @package   Project
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class ProjectsController extends Controller {

    protected $user;
    protected $user_info;
    protected $result = array(
        'result'=>0,
        'error_msg'=>'',
        'accessToken'=>''
    );

    protected function checkAccessToken() {
        if( !isset($_COOKIE['LOGIN_ID']) ){
            $this->result['error_msg'] = 'Your session has expired.';
            echo json_encode($this->result);
            exit;
        }
        if( !isset($_COOKIE['accessToken']) ){
            $this->result['error_msg'] = 'The accessToken is required.';
            echo json_encode($this->result);
            exit;
        }

        $this->user = new User();
        $this->user_info = $this->user->getUser("*", array('id'=>$_COOKIE["LOGIN_ID"]));
    }


    function view($id = null,$name = null) {
        $this->set('title',$name);
        $post = $this->Post->getPost( "*", array("id"=>$id) );
        $user = new User();
        $post['user_name'] = $user->getUser("name",array('user_id'=>$post["user_id"]));
        $category = new Category();
        $post['category'] = $category->getCategory("*", array('id'=>$post['category_id']));
        $this->set('post',$post);
    }

    function viewAll() {
        $this->checkAccessToken();
        $where = null;
        $limit = array( 0, 100 );

        $user_project = New User_project();
        $project_idx_list = $user_project->getList(array('insert_date'=>'desc'), array(0, 1000), array('user_idx'=>$this->user_info['idx']));
        $project_list = array();
        foreach($project_idx_list as $project){
            $project_list[] = $this->Project->getList( array('insert_date'=>'desc'), $limit, array('idx'=>$project['project_idx']));
        }
        if($project_list){
            $this->result['result'] = 1;
            $this->result['project_list'] = $project_list;
        }else{
            $this->result['error_msg'] = "project does not exist.";
        }
        echo json_encode($this->result);

    }


    function add() {

        $this->checkAccessToken();
        if( !isset($_POST['name']) ){
            $this->result['error_msg'] = 'The project name is required.';
            echo json_encode($this->result);
            exit;
        }

        $project_data = Array(
            "name" => $_POST['name'],
            "master_idx" => $this->user_info['idx']
        );
        $result_of_project = $this->Project->add($project_data);

        $user_project_data = Array(
            "user_idx" => $this->user_info['idx'],
            "project_idx" => $result_of_project,
            "is_manager" => 1
        );
        $user_project = New User_project();
        $result_of_user_project = $user_project->add($user_project_data);

        if($result_of_project && $result_of_user_project){
            $this->result['result'] = 1;
        }

        echo json_encode($this->result);

    }

    function addUser(){

        $this->checkAccessToken();
        if( !isset($_POST['project_idx']) || !isset($_POST['user_id']) ){
            $this->result['error_msg'] = 'The project_idx and user_id is required.';
            echo json_encode($this->result);
            exit;
        }

        if($this->checkIsMaster($_POST['project_idx'], $this->user_info['idx'])){
            //User information to be updated
            $this->user = new User();
            $user = $this->user->getUser("*", array('user_id'=>$_POST["user_id"]));
            //project member update
            $user_project = New User_project();
            $where = array('user_idx'=>$user['idx'], 'project_idx'=>$_POST['project_idx']);
            if($user_project->modify($where, array('is_manager'=> 1))){
                $this->result['result'] = 1;
            }else{
                $this->result['error_msg'] = "Update failed.";
            }
        }else{
            $this->result['error_msg'] = "You do not have permission to delete.";
        }

        echo json_encode($this->result);

    }

    function del($idx = null) {
        $this->checkAccessToken();
        if($this->checkIsMaster($idx, $this->user_info['idx'])){
            if( $this->Project->del($idx) ){
                $this->result['result'] = 1;
            }else{
                $this->result['error_msg'] = 'Cannot delete this project.';
            }
        }else{
            $this->result['error_msg'] = "You do not have permission to delete.";
        }
        echo json_encode($this->result);
    }

    private function checkIsMaster($project_idx, $user_idx){
        $project = $this->Project->getProject("master_idx", array("idx"=>$project_idx));
        return ($user_idx == $project['master_idx']);
    }


    function modify($idx = null) {
        $this->checkAccessToken();
        if( !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The project_idx is required.';
            echo json_encode($this->result);
            exit;
        }

        if($this->checkIsMaster($_POST['project_idx'], $this->user_info['idx'])){
            $data = Array(
                "name" => trim(strval($_POST['name']))
            );
            if( $this->Project->modify($_POST['project_idx'], $data) ){
                $this->result['result'] = 1;
            }else{
                $this->result['error_msg'] = 'Cannot update this project.';
            }
        }else{
            $this->result['error_msg'] = "You do not have permission to update.";
        }

        echo json_encode($this->result);
    }

    function uploadFile($file = null) {
        global $is_API;
        if(is_null($file)) $file = $_FILES;
        $result = array(
            'result'=>0,
            'link'=>''
        );
        if($file['file']['name']) {
            $file_check = explode(".", $file['file']['name']);
            $ext = strtolower($file_check[count($file_check)-1]);					// 파일 확장자 구하기
            $upfile = file_upload($file['file']['tmp_name'], "board_".date("YmdHis").rand(1000,9999), $ext, "..".UPLOAD_PATH."/".date("Y")."/".date("m")."/", 1);
            if($upfile){
                $result['result'] = 1;
                $result['link'] = UPLOAD_PATH."/".date("Y")."/".date("m")."/".$upfile;
                $result['filename'] = $upfile;
            }
            //thumbnail($path."/".$upfile, $path."/thumb_".$upfile, 120, 100, 1);
            $post_id = (isset($_POST['id']) ? $_POST['id'] : "");
            $is_thumbnail = (isset($_POST['is_thumbnail']) ? $_POST['is_thumbnail'] : "N");
            if( !$this->addAttachment($post_id, $is_thumbnail, $file, $upfile, $result['link']) ) {
                $result['result'] = 0;
                $result['message'] = "file information update failed!";
            }
        }

        if($is_API){
            echo json_encode($result);
        }else{
            return $result;
        }
    }

    function loadFile($post_id = null, $user_id = null){
        global $is_API;

        $where = Array(
            "post_id" => $post_id,
            "user_id" => $user_id
        );
        $data = null;

        $files = $this->Post->getAttachment("url", $where);
        if($is_API){
            echo json_encode($files);
        }else{
            return $files;
        }

    }

    function deleteFile(){
        $result = array(
            'result'=>0
        );

        $src = $_POST['src'];
        $path = getcwd();
        $path = str_replace( "\\public", "", $path );

        $real_path = realpath($path.$src);
        // Check if file exists.
        if (file_exists($real_path)) {
            // Delete file.
            if(unlink($real_path)){
                //database delete...
                if( $this->Post->delAttachment( Array("url" => $src)) ) $result['result'] = 1;
            }
        }
        echo json_encode($result);
    }

    function addAttachment($post_id = "", $is_thumbnail = "N", $file = null, $name, $url) {
        if(is_null($file)) $file = $_FILES;
        $result = array(
            'result'=>0
        );

        $data = Array(
            "post_id" => $post_id,
            "user_id" => $_SESSION['LOGIN_ID'],
            "name" => $name,
            "original_name" => $file['file']['name'],
            "url" => $url,
            "mime" => $file['file']['type'],
            "size" => $file['file']['size'],
            "is_thumbnail" => $is_thumbnail,
            "register_date" => date("Y-m-d H:i:s"),
        );
        if( $this->Post->addAttachment($data) ) $result['result'] = 1;

        return $result;
    }
}