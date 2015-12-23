<template name="main">
  <style>
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .content {
    padding: 10px;
  }
  </style>
  <div id="$ROOT">
    <div class="title">Personal Business Card [<a class="link-modify" href="javascript:;">modify</a>]</div>
    <div class="content"></div>
  </div>
  <script>
  var contentBox = $(ROOT).find('.content');
  var viewHtml = include('view');
  contentBox.html(viewHtml);
  $(ROOT).find('.title a.link-modify').on('click', function(){
    var editHtml = include('edit');
    contentBox.html(editHtml);
  });
  </script>
</template>

<template name="view">
  <style>
  ul li{
    border: 1px solid #ccc;
  }
  </style>
  <div id="$SUBROOT">
    <ul>
      <li>Name: <?=name?></li>
      <li>Gender: <?=gender?></li>
      <li>Age:<?=age?></li>
    </ul>
  </div>
</template>

<template name="edit">
  <style>
  ul li{
    margin: 0 10px;
    background-color: #eee;
  }
  </style>
  <div id="$SUBROOT">
    <form action="">
      <ul>
        <li>Name: <input type="text" name="name" value="<?=name?>" /></li>
        <li>Gender: <input type="text" name="gender" value="<?=gender?>" /></li>
        <li>Age: <input type="text" name="age" value="<?=age?>" /></li>
      </ul>
      <div class="form-actions">
        <button type="submit">Save</button>
      </div>
    </form>
  </div>
  <script>
  $(SUBROOT).find('form').on('submit', function(){
    var name = $(this).find('input[name="name"]').val(),
      gender = $(this).find('input[name="gender"]').val(),
      age = $(this).find('input[name="age"]').val();
    $DATA.name = name;
    $DATA.gender = gender;
    $DATA.age = age;
    var viewHtml = include('view');
    $(ROOT).find('.content').html(viewHtml);
    return false;
  });
  </script>
</template>