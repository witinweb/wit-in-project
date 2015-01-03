 <?php
/**
 * TasksController Class
 *
 * @category  Controller
 * @package   Task
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class TasksController extends Controller {
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

    function viewAll() {
        $this->checkAccessToken();
        if( !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The project_idx is required.';
            echo json_encode($this->result);
            exit;
        }

        $limit = array( 0, 1000 );
        $where = array( "t.project_idx"=>$_POST['project_idx'] );
        if( isset($_POST['category']) ) $where["t.category"] = $_POST['category'];
        $this->Task->join("user u", "u.idx=t.creator_idx", "LEFT");
        $column = array("t.idx as idx", "t.name as name", "t.description as description", "t.project_idx as project_idx", "t.category as category", "t.insert_date as insert_date","u.id as creator_id", "u.name as creator_name");
        $tasks = $this->Task->getList("task t", array('t.insert_date'=>'desc'), $limit, $where, $column);


        if($tasks){
            $this->result['result'] = 1;
            $this->result['task_list'] = $tasks;
        }else{
            $this->result['error_msg'] = "project does not exist.";
        }

        echo json_encode($this->result);
    }

    function add() {
        $this->checkAccessToken();
        if( !isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The task name or description or project_idx is required.';
            echo json_encode($this->result);
            exit;
        }

        $data = Array(
            "name" => $_POST['name'],
            "description" => $_POST['description'],
            "project_idx" => $_POST['project_idx'],
            "creator_idx" => $this->user_info['idx']
        );
        if( isset($_POST['category']) ) $data["category"] = $_POST['category'];
        if( isset($_POST['related_link']) ) $data["related_link"] = $_POST['related_link'];
        $task = $this->Task->add($data);

        if($task){
            $this->result['result'] = 1;
        }else{
            $this->result['error_msg'] = 'Failed to add task.';
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


}