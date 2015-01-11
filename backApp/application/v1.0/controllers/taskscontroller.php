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

    function viewAll() {
        $this->checkAccessToken();
        if( !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The project_idx is required.';
            echo json_encode($this->result);
            exit;
        }

        $categories = $this->categoryList($_POST['project_idx']);
        $category_list = array();
        $i = 0;
        if($categories){
            foreach($categories as $category){
                $category_list[$i]['category_name'] = $category['category'];
                $limit = array( 0, 1000 );
                $where = array(
                    "t.project_idx"=>$_POST['project_idx'],
                    "t.category"=>$category['category']
                );
                $this->Task->join("user u", "u.idx=t.creator_idx", "LEFT");
                $column = array("t.idx as idx", "t.name as name", "t.description as description", "t.project_idx as project_idx", "t.category as category", "t.insert_date as insert_date","u.id as creator_id", "u.name as creator_name");
                $tasks = $this->Task->getList("task t", array('t.insert_date'=>'desc'), $limit, $where, $column);
                $category_list[$i]['task_list'] = $tasks[0];
                $i++;
            }
        }else{
            $this->result['result'] = 1;
            $this->result['category_list'] = null;
            echo json_encode($this->result);
            exit;
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

    protected function categoryList($project_idx){
        $categories = $this->Task->rawQuery("SELECT DISTINCT category FROM task WHERE project_idx = ?", array($project_idx));
        if($categories){
            return $categories[0];
        }else{
            return null;
        }
    }

    function del() {
        $this->checkAccessToken();
        if( !isset($_POST['task_idx']) || !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The task_idx and project_idx is required.';
            echo json_encode($this->result);
            exit;
        }
        if( !$this->checkIsMaster($_POST['project_idx'], $this->user_info['idx']) && !$this->checkIsManager($_POST['project_idx'], $this->user_info['idx'])){
            $this->result['error_msg'] = 'You do not have permission to update.';
            echo json_encode($this->result);
            exit;
        }

        if($this->Task->del($_POST['task_idx'])){
            $this->result['result'] = 1;
        }else{
            $this->result['error_msg'] = 'Failed to delete task.';
        }
    }


    function modify() {
        $this->checkAccessToken();
        if( !isset($_POST['task_idx']) || !isset($_POST['project_idx']) ){
            $this->result['error_msg'] = 'The task_idx and project_idx is required.';
            echo json_encode($this->result);
            exit;
        }
        if( !$this->checkIsMaster($_POST['project_idx'], $this->user_info['idx']) && !$this->checkIsManager($_POST['project_idx'], $this->user_info['idx'])){
            $this->result['error_msg'] = 'You do not have permission to update.';
            echo json_encode($this->result);
            exit;
        }
        $data = array();
        if( isset($_POST['name']) ) $data["name"] = $_POST['name'];
        if( isset($_POST['description']) ) $data["description"] = $_POST['description'];
        if( isset($_POST['category']) ) $data["category"] = $_POST['category'];
        if( count($data) > 0 ){
            $data["modify_date"] = date("Y-m-d H:i:s");
            if($this->Task->modify($_POST['task_idx'], $data)){
                $this->result['result'] = 1;
            }else{
                $this->result['error_msg'] = 'Failed to update task.';
            }
        }else{
            $this->result['error_msg'] = 'There is no information to be updated.';
        }

        echo json_encode($this->result);
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