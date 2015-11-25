<style>
h1{
  color: #f00;
}
</style>
<div id="$ROOT">
  <h1><?=title?></h1>
  <ul>
    <?for(var i=0; i<favor.length; i++){?>
      <li><?=i?>：<?=favor[i]?></li>
    <?}?>
  </ul>
</div>
<script>
alert(0);
//var fragment = document.createDocumentFragment();
</script>