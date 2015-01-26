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
        'error_info'=>NULL
    );

    protected function checkAccessToken() {
        if( !isset($_COOKIE['LOGIN_ID']) ){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = 'Your session has expired.';
            echo json_encode($this->result);
            exit;
        }
        $headers = apache_request_headers();
        ;        if( !isset($headers['Authorization']) || empty($headers['Authorization']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = 'The accessToken is required.';
            echo json_encode($this->result);
            exit;
        }
        $this->user = new User();
        $this->user_info = $this->user->getUser("*", array('accessToken'=>str_replace("Basic ", "", $headers['Authorization'])));
        if(!$this->user_info){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = 'The accessToken is not valid.';
            echo json_encode($this->result);
            exit;
        }
    }

    protected function categoryList($project_idx){

        $category =  new Category();
        $where = array( "project_idx"=>$project_idx );
        $categories = $category->getList( array('insert_date'=>'asc'), array(0, 10000), $where );
        if($categories){
            return $categories;
        }else{
            return null;
        }
    }

    function viewAll() {
        $this->checkAccessToken();
        if( !isset($_POST['project_idx']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = 'The project_idx is required.';
            echo json_encode($this->result);
            exit;
        }

        $categories = $this->categoryList($_POST['project_idx']);
        printr($categories);
        if($categories){
            $i = 0;
            foreach($categories as $category){
                $limit = array( 0, 1000 );
                $where = array(
                    "t.project_idx"=>$_POST['project_idx'],
                    "t.category"=>$category['category']
                );
                //todo todo와 user정보 조인 부분 수정해야함.
                $this->Task->join("user u", "u.idx=t.user_idx", "LEFT");
                $column = array("t.idx as idx", "t.name as name", "t.description as description", "t.project_idx as project_idx", "t.category_idx as category_idx", "t.insert_date as insert_date","u.id as user_id", "u.name as user_name");
                $tasks = $this->Task->getList("task t", array('t.insert_date'=>'desc'), $limit, $where, $column);
                if($tasks){
                    $categories[$i]['task_list'] = $tasks;
                    $j = 0;
                    foreach($tasks as $task){
                        $categories[$i]['task_list'][$j]['todo_list'] = $this->getTodoList($task);
                        $j++;
                    }
                }else{
                    $categories[$i]['task_list'] = null;
                }

                $i++;
            }
            $this->result['category_list'] = $categories;
        }else{
            $this->result['category_list'] = null;
        }
        echo json_encode($this->result);
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
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = "The task_idx or todo title or reciever or due date is required.";
            echo json_encode($this->result);
            exit;
        }
        if( !$this->checkIsMaster($_POST['project_idx'], $this->user_info['idx']) && !$this->checkIsManager($_POST['project_idx'], $this->user_info['idx'])){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "You do not have permission to add.";
            echo json_encode($this->result);
            exit;
        }
        $data = Array(
            "title" => $_POST['title'],
            "project_idx" => $_POST['project_idx'],
            "task_idx" => $_POST['task_idx'],
            "user_idx" => $this->user_info['idx'],
            "receiver_idx" => $_POST['receiver_idx'],
            "due_date" => $_POST['due_date'],
            "insert_date"=> date("Y-m-d H:i:s")
        );

        $todo_id = $this->Todo->add($data);
        if(!$todo_id){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "Failed to add todo.";
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