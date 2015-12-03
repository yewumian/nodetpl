<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>
<body>
<p>Hello, <?=@user?>.</p>
<ul>
  <?for(var i=0; i<@favor.length; i++){?>
    <li><?=@favor[i]?></li>
  <?}?>
</ul>
</body>
</html>