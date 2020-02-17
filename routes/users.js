let NeDB = require('nedb');
let db = new NeDB({
    filename:'user.db',
    autoload:true
});

module.exports = app => {

    let users = app.route('/users');
    
    users.get((request, response) =>{

        db.find({}).sort({name:1}).exec((error, users) => {
            if (error) {
                app.utils.error.send(error, request, response);
            }
            else{
                response.statusCode = 200;
                response.setHeader('Content-Type', 'application/json');
                response.json(
                    {                       
                        users
                    }
                );
            }
        });

        
    });

    users.post((request, response) =>{

        if (!app.utils.validator.user(app, request, response)) {
            return false;
        }
                
        db.insert(request.body, (error, user) => {
            if(error){
                app.utils.error.send(error, request, response);
            }
            else{
                response.status(200).json(user);
            }
        });
    });

    let userById = app.route('/users/:id');

    userById.get((request, response) => {
       
        db.findOne({_id:request.params.id}).exec((error, user)=>{
            if(error){
                app.utils.error.send(error, request, response);
            }
            else{
                response.status(200).json(user);
            }
        });
    });

    userById.put((request, response) => {
        
        if (!app.utils.validator.user(app, request, response)) {
            return false;
        }

        db.update({_id:request.params.id}, request.body, error  =>{
            if(error){
                app.utils.error.send(error, request, response);
            }
            else{
                response.status(200).json(Object.assign(request.body, request.params));
            }
        });
    });

    userById.delete((request, response) => {
        
        db.remove({_id:request.params.id}, {}, error  =>{
            if(error){
                app.utils.error.send(error, request, response);
            }
            else{
                response.status(200).json(request.params);
            }
        });
    });

}
