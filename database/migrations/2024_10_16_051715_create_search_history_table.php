<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('search_history', function (Blueprint $table) {
            $table->increments('id'); 
            $table->unsignedInteger('user_id'); 
            $table->string('search_term'); 
            $table->timestamp('searched_at')->default(DB::raw('CURRENT_TIMESTAMP')); // เวลาที่ค้นหา

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('search_history');
    }
};
