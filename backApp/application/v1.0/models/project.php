<?php
/**
 * Post Model Class
 *
 * @category  Model
 * @package   Post
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class Project extends Model {
    /*
	* Get a project
	* @param
	* @return array
	*/
    public function getProject($column = "*", $where = null)
    {
        if( is_array($where) && !is_null($where) )
        {
            foreach($where as $key => $value)
            {
                $this->where($key,$value);
            }
            $post = $this->getOne("project", $column);
        }else{
            $post = $this->get("project", $column);

        }
        return	$post;
    }

    /*
     * Get list
     * @param
     * @return array
     */
    public function getList($table = "project", $orderby = null, $limit, $where = null, $columns = null) {
        if( !is_null($orderby) && is_array($orderby) ){
            foreach($orderby as $key => $value){
                $this->orderBy($key,$value);
            }
        }
        if( !is_null($where) && is_array($where) ){
            foreach($where as $key => $value){
                if(!is_null($value)) $this->where($key,$value);
            }
        }
        if ( !is_null($columns) && is_array($columns) ){
            $projects = $this->get($table, $limit, $columns);
        }else{
            $projects = $this->get($table, $limit);
        }
        return $projects;
    }

    /*
    * add project
    * @param
    * @return array
    */
    public function add($data)
    {
        $id = $this->insert('project', $data);
        return	$id;
    }

    /*
    * update project
    * @param
    * @return array
    */
    public function modify($idx, $data)
    {
        $this->where ('idx', $idx);
        return	$this->update('project', $data);
    }

    /*
    * delete project
    * @param
    * @return array
    */
    public function del($idx)
    {
        $this->where ('idx', $idx);
        return	$this->delete('project');
    }


}