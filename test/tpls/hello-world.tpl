<style>
{width:500px;}
.title{font-size:14px;}
.content{border: 1px solid #ccc;padding:10px;}
.content a{text-decoration:underline;}
</style>
<div id="$ROOT">
  <div class="title">This is a test.</div>
  <div class="content">
    Welcome back, this is my first <a href="https://github.com/pillys/nodetpl">nodetpl</a> template
  </div>
</div>
<script>
$ROOT.find('.title').css({
  "font-weight": "bold"
});
</script>