var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
});

window.onload = function(){
    // document.getElementById('alert').innerHTML=vars['err'];
    if(vars['ref'] == undefined && vars['err'] == undefined){
        location.href = window.location.href +'?ref=admin'
    }
    else if(vars['err']){
        document.getElementById('alert').innerHTML= decodeURI(vars['err']);
    }
    else if(vars['ref'] == 'admin'){
        document.getElementsByName('username')[0].value = 'admin';
    }
    else if(vars['ref'].length == 32){
        //Checking if its a hash value
        document.getElementsByName('username')[0].value = vars['ref'];
    }
    else{
        // document.getElementsByName('username')[0].placeholder = 'Error';
        document.getElementsByName('username')[0].placeholder = 'Error';
        document.getElementsByName('password')[0].placeholder = 'Error';

        document.getElementsByName('username')[0].disabled="disabled"
        document.getElementsByName('password')[0].disabled="disabled"
        document.getElementsByName('submit')[0].disabled="disabled"

        document.getElementById('alert').innerHTML='Wrong link. Try again with correct link.';
    }

    
};