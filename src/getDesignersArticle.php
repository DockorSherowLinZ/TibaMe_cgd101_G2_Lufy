<?php 
session_start();
try{
	require_once("../../connect_lufy.php");

	$sql = "select * from designer where manager_no = :cur_manager"; //準備好sql指令
	$designers = $pdo->query($sql);//將sql指令送到mysql去執行, 回傳的是pdoStatement
    $designers -> bindValue(":cur_manager", $_SESSION["manager_no"]);
	$designersRows = $designers->fetchAll(PDO::FETCH_ASSOC);
	echo json_encode($designersRows);
}catch(PDOException $e){
	//$msg =  "系統暫時無法提供服務, 請聯絡系統維護人員<br>";
	echo "錯誤訊息 : ", $e->getMessage(), "<br>";
	echo "錯誤行號 : ", $e->getLine(), "<br>";
	//echo [$msg];
}
?>