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

class Post extends Model {
    /*
	* Get a post
	* @param
	* @return array
	*/
    public function getPost($column = "*", $where = null)
    {
        if( is_array($where) && !is_null($where) )
        {
            foreach($where as $key => $value)
            {
                $this->where($key,$value);
            }
            $post = $this->getOne("post", $column);
        }else{
            $post = $this->get("post", $column);

        }
        return	$post;
    }

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
        $posts = $this->get('post', $limit);
        return $posts;
    }

    /*
    * add post
    * @param
    * @return array
    */
    public function add($data)
    {
        $idx = $this->insert('post', $data);
        return	$idx;
    }

    /*
    * update post
    * @param
    * @return array
    */
    public function updatePost($idx, $data)
    {
        $this->where ('idx', $idx);
        return	$this->update('post', $data);
    }

    /*
    * delete post
    * @param
    * @return array
    */
    public function del($idx)
    {
        $this->where ('idx', $idx);
        return	$this->delete('post');
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