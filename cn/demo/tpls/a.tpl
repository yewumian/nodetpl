<style type="text/css">
a{
  font-size: 12px;
}
</style>
<div id="$ROOT">
  <h1><?=@title?></h1>
  <ul>
    <?for(var i=0; i<@favor.length; i++){?>
      <li><?=i?>：<?=@favor[i]?></li>
    <?}?>
  </ul>
</div>
<script>
console.log($(ROOT));
</script>