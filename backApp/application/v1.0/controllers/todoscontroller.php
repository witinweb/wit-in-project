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
        if( !isset($headers['Authorization']) || empty($headers['Authorization']) ){
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
        if($categories){
            $i = 0;
            foreach($categories as $category){
                $limit = array( 0, 1000 );
                $where = array(
                    "t.project_idx"=>$_POST['project_idx'],
                    "t.category_idx"=>$category['idx']
                );
                $this->Todo->join("user u", "u.idx=t.user_idx", "LEFT");
                $column = array("t.idx as idx", "t.content as content", "t.project_idx as project_idx", "t.category_idx as category_idx", "u.id as user_id","u.name as user_name", "t.receiver_idx as receiver_idx", "t.insert_date as insert_date", " t.due_date as due_date, t.is_finish as is_finish");
                $todos = $this->Todo->getList("todo t", array('t.insert_date'=>'desc'), $limit, $where, $column);
                if($todos){
                    $j = 0;
                    foreach($todos as $todo){
                        $todos[$j] = $this->getReceiverInfo($todo);
                        $j++;
                    }
                    $categories[$i]['todo_list'] = $todos;
                }else{
                    $categories[$i]['todo_list'] = null;
                }

                $i++;
            }
            $this->result['category_list'] = $categories;
        }else{
            $this->result['category_list'] = null;
        }
        //printr($this->result);
        echo json_encode($this->result);
    }

    function viewAllByDueDate(){
        $this->checkAccessToken();

        $limit = array( 0, 1000 );
        $this->Todo->orderBy('due_date','asc');
        $this->Todo->where('user_idx', $this->user_info['idx']);
        $this->Todo->where('is_finish', 0);
        $this->Todo->orwhere('receiver_idx', $this->user_info['idx']);
        $todo_list = $todos = $this->Todo->get('todo', $limit);
        if($todo_list){
            $this->result['todo_list'] = $todo_list;
        }else{
            $this->result['todo_list'] = null;
        }
        echo json_encode($this->result);
    }

    function getReceiverInfo($todo){
        $user = new User();
        $where = array(
            "idx"=>$todo['receiver_idx']
        );
        $user_info = $user->getUser('*', $where);
        if($user_info){
            $todo['receiver_id'] = $user_info['id'];
            $todo['receiver_name'] = $user_info['name'];
        }else{
            $todo_list = null;
        }
        return $todo;
    }

    function getUserInfo($idx){
        $user = new User();
        $where = array(
            "idx"=>$idx
        );
        $user_info = $user->getUser('*', $where);
        return $user_info;
    }

    function add() {
        $this->checkAccessToken();
        if( !isset($_POST['category_idx']) || !isset($_POST['content']) || !isset($_POST['due_date']) || !isset($_POST['project_idx']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = "The category_idx or todo title or due date is required.";
            echo json_encode($this->result);
            exit;
        }
        if( !$this->checkIsMaster($_POST['project_idx'], $this->user_info['idx']) && !$this->checkIsManager($_POST['project_idx'], $this->user_info['idx'])){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "You do not have permission to add.";
            echo json_encode($this->result);
            exit;
        }
        $receiver_id = ( isset($_POST['receiver_idx']) ) ? $_POST['receiver_idx'] : $this->user_info['id'];
        $data = Array(
            "content" => $_POST['content'],
            "project_idx" => $_POST['project_idx'],
            "category_idx" => $_POST['category_idx'],
            "user_idx" => $this->user_info['idx'],
            "receiver_idx" => $receiver_id,
            "due_date" => $_POST['due_date'],
            "insert_date"=> date("Y-m-d H:i:s")
        );

        $todo_id = $this->Todo->add($data);
        //{idx,title,project_idx,task_idx,user_idx, receiver_idx,due_date,insert_date,is_finish, user_id, receiver_id}


        if(!$todo_id){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "Failed to add todo.";
        }else{
            $this->result['todo'] = $this->Todo->getTodo('*', array("id"=>$todo_id));
        }

        echo json_encode($this->result);
    }

    function modify() {
        $this->checkAccessToken();
        if( !isset($_POST['category_idx']) || !isset($_POST['content']) || !isset($_POST['receiver_idx']) || !isset($_POST['due_date']) || !isset($_POST['todo_idx']) || !isset($_POST['project_idx']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = "The category_idx or todo content or reciever or due date or todo_idx is required.";
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
            "content" => $_POST['content'],
            "category_idx" => $_POST['category_idx'],
            "user_idx" => $this->user_info['idx'],
            "receiver_idx" => $_POST['receiver_idx'],
            "due_date" => $_POST['due_date'],
            "insert_date"=> date("Y-m-d H:i:s")
        );

        $todo_id = $this->Todo->modify($_POST['todo_idx'], $data);
        if(!$todo_id){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "Failed to modify todo.";
        }

        echo json_encode($this->result);
    }

    function del() {
        $this->checkAccessToken();
        if( !isset($_POST['todo_idx']) || !isset($_POST['project_idx']) ){
            $this->result['error_info']['id'] = 0;
            $this->result['error_info']['msg'] = "The todo_idx is and project_idx required.";
            echo json_encode($this->result);
            exit;
        }
        if( !$this->checkIsMaster($_POST['project_idx'], $this->user_info['idx']) && !$this->checkIsManager($_POST['project_idx'], $this->user_info['idx'])){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "You do not have permission to delete.";
            echo json_encode($this->result);
            exit;
        }

        $todo_id = $this->Todo->del($_POST['todo_idx']);
        printr($todo_id);
        if(!$todo_id){
            $this->result['error_info']['id'] = 1;
            $this->result['error_info']['msg'] = "Failed to delete todo.";
        }

        echo json_encode($this->result);
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
        return ($user_idx != $item['master_idx']);
    }

    private function checkIsManager($project_idx, $user_idx){
        $user_project = New User_project();
        $where = array(
            "project_idx"=>$project_idx,
            "user_idx"=>$user_idx
        );
        $item = $user_project->getUserProject("is_manager", $where);
        return (1 != $item['is_manager']);
    }


}