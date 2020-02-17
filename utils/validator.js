module.exports = {

    user:(app, request, response) => {
        
        request.assert('name', 'O nome é obrigátorio').notEmpty();
        request.assert('email', 'Email inválido').notEmpty().isEmail();

        let errors = request.validationErrors();

        if (errors) {
            app.utils.error.send(errors, request, response);
            return false;
        } 
        else {
            return true;
        }
    }

}