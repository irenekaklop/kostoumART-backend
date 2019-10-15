<?php 
$type = $_GET['tp']; 
if($type=='insertCostume') insertCostume(); 
elseif($type=='costumes') costumes();
elseif($type=='get_uses') get_uses();
elseif($type=='get_theatrical_plays') get_theatrical_plays();
elseif($type=='costumeExists') costume_exists();
elseif($type=='insertUse') insertUse();
elseif($type=='existsUse') use_exists();
elseif($type=='insertTP') insert_theatrical_plays();
elseif($type=='deleteCostume') deleteCostume();

function insertCostume() {
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'), true);
    $name = $json['name'];
    $description = $json['descr'];
    $use = $json['u_value'];
    $sex = $json['s_value'];
    $material = $json['m_value'];
    $technique = $json['t_value'];
    $actors = $json['actors'];
    $location = $json['location'];
    $location_influence = $json['location_influence'];
    $designer = $json['designer'];
    //$theatrical_play = $json['tp_value'];
    $parts=$json['parts'];
       
    $costumeData = ''; 
    $u='';
    $tp='';
        
    /*Get Use ID*/
    $res = $db->query("SELECT * FROM uses WHERE name='$use'");
    $u = $res->fetch_object();
    $useID = $u->useID;
        
    /*Get Theatrical Play id*/
    /*$res_tp = $db->query("SELECT * FROM theatrical_plays WHERE title='$theatrical_play'");
    $tp = $res_tp->fetch_object();
    $tp_id = $tp->theatrical_play_id;*/

    $result = $db->query("select * from costumes where name='$name'");
    $rowCount=$result->num_rows;
    if($rowCount==0){
        $db->query("INSERT INTO costumes(name, description, costume_use, sex, useID, material, technique,
         designer, location, location_influence, actors, parts)
        VALUES('$name','$description','$use', '$sex', $useID, '$material', '$technique', '$designer',
        '$location','$location_influence','$actors','$parts')");                
        $costumeData ='';
        $query = "select * from costumes where name='$name'";
        $result= $db->query($query);
        $costumeData = $result->fetch_object();
        $costume_id=$costumeData->costume_id;
        $costumeData = json_encode($costumeData);
        echo '{"costumeData":'.$costumeData.'}';
        } 
    else {
        echo '{"error":" Costume name exists"}';
    }
}

function costume_exists(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);

    $name = $json['name'];

    $result = $db->query("select * from costumes where name='$name'");
    $rowCount = $result->num_rows;
    if($rowCount == 0){
        echo '{"exists":"false"}';
    }
    else{
        echo '{"exists":"true"}';
    }
}

function costumes(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);
    $query = "SELECT * FROM costumes";
    $result = $db->query($query);
    $costumeData = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $costumeData = json_encode($costumeData);
    echo '{"costumeData":'.$costumeData.'}';
}

function get_uses(){
    require 'config.php';
    $json =  json_decode(file_get_contents('php://input'),true);
    $query = "SELECT name, use_category FROM uses";
    $result = $db->query($query);
    $usesData = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $usesData = json_encode($usesData);
    echo '{"usesData":'.$usesData.'}';
}

function insertUse(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);
    $name = $json['name'];
    $use_category = $json['use_category'];
    $description = $json['description'];
    $customs = $json["customs"];
    $useData='';
    
    $db->query("INSERT INTO uses(name, use_category, description, customs)
    VALUES('$name', '$use_category', '$description', '$customs')");                
    $useData ='';
    $query = "select * from uses where name='$name'";
    $result= $db->query($query);
    $useData = $result->fetch_object();
    $useID=$useData->useID;
    $useData = json_encode($useData);
    echo '{"useData":'.$useData.'}';
}

function use_exists(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);

    $name = $json['name'];
    $use_category = $json['use_category'];
    $result = $db->query("select * from uses where name='$name' AND use_category='$use_category'");
    $rowCount = $result->num_rows;
    if($rowCount == 0){
        echo '{"exists":"false"}';
    }
    else{
        echo '{"exists":"true"}';
    }
}

function get_theatrical_plays(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);
    $query = "SELECT title FROM theatrical_plays";
    $result = $db->query($query);
    $TPData = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $TPData = json_encode($TPData);
    echo '{"TPData":'.$TPData.'}';
}

function insert_theatrical_plays(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);
    $title = $json['name'];
    $theater=$json['theater'];
    $date=$json['date'];
    $actors=$json['actors'];
    $director=$json['director'];
    $tpData='';

    $result = $db->query("select * from theatrical_plays where title='$title'");
    $rowCount=$result->num_rows;

    if($rowCount==0){
        $db->query("INSERT INTO theatrical_plays(title, date, actors, director, theater)
        VALUES('$title', '$date', '$actors', '$director', '$theater')");        
        $tpData ='';
        $query = "select * from theatrical_plays where title='$title'";
        $result= $db->query($query);
        $tpData = $result->fetch_object();
        $theatrical_play_id=$tpData->theatrical_play_id;
        $tpData = json_encode($tpData);
        echo '{"tpData":'.$tpData.'}';
    }
    else{
        echo '{"error":" Use name exists"}';
    }
}

function get_accessories(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'),true);
    $query = "SELECT title FROM accessories";
    $result = $db->query($query);
    $accessoriesData = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $accessoriesData = json_encode($accessoriesData);
    echo '{"TPData":'.$accessoriesData.'}';
}

function deleteCostume(){
    require 'config.php';
    $json = json_decode(file_get_contents('php://input'), true);
    $costume_id=$json['selectedCostumeId'];
    $query = "DELETE FROM costumes WHERE costume_id=$costume_id";
    $result = $db->query($query);
    $deleted = false;
    if($result){
        $deleted=true;
    }
    echo '{"deleted":'.$deleted.'}';
}
?>