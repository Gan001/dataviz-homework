from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
import numpy as np
import pandas as pd
import datetime as dt
from collections import defaultdict

#create engine
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

# Design a query to retrieve the last 12 months of precipitation data and plot the results
date_results = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
last_year = date_results[0]
last_year_split = last_year.split("-")
last_year_split[0] = str(int(last_year_split[0])-1)
one_year_ago = "-".join(last_year_split)

# Perform a query to retrieve the data and precipitation scores
results = session.query(Measurement.date, Measurement.prcp).\
          filter(Measurement.date >= one_year_ago).filter(Measurement.prcp != "None").all()

# Save the query results as a Pandas DataFrame and set the index to the date column
# df = pd.DataFrame(results, columns = ['date', 'precipitation'])
# df.set_index('date', inplace=True, )
prcp_df = pd.DataFrame(results).sort_values('date')
prcp_dict = prcp_df.to_dict('records')

prcp_default =defaultdict(list)
for i in range(len(prcp_dict)):
    prcp_default[prcp_dict[i]['date']].append(prcp_dict[i]['prcp'])

adjust_prcp_dict = dict(prcp_default)

# Sort the dataframe by date
#sorted_df = df.sort_values('date')
#List of stations
stations = session.query(Measurement.station).group_by(Measurement.station).all()
station_list =[]
for station in stations:
    station_list.append(station[0])   
                           
#list of temperature observations
tobs = session.query(Measurement.station,Measurement.tobs).order_by(Measurement.station).filter(Measurement.date >= one_year_ago).all()

#Setup Flask
app = Flask(__name__)

#Flask routes
@app.route("/")
def welcome():
    return "Home Page"


@app.route("/api/v1.0/precipitation")
def precipitation():
    return jsonify(adjust_prcp_dict)

@app.route("/api/v1.0/stations")
def station_lists():
    return jsonify(station_list)

@app.route("/api/v1.0/tobs")
def observations():
    return jsonify(tobs)

if __name__ == "__main__":
    app.run(debug=True)
