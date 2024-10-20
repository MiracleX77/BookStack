<?php

namespace BookStack\Search;

use BookStack\App\Model;

class SearchHistory extends Model
{
    protected $table = 'search_history';
    protected $fillable = ['user_id', 'search_term', 'searched_at'];
    public $timestamps = true;

    /**
     * Get the user that this search term belongs to.
     */
    public function entity()
    {
        return $this->morphTo('entity');
    }
}