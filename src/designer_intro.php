
<?php
$errMsg = "";
try {
	require_once("../../connect_lufy.php");
	//.......確定是否上傳成功
	if( $_FILES["upFile"]["error"] == UPLOAD_ERR_OK){
		//----------------------
		//先檢查images資料夾存不存在
		if( file_exists("images") === false){
			mkdir("images");
		}
		//將檔案copy到要放的路徑
		$fileInfoArr = pathinfo($_FILES["upFile"]["name"]);
		$fileName = uniqid().".{$fileInfoArr["extension"]}"; //usq321Bddd.gif 

		$from = $_FILES["upFile"]["tmp_name"];
		$to = "images/$fileName";
       
		if(copy( $from, $to)===true){
            echo 1 ;
			//將檔案名稱寫回資料庫
			$sql = "UPDATE `designer` SET `des_name`=:dtitle,`des_text`=:dtext,`des_img_ path`=:fileName";
            
			$designer = $pdo->prepare( $sql );
			$designer -> bindValue(":dtitle", $_POST["desTitle"]);
			$designer -> bindValue(":dtext", $_POST["desIntro"]);
			
			$designer -> bindValue(":fileName", $fileName);
			$designer -> execute();
			// echo "商品編號:", $pdo->lastInsertId();
            echo "sucess";
		}

	}else{
		// echo "錯誤代碼 : {$_FILES["upFile"]["error"]} <br>";
		echo "新增失敗<br>";
	}
} catch (PDOException $e) {
	$errMsg .= "錯誤原因 : ".$e -> getMessage(). "<br>";
	$errMsg .= "錯誤行號 : ".$e -> getLine(). "<br>";	
}
// echo $errMsg;

?>    
