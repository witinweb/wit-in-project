<?php
/**
 * TodosController Class
 *
 * @category  Controller
 * @package   Task
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class TodosController extends Controller {

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
        if( !isset($_POST['accessToken']) ){
            $this->result['error_msg'] = 'The accessToken is required.';
            echo json_encode($this->result);
            exit;
        }
        $this->user = new User();
        $this->user_info = $this->user->getUser("*", array('accessToken'=>$_POST['accessToken']));
        if(!$this->user_info){
            $this->result['error_msg'] = 'The accessToken is not valid.';
            echo json_encode($this->result);
            exit;
        }
    }

    function view_all($page_idx, $thispage = null) {
        global $is_API;
        $result = array(
            'result'=>0,
            'list'=>''
        );
        if(is_null($thispage) || empty($thispage)) $thispage = 1;
        $limit = array( ($thispage-1)*10, 100 );

        $where = array( "t.page_idx"=>$page_idx );
        $this->Todo->join("user u", "u.idx=t.receiver_idx", "LEFT");
        $column = array("u.idx as u_idx", "u.name as u_name", "t.idx as idx", "t.title as title", "t.status as status");
        $todos = $this->Todo->getList("task t", array('t.insert_date'=>'desc'), $limit, $where, $column);
        if($todos) {
            $result['result'] = 1;
            foreach($todos as $Todo){

            }
            $result['list'] = $todos;
        }
        if($is_API){
            echo json_encode($result);
        }else{
            return $result;
        }
    }



    function makeState($state){
        $result = array(
            "en"=>"",
            "ko"=>""
        );
        if($state == 1){
            $result["en"] = "ready";
            $result["ko"] = "진행중";
            $result["class"] = "button tiny state0";
        }else if($state == 1){
            $result["en"] = "finish";
            $result["ko"] = "완료";
            $result["class"] = "button tiny alert state1";
        }else if($state == 2){
            $result["en"] = "delete";
            $result["ko"] = "삭제";
            $result["class"] = "button tiny secondary state2";
        }
        return $result;
    }
    function writeForm($project_idx) {
        $limit = array( 0, 1000 );
        $where = array(
            'project_idx'=> $project_idx
        );
        $category = new Category();
        $categories = $category->getList( array('insert_date'=>'asc'), $limit, $where );
        $this->set('project_idx', $project_idx);
        $this->set('categories', $categories);
        $this->set('title','Write  pages');
    }

    function add() {
        $this->checkAccessToken();
        if( !isset($_POST['task_idx']) || !isset($_POST['title']) || !isset($_POST['receiver_idx']) || !isset($_POST['due_date']) || !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The task_idx or todo title or reciever or due date is required.';
            echo json_encode($this->result);
            exit;
        }
        if( !$this->checkIsMaster($_POST['project_idx'], $this->user_info['idx']) && !$this->checkIsManager($_POST['project_idx'], $this->user_info['idx'])){
            $this->result['error_msg'] = 'You do not have permission to add.';
            echo json_encode($this->result);
            exit;
        }
        $data = Array(
            "title" => $_POST['title'],
            "user_idx" => $this->user_info['idx'],
            "receiver_idx" => $_POST['receiver_idx'],
            "due_date" => $_POST['due_date'],
            "insert_date"=> date("Y-m-d H:i:s")
        );

        $todo_id = $this->Todo->add($data);
        if($todo_id){
            $this->result['result'] = 1;
        }else{
            $this->result['error_msg'] = 'Failed to add todo.';
        }

        echo json_encode($this->result);
    }

    function del($idx = null, $project_idx) {

        $data = Array(
            "state" => 4,
        );

        $this->Page->updatePost($idx, $data);
        redirect(_BASE_URL_."/pages/view_all/".$project_idx);
    }


    function updateTask($idx = null) {

        $data = Array(
            "link" => $_POST['link'],
            "name" => $_POST['name'],
            "state" => $_POST['state'],
            "description" => $_POST['description'],
            "category_idx" => $_POST['category_idx']
        );
        if( isset($_POST['finish_date']) ) $data["finish_date"] = $_POST['finish_date'];
        $this->Task->updateTask($idx, $data);
        redirect(_BASE_URL_."/pages/view_all/".$_POST['project_idx']);
    }

    function updateStatus($idx = null) {
        global $is_API;
        $result = array(
            'result'=>0
        );
        $data = Array(
            "status" => $_POST['status'],
            "finish_date" => date("Y-m-d")
        );
        $result['result'] = $this->Task->updateTask($idx, $data);
        if($is_API){
            echo json_encode($result);
        }else{
            return $result;
        }
    }

    private function checkIsMaster($project_idx, $user_idx){
        $project = New Project();
        $item = $project->getProject("master_idx", array("idx"=>$project_idx));
        return ($user_idx == $item['master_idx']);
    }

    private function checkIsManager($project_idx, $user_idx){
        $user_project = New User_project();
        $where = array(
            "project_idx"=>$project_idx,
            "user_idx"=>$user_idx
        );
        $item = $user_project->getUserProject("is_manager", $where);
        return (1 == $item['is_manager']);
    }


}