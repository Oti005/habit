from backend import create_app  #importingt the factory function
from flask_cors import CORS
from flask_jwt_extended import JWTManager

print ("creating application")
app= create_app()  #creating aninstance for the app
jwt = JWTManager(app) #jwt nitialization, used for creating and verifying JWT tokens
CORS(app) #applying CORS here, this enables Cross-origin resource sharing (CORS) for all routes
print("Application created!")
if __name__=="__main__":  
    print("Running application...") 
    app.run(debug=True)    #Running the app with debug mode on