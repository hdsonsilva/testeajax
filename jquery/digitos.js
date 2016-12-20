//--->Função para verificar se o valor digitado é número...<---
function digitos(event){
        if (window.event) {
                // IE
                key = event.keyCode;
        } else if ( event.which ) {
                // netscape
                key = event.which;
        }
        if ( key != 8 || key != 13 || key < 48 || key > 57 )
                return ( ( ( key > 47 ) && ( key < 58 ) ) || ( key == 8 ) || ( key == 13 ) );
        return true;
}