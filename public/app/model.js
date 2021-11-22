const footer = `
<footer>
<div class="copyright">
  <p>Copyright © 2019 The Jungle Cook</p>
</div>
<div class="footerLinks">
  <a id="footerLogin" href="#/login">Login</a>
  <a href="#">Recipes by Category</a>
  <a href="#">Privacy and Copyright</a>
  <a id="footerCreate" href="#/create">Create Recipe</a>
  <a id="footerYour" href="#/your">Your Recipes</a>
</div>
<div class="social">
  <a href="https://www.facebook.com/"
    ><img src="images/facebook.svg"
  /></a>
  <a href="https://www.instagram.com/"
    ><img src="images/instagram.svg"
  /></a>
</div>
</footer>`;

var MODEL = (function () {
  function _getPageContent(pageName, callback) {
    let pageInfo = `./pages/${pageName}/${pageName}.html`;
    $.get(pageInfo, (data) => {
      console.log(data);
      $("#app").html(data + footer);
      if (callback) {
        callback();
      }
    });
  }

  return {
    getPageContent: _getPageContent,
  };
})();

$("#home").addClass("currentPage");

$("nav a").click(function () {
  $("nav").removeClass("active");
  $("nav a.currentPage").removeClass("currentPage");
  $(this).addClass("currentPage");
});

$("#logo").click(function () {
  $("nav").removeClass("active");
  $("nav a.currentPage").removeClass("currentPage");

  $("#home").addClass("currentPage");
});
