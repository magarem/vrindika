var express = require('express');
var app = express();
const path = require('path');
const axios = require('axios')

// set the view engine to ejs
app.set('view engine', 'ejs');



function removeTags(str) {
  if ((str===null) || (str===''))
      return false;
  else
      str = str.toString();
        
  // Regular expression to identify HTML tags in 
  // the input string. Replacing the identified 
  // HTML tag with a null string.
  return str.replace( /(<([^>]+)>)/ig, '');
}

const isObj = o => o?.constructor === Object;

function dataExtract(font, key, value){
    if (isObj(font)) font = Object.values(font)
    const ret = font.filter(item => item[key] == value)
    if (ret.length == 0) {
      return false
    }
    if (ret.length == 1) {
      return ret[0]
    }
    if (ret.length > 1) {
      return ret
    }
}

function stripHtml(html)
{
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


// index page
app.get('/', function(req, res) {
  // res.render('pages/index', {
  //   tagline: "Maguete!!!"
  // });
  axios.get('https://vrindika.zenbase.app/api/json?username=vrindika')
  .then(function (response) {
    // handle success
    const result = response.data
    console.log(result);
    //Navbar
    const result_navbar = dataExtract(result, 'id', 'deffields' )
    // console.log(result_navbar);
    const logo = dataExtract(result_navbar, 'key', 'logo' ).value;
    console.log(logo);
    const menu = dataExtract(result_navbar, 'key', 'menu' ).value.split(',')
    console.log(menu); 
    const copyright = dataExtract(result_navbar, 'key', 'copyright' ).value
    console.log(copyright);
    const navbar = {"logo": logo, "menu": { "portfolio": menu[0], "about": menu[1], "contact": menu[2]}, copyright}
  
    //Header
    const result_header = dataExtract(result, 'id', 'header' )
    const txt1 = dataExtract(result_header.extra, 'key', 'txt1' ).value
    const txt2 = dataExtract(result_header.extra, 'key', 'txt2' ).value
    const background = dataExtract(result_header.extra, 'key', 'background' ).value
    const avatar = dataExtract(result, 'id', 'header' ).img[0].value
    const header = {title: txt1, subtitle: removeTags(txt2||''), avatar: avatar, background }
    console.log(header);
    
    //Portfolio
    let portfolio = dataExtract(result, 'folder', 'co7c4imk5fllbmotmt8' ).sort((a, b) => (a.order > b.order) ? 1 : -1)
    console.log(portfolio);
    portfolio = portfolio.map((item)=>{
      return {title: item.title, img: item.img[0].value, body: item.body}
    })
    console.log(portfolio);
   
    //About
    const result_about = dataExtract(result, 'id', 'about' )
    console.log(result_about);
    const result_about_txt1 = dataExtract(result_about.extra, 'key', 'txt1' )
    const result_about_txt2 = dataExtract(result_about.extra, 'key', 'txt2' )
    const about = {txt1: result_about_txt1.value, txt2: result_about_txt2.value}
    console.log(about);
    
    //Footer
    const result_footer = dataExtract(result, 'id', 'footer' )
    console.log(result_footer);
    const result_footer_location = dataExtract(result_footer.extra, 'key', 'location' )
    const result_footer_midias = dataExtract(result_footer.extra, 'key', 'midias' )
    const result_footer_about = dataExtract(result_footer.extra, 'key', 'about' )
    const footer = {location: result_footer_location.value, midias: result_footer_midias.value, about: result_footer_about.value }
    console.log(footer);
    

    app.use(express.static(__dirname+'/public/themes/freelancer/'));
    res.render(`${__dirname}/public/themes/freelancer`, {navbar, header, portfolio, about, footer});
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  // console.log(header);
  // app.use(express.static(__dirname+'/public/themes/freelancer/'));
  // res.render(`${__dirname}/public/themes/freelancer`, {header});
});


app.listen(8080);
console.log('Server is listening on port 8080');