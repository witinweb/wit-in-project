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

class User_project extends Model {


    /*
     * Get list
     * @param
     * @return array
     */
    public function getList($orderby = null, $limit, $where = null) {
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
        $posts = $this->get('user_project', $limit);
        return $posts;
    }

    /*
    * add post
    * @param
    * @return array
    */
    public function add($data)
    {
        $id = $this->insert('user_project', $data);
        return	$id;
    }

    /*
    * update post
    * @param
    * @return array
    */
    public function modify($where, $data)
    {
        if( !is_null($where) && is_array($where) ){
            foreach($where as $key => $value){
                if(!is_null($value)) $this->where($key,$value);
            }
        }
        return	$this->update('user_project', $data);
    }

    /*
    * delete post
    * @param
    * @return array
    */
    public function del($idx)
    {
        $this->where ('idx', $idx);
        return	$this->delete('user_project');
    }


}