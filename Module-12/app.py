from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_mars
import pymongo

app = Flask(__name__)

# # Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

@app.route("/")
def home():

    # Find one record of data from the mongo database
    martian_data = mongo.db.collection.find_one()
    
    # Return template and data
    return render_template("index.html", mars=martian_data)



@app.route("/scrape")
def scrape():
    #drop collection if it exists
    mongo.db.collection.drop()
    # Run the scrape function
    mars_data = scrape_mars.scrape()

    # Update the Mongo database using update and upsert=True
    mongo.db.collection.update({}, mars_data, upsert=True)

    # Redirect back to home page
    return redirect("/")





if __name__ == "__main__":
    app.run(debug=True)
