<?php 
$type = $_GET['tp']; 
if($type=='insertCostume') insertCostume(); 
elseif($type=='costumes') costumes();
elseif($type=='get_uses') get_uses();
elseif($type=='get_theatrical_plays') get_theatrical_plays();

function insertCostume() {
    
        require 'config.php';

        $json = json_decode(file_get_contents('php://input'), true);
        $name = $json['name'];
        $description = $json['descr'];
        $use = $json['u_value'];
        $sex = $json['s_value'];
        $material = $json['material'];
        $technique = $json['technique'];
        $actors = $json['actors'];
        $location = $json['location'];
        $location_influence = $json['location_influence'];
        $designer = $json['designer'];
        $theatrical_play = $json['TP'];
        $parts=$json['parts'];
       
        $costumeData = ''; 
        $u='';
        $tp='';

        /*Get Use ID*/
        $res = $db->query("SELECT * FROM uses WHERE name='$use'");
        $u = $res->fetch_object();
        $use_id = $u->use_id;

        /*Get Theatrical Play id*/
        $res_tp = $db->query("SELECT * FROM theatrical_plays WHERE title='$theatrical_play'");
        $tp = $res_tp->fetch_object();
        $tp_id = $tp->theatrical_play_id;

        $result = $db->query("select * from costumes where name='$name'");
        $rowCount=$result->num_rows;

        if($rowCount==0){
            $db->query("INSERT INTO costumes(name, description, costume_use, sex, use_id)
                        VALUES('$name','$description','$use', '$sex', $use_id)");                
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
    $query = "SELECT name FROM uses";
    $result = $db->query($query);

    $usesData = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $usesData = json_encode($usesData);

    echo '{"usesData":'.$usesData.'}';
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
    $costume_id=$json['costume_id'];

    $query = "DELETE FROM costumes WHERE costume_id=$costume_id";
    $result = $db->query($query);
    if($result){
        echo '{"success":"Feed deleted"}';
    }
    else{
        echo '{"error":"Delete error"}';
    }

}

?>