<?php
/**
 * To do Model Class
 *
 * @category  Model
 * @package   To do
 * @author    Gongjam <guruahn@gmail.com>
 * @copyright Copyright (c) 2014
 * @license   http://opensource.org/licenses/gpl-3.0.html GNU Public License
 * @version   1.0
 **/

class Todo extends Model {
    /*
	* Get a to do
	* @param
	* @return array
	*/
    public function getTodo($column = "*", $where = null)
    {
        if( is_array($where) && !is_null($where) )
        {
            foreach($where as $key => $value)
            {
                $this->where($key,$value);
            }
            $todo = $this->getOne("todo", $column);
        }else{
            $todo = $this->get("todo", $column);

        }
        return	$todo;
    }

    /*
     * Get list
     * @param
     * @return array
     */
    public function getList($table = "todo", $orderby = null, $limit, $where = null, $columns = null) {
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
            $todos = $this->get($table, $limit, $columns);
        }else{
            $todos = $this->get($table, $limit);
        }

        return $todos;
    }

    /*
    * add to do
    * @param
    * @return array
    */
    public function add($data)
    {
        $idx = $this->insert('todo', $data);
        return	$idx;
    }

    /*
    * update to do
    * @param
    * @return array
    */
    public function updateTodo($idx, $data)
    {
        $this->where ('idx', $idx);
        return	$this->update('todo', $data);
    }

    /*
    * delete to do
    * @param
    * @return array
    */
    public function del($idx)
    {
        $this->where ('idx', $idx);
        return	$this->delete('todo');
    }

    /*
    * add attachment
    * @param
    * @return array
    */
    public function addAttachment($data)
    {
        $id = $this->insert('attachment', $data);
        return	$id;
    }

    /*
    * get attachment
    * @param
    * @return array
    */
    public function getAttachment($column, $where)
    {
        if( is_array($where) && !is_null($where) )
        {
            foreach($where as $key => $value)
            {
                $this->where($key,$value);
            }
        }
        $files = $this->get('attachment', null, $column);
        $result = Array();
        foreach($files as $key => $value){
            array_push($result, $value['url']);
        }
        return $result;
    }

    /*
    * delete attachment
    * @param
    * @return array
    */
    public function delAttachment($where)
    {
        if( is_array($where) && !is_null($where) )
        {
            foreach($where as $key => $value)
            {
                $this->where($key,$value);
            }
        }
        return	$this->delete('attachment');
    }
}